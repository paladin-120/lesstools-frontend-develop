import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import BigNumber from 'bignumber.js/bignumber';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { getGasPrice, IGasPrice } from '../../api/getGasPrice';
import { useMst } from '../../store/store';
import { WHITELIST } from '../../data/whitelist';
import { ETH_PRICE_QUERY, GET_HOT_PAIRS, GET_HOT_PAIRS_SUSHISWAP } from '../../queries/index';
import { uniswapSubgraph, sushiswapSubgraph } from '../../index';

import s from './InfoBlock.module.scss';

import gasIcon from '../../assets/img/icons/gas.svg';
import hotIcon from '../../assets/img/icons/hot.svg';
import { ReactComponent as MetaMaskIcon } from '../../assets/img/icons/metamask.svg';
import { uppercaseFirstLetter } from '../../utils/prettifiers';
import { Networks } from '../../config/networks';
import {
  ExchangesByNetworks,
  ExchangesIcons,
  isExchangeLikeSushiswap,
} from '../../config/exchanges';
import { is } from '../../utils/comparers';
import TheGraph from '../../services/TheGraph';
import { SubgraphsByExchangeShort } from '../../config/subgraphs';
import { getStartOfHour } from '../../utils/time';
import { IPairFromGraph } from '../../pages/BoardPage/HotTable';
import PromotedToken from './PromotedToken';
import HotTokenAdmin from './HotTokenAdmin';
import backend, { IAdminToken } from '../../services/backend';

