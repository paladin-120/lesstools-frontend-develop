import { useEffect, useState, useCallback, useMemo } from 'react';
// import TradingViewWidget, { Themes, BarStyles } from 'react-tradingview-widget';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
  GET_PAIR_INFO,
  GET_LAST_BLOCK,
  GET_PAIR_INFO_SUSHIWAP,
  GET_PAIR_SWAPS,
} from '../../queries/index';

import RightAsideBar from './RightAsideBar/index';
import { IRowPairExplorer } from '../../types/table';
import PairInfoHeader from './PairInfoCard/PairInfoHeader/index';
import PairInfoBody from './PairInfoCard/PairInfoBody/index';
import PairsSearch from '../../components/PairsSearch/index';
import Loader from '../../components/Loader/index';
import Favorites from './RightAsideBar/Favorites/index';
import { WHITELIST } from '../../data/whitelist';
import { useMst } from '../../store/store';
import backend, { IAdditionalInfoFromBackend } from '../../services/backend/index';
import { useGetDataForAllExchanges } from '../../hooks/useGetDataForAllExchanges';

import s from './PairExplorer.module.scss';
import arrowRight from '../../assets/img/icons/arrow-right.svg';
import { ExchangesByNetworks, isExchangeLikeSushiswap } from '../../config/exchanges';
import { uppercaseFirstLetter } from '../../utils/prettifiers';
import TheGraph from '../../services/TheGraph';
import { SubgraphsByExchangeShort } from '../../config/subgraphs';
import { NetworksForQueryFromBackend, Networks } from '../../config/networks';
import TradingviewWidget from '../../components/TradingviewWidget';
import { formalizePairAsInWhitelist } from '../../utils/formalizePairAsInWhitelist';
import { observer } from 'mobx-react-lite';