const InfoBlock: React.FC<any> = observer(() => {
  const [adminTokens, setAdminTokens] = useState<Array<IAdminToken>>([]);

  useEffect(() => {
    backend.getAdminTokens().then((res) => {
      if (res) {
        setAdminTokens(res.pairs);
      }
    });
  }, []);

  const { user }: { user: any } = useMst();

  const [gasPrice, setGasPrice] = useState<IGasPrice | null>(null);

  const location = useLocation();

  const network = uppercaseFirstLetter(location.pathname.split('/')[1] || Networks.Ethereum);

  type response = { bundle: { ethPrice: string } };
  const { data: ethPrice } = useQuery<response>(ETH_PRICE_QUERY, {
    pollInterval: 30000,
    client: is(network, Networks.Ethereum) ? uniswapSubgraph : sushiswapSubgraph,
  });

  // get gas price every 10 sec
  useEffect(() => {
    getGasPrice().then((res) => setGasPrice(res));

    const timer = setInterval(() => {
      getGasPrice().then((res) => setGasPrice(res));
    }, 10000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Hot pairs
  const [hotPairs, setHotPairs] = useState<any>({});

  function formatData(pair: any, exchange: string) {
    try {
      const pairsSumma: { [key: string]: IPairFromGraph } = {};
      const addPairToSumm = (info: IPairFromGraph) => {
        const tbr = WHITELIST.includes(info.pair.token0.id) ? info.pair.token1 : info.pair.token0;
        if (tbr.symbol in pairsSumma) {
          const newInfo = { ...info };
          newInfo.exchange = exchange;
          newInfo.hourlyTxns = (+info.hourlyTxns + +pairsSumma[tbr.symbol].hourlyTxns).toString();
          pairsSumma[tbr.symbol] = newInfo;
        } else {
          const newInfo = { ...info };
          newInfo.exchange = exchange;
          pairsSumma[tbr.symbol] = newInfo;
        }
      };
      pair.currentHour.forEach((info: IPairFromGraph) => addPairToSumm(info));
      pair.oneHour.forEach((info: IPairFromGraph) => addPairToSumm(info));
      pair.twoHours.forEach((info: IPairFromGraph) => addPairToSumm(info));
      const finalData = Object.values(pairsSumma)
        .sort((a: IPairFromGraph, b: IPairFromGraph) => +b.hourlyTxns - +a.hourlyTxns)
        .filter(
          (el) => !(WHITELIST.includes(el.pair.token0.id) && WHITELIST.includes(el.pair.token1.id)),
        );
      return finalData;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  const getDataForAllExchangesOfNetwork = useCallback(async (net: string) => {
    try {
      const exchanges = ExchangesByNetworks[net] || [];
      const exchangesOfNetwork = Object.values(exchanges);
      if (!exchangesOfNetwork.length) return {};
      const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
        return TheGraph.query({
          subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
          query: isExchangeLikeSushiswap(exchangeOfNetwork)
            ? GET_HOT_PAIRS_SUSHISWAP
            : GET_HOT_PAIRS,
          variables: {
            timestamp1: getStartOfHour(),
            timestamp2: getStartOfHour() - 3600,
            timestamp3: getStartOfHour() - 7200,
          },
        });
      });
      const result = await Promise.all(results);
      const resultsFormatted: any[] = result.map((pair: any, i: number) => {
        return formatData(pair, exchangesOfNetwork[i]);
      });
      const resultsConсatenated = [].concat(...resultsFormatted);
      const resultsSorted = resultsConсatenated.sort(
        (a: any, b: any) => +b.hourlyTxns - +a.hourlyTxns,
      );

      // setHotPairs({ [network]: resultsContatenated });
      return { [net]: resultsSorted };
    } catch (e) {
      console.error('HotTable getDataForAllExchangesOfNetwork:', e);
      return {};
    }
  }, []);

  const getAllData = useCallback(async () => {
    try {
      const newHotPairBinance = await getDataForAllExchangesOfNetwork(Networks.Binance);
      const newHotPairEthereum = await getDataForAllExchangesOfNetwork(Networks.Ethereum);
      const newHotPairPolygon = await getDataForAllExchangesOfNetwork(Networks.Polygon);
      const newHotPairAvalanche = await getDataForAllExchangesOfNetwork(Networks.Avalanche);
      const newHotPairXdai = await getDataForAllExchangesOfNetwork(Networks.Xdai);
      const newHotPairFantom = await getDataForAllExchangesOfNetwork(Networks.Fantom);
      setHotPairs({
        ...newHotPairBinance,
        ...newHotPairEthereum,
        ...newHotPairPolygon,
        ...newHotPairAvalanche,
        ...newHotPairXdai,
        ...newHotPairFantom,
      });
    } catch (e) {
      console.error(e);
    }
  }, [setHotPairs, getDataForAllExchangesOfNetwork]);

  useEffect(() => {
    getAllData();
    const interval = setInterval(getAllData, 60000);
    return () => clearInterval(interval);
  }, [getAllData]);

  return (
    <section className={s.info}>
      <div className={s.info_inner}>
        <div className={s.left}>
          <div className={s.cell}>
            <Link to="/user-account" className={`${s.metamask_link} ${s.mobile}`}>
              <MetaMaskIcon className={s.metamask_link_img} />
              <span>
                {/* eslint-disable-next-line */}
                {!user.walletId
                  ? 'Connect'
                  : !user.isVerified
                  ? 'Verify'
                  : `${user.walletId.slice(0, 5)}...${user.walletId.slice(-5)}`}
              </span>
            </Link>
          </div>

          <div className={s.cell}>
            <div className={s.cell_text}>
              ETH: ${new BigNumber(ethPrice?.bundle?.ethPrice || 0).toFormat(2)}
            </div>
          </div>
          <div className={s.cell}>
            <div className={s.cell_img}>
              <img src={gasIcon} alt="gasIcon" />
            </div>
            <div
              data-multiline
              data-tip={`Low: ${(gasPrice?.safeLow || 0) / 10} <br/> Medium: ${
                (gasPrice?.average || 0) / 10
              } <br/> Fast: ${(gasPrice?.fast || 0) / 10}`}
              data-effect="solid"
              data-place="bottom"
              className={s.cell_text}
            >
              <span>{(gasPrice?.average || 0) / 10} GWEI</span>
            </div>
          </div>
          <div className={s.cell}>
            <div className={s.cell_img}>
              <img src={hotIcon} alt="hotIcon" />
            </div>
            <div className={s.cell_text}>HOT PAIRS</div>
          </div>
        </div>
        <div className={s.right}>
          <div className={s.marquee}>
            <div className={s.table}>
              {adminTokens.map((info, index) => (
                <HotTokenAdmin
                  index={index + 1}
                  key={info.address}
                  name={info.name}
                  icon={info.image}
                  href={info.address}
                />
              ))}
              {hotPairs &&
                hotPairs[network]
                  ?.slice(0, 10 - adminTokens.length)
                  .map((pair: any, index: number) => (
                    <div key={`${pair.pair.id}`} className={s.table_cell}>
                      <Link to={`/${network.toLowerCase()}/pair-explorer/${pair.pair.id}`}>
                        <span>#{index + adminTokens.length + 1}</span>{' '}
                        <div>
                          {WHITELIST.includes(pair.pair.token0.id)
                            ? pair.pair.token1.symbol
                            : pair.pair.token0.symbol}
                        </div>
                        {pair.exchange && (
                          <img
                            style={{ paddingLeft: '10px' }}
                            src={ExchangesIcons[pair.exchange]}
                            alt=""
                          />
                        )}
                      </Link>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <PromotedToken />
    </section>
  );
});

export default InfoBlock;