const PairExplorer: React.FC = observer(() => {
  const [tokenInfoFromBackend, setTokenInfoFromBackend] =
    useState<null | IAdditionalInfoFromBackend>(null);
  // const [timestamp24hAgo] = useState(Math.round(Date.now() / 1000) - 24 * 3600);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [pairInfo, setPairInfo] = useState<any>([]);
  const { id: pairId } = useParams<{ id: string }>();
  const { user, currentExchange } = useMst();

  const location = useLocation();
  const network = uppercaseFirstLetter(location.pathname.split('/')[1].toLowerCase());

  const exchanges = useMemo(() => ExchangesByNetworks[network] || [], [network]);
  const exchange = exchanges[0]; // first exchange for Links data
  const exchangesOfNetwork = Object.values(exchanges);

  const getBlocksFromAllExchanges = useCallback(async () => {
    try {
      if (!exchangesOfNetwork.length) return;
      const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
        const subgraph = SubgraphsByExchangeShort[exchangeOfNetwork];
        return TheGraph.query({
          subgraph,
          query: GET_LAST_BLOCK,
        });
      });
      const result = await Promise.all(results);
      console.log('getBlocksFromAllExchanges', result);
      setBlocks(result);
    } catch (e) {
      console.error(e);
    }
  }, [exchangesOfNetwork]);

  // запрос для pair-card info [ГРАФ]
  const getPairInfoFromAllExchanges = useCallback(async () => {
    try {
      if (!exchangesOfNetwork.length) return;
      const results = exchangesOfNetwork.map((exchangeOfNetwork: any, i: number) => {
        const subgraph = SubgraphsByExchangeShort[exchangeOfNetwork];
        // eslint-disable-next-line no-underscore-dangle
        const blockNumber = +blocks[i]?._meta?.block?.number - 7200 || 13754250;
        return TheGraph.query({
          subgraph,
          query: isExchangeLikeSushiswap(exchangeOfNetwork)
            ? GET_PAIR_INFO_SUSHIWAP
            : GET_PAIR_INFO,
          variables: {
            id: pairId,
            blockNumber,
          },
        });
      });
      const resultsGetPairInfo = await Promise.all(results);
      console.log('TheGraph Query ->', resultsGetPairInfo, results);
      const pairInfoNew = resultsGetPairInfo.filter((el) => el?.base_info !== null)[0] || {}; // first exchange
      const exchangeIndex = resultsGetPairInfo.findIndex((el) => el.base_info);
      if (exchangeIndex !== -1) {
        currentExchange.setCurrentExchange(exchangesOfNetwork[exchangeIndex]);
      }

      setPairInfo(pairInfoNew);
    } catch (e) {
      console.error(e);
    }
  }, [pairId, exchangesOfNetwork, currentExchange, blocks]);

  useEffect(() => {
    if (!network) return;
    getBlocksFromAllExchanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  // рефетч при изменение id пары или номер блока (24 часа назад) [ГРАФ]
  useEffect(() => {
    if (!pairId) return;
    if (!network) return;
    getPairInfoFromAllExchanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks, pairId, network]);

  // запрос на получения всех свапов данной пары [ГРАФ]
  const [swapsFromAllExchanges, getSwapsFromAllExchanges] = useGetDataForAllExchanges({
    network,
    defaultData: [],
    query: GET_PAIR_SWAPS,
    variables: { id: pairId },
  });

  useEffect(() => {
    if (!pairId) return () => {};
    getSwapsFromAllExchanges();
    // todo: cancelled because it rerenders chart
    // const interval = setInterval(getSwapsFromAllExchanges, 15000);
    // return () => clearInterval(interval);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairId]);

  const concatenateSwaps = useCallback(async () => {
    try {
      let swapsNew: any[] = [];
      swapsFromAllExchanges.map((item: any) => {
        if (!item) return null;
        const { swaps: swapsOfExchange } = item;
        if (!swapsOfExchange) return null;
        swapsNew = swapsNew.concat(swapsOfExchange);
        return null;
      });
      console.log('getData', swapsNew);
      setSwaps(swapsNew);
    } catch (e) {
      console.error(e);
    }
  }, [swapsFromAllExchanges]);

  useEffect(() => {
    if (!swapsFromAllExchanges || !swapsFromAllExchanges.length) return;
    concatenateSwaps();
  }, [swapsFromAllExchanges, concatenateSwaps]);

  // запрос на бэк для доп.инфы по паре
  useEffect(() => {
    if (!pairInfo.base_info) return;
    const tbr = WHITELIST.includes(pairInfo.base_info.token1.id)
      ? pairInfo?.base_info.token0
      : pairInfo?.base_info.token1;

    backend
      .getTokenPairAdditionalData({
        pair_address: pairId,
        token_address: tbr.id,
        token_symbol: tbr.symbol,
        token_name: tbr.name,
        platform: NetworksForQueryFromBackend[network as Networks],
      })
      .then((res) => setTokenInfoFromBackend(res.data));
  }, [blocks, pairInfo, pairId, user.isVerified, network]);

  const [swapsData, setSwapsData] = useState<Array<IRowPairExplorer>>([]);

  // add query pair info every minute
  useEffect(() => {
    const timerId = setInterval(() => {
      getPairInfoFromAllExchanges();
    }, 60 * 1000);

    return () => clearInterval(timerId);
  }, [getPairInfoFromAllExchanges]);

  // add query pair swaps every minute
  useEffect(() => {
    const timerId = setInterval(() => {
      getSwapsFromAllExchanges();
    }, 60 * 1000);

    return () => clearInterval(timerId);
  }, [getSwapsFromAllExchanges]);

  // формирования данных для таблицы
  useEffect(() => {
    if (!swaps.length) return;
    let data: Array<IRowPairExplorer> = [];

    data = swaps.map((swap: any) => {
      const TBRindex = WHITELIST.includes(swap.pair.token1.id) ? '0' : '1';
      const OtherIndex = TBRindex === '1' ? '0' : '1';

      return {
        data: +swap.timestamp * 1000,
        tbr: swap.pair[`token${TBRindex}` as const],
        otherToken: swap.pair[`token${OtherIndex}` as const],
        type: +swap[`amount${TBRindex}Out` as const] === 0 ? 'sell' : 'buy',
        priceUsd: +swap[`token${TBRindex}PriceUSD` as const],
        priceEth: +swap[`token${TBRindex}PriceETH` as const],
        amountEth:
          +swap[`amount${TBRindex}Out` as const] === 0
            ? +swap[`amount${TBRindex}In` as const]
            : +swap[`amount${TBRindex}Out` as const],
        totalEth:
          +swap[`amount${OtherIndex}Out` as const] || +swap[`amount${OtherIndex}In` as const],
        maker: swap.from,
        others: { etherscan: swap.transaction.id },
      };
    });

    setSwapsData(data);
  }, [swaps]);

  const [isLeftSideBar, setIsLeftSideBar] = useState(true);
  const [isRightSideBar, setIsRightSideBar] = useState(true);

  return (
    <main className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>PairExplorer - LessTools</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
        <meta
          property="og:image"
          content="https://og-image.vercel.app/Check%20**WETH%20400%24**%20at%20lesstools.io.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fs2.coinmarketcap.com%2Fstatic%2Fimg%2Fcoins%2F200x200%2F10279.png&images=https%3A%2F%2Fs2.coinmarketcap.com%2Fstatic%2Fimg%2Fcoins%2F200x200%2F10279.png"
        />
      </Helmet>

      <div className={s.container}>
        <div className={s.main}>
          <div className={s.mobile_block}>
            <PairsSearch placeholder="Search" />
            <div className={s.mobile_block__favs}>
              <Favorites />
            </div>
            {!pairInfo ? (
              <Loader />
            ) : (
              <PairInfoHeader
                token0={pairInfo?.base_info?.token0}
                token1={pairInfo?.base_info?.token1}
                cmcTokenId={tokenInfoFromBackend?.pair?.token_being_reviewed?.cmc_id || null}
              />
            )}
          </div>
        </div>
        <div
          className={`${s.main_inner} ${isLeftSideBar && s.withLeft} ${
            isRightSideBar && s.withRight
          } ${isLeftSideBar && isRightSideBar && s.both}`}
        >
          <aside className={`${s.left_aside} ${isLeftSideBar && s.active}`}>
            <div className={s.left}>
              <div className={`${s.left_inner} grey-scroll`}>
                {pairInfo ? (
                  <PairInfoBody
                    loading={!pairInfo}
                    pairId={pairId}
                    tokenInfoFromBackend={tokenInfoFromBackend}
                    pairInfo={pairInfo}
                    exchange={exchange}
                  />
                ) : (
                  <Loader />
                )}
              </div>
              <div
                className={s.left_aside__button}
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => setIsLeftSideBar(!isLeftSideBar)}
              >
                <div className={s.left_aside__button_inner}>
                  <img src={arrowRight} alt=">" />
                </div>
              </div>
            </div>
          </aside>
          <div className={s.center}>
            <div className={s.info}>
              {!pairInfo ? (
                <Loader />
              ) : (
                <PairInfoHeader
                  token0={pairInfo?.base_info?.token0}
                  token1={pairInfo?.base_info?.token1}
                  cmcTokenId={tokenInfoFromBackend?.pair?.token_being_reviewed?.cmc_id || 0}
                />
              )}
              <PairsSearch placeholder={`Search ${network} pairs`} />
            </div>
            <div className={s.chart}>
              {!pairInfo?.base_info?.token0 ? (
                <Loader />
              ) : (
                <TradingviewWidget
                  autosize
                  symbol={`${
                    formalizePairAsInWhitelist(
                      pairInfo.base_info.token0,
                      pairInfo.base_info.token1,
                    )[1].symbol
                  }/${
                    formalizePairAsInWhitelist(
                      pairInfo.base_info.token0,
                      pairInfo.base_info.token1,
                    )[0].symbol
                  }`}
                  pairInfo={pairInfo}
                />
              )}
            </div>
          </div>
          <aside className={`${s.right_aside} ${isRightSideBar && s.active}`}>
            <div className={s.right}>
              <div className={s.right_inner}>
                <RightAsideBar trades={swapsData} />
              </div>
              <div
                className={s.right_aside__button}
                tabIndex={0}
                role="button"
                onKeyDown={() => {}}
                onClick={() => setIsRightSideBar(!isRightSideBar)}
              >
                <div className={s.right_aside__button_inner}>
                  <img src={arrowRight} alt=">" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
});

export default PairExplorer;
