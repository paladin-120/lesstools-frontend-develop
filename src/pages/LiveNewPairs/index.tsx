import { Helmet } from 'react-helmet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Table, { ITableHeader } from '../../components/Table/index';
import Search from '../../components/Search/index';
// import AdBlock from '../../components/AdBlock/index';
import { GET_LIVE_SWAPS, GET_LIVE_SWAPS_SUSHISWAP } from '../../queries/index';
import { INewPair } from '../../types/newPairs';
import { IRowLiveNewPairs } from '../../types/table';
import { WHITELIST } from '../../data/whitelist';

import s from '../BigSwapExplorer/BigSwapExplorer.module.scss';
import { ExchangesByNetworks, isExchangeLikeSushiswap } from '../../config/exchanges';

// import ad from '../../assets/img/sections/ad/ad1.png';
import loader from '../../assets/loader.svg';
import TheGraph from '../../services/TheGraph';
import { SubgraphsByExchangeShort } from '../../config/subgraphs';
import { uniqueArrayOfObjectsByKey } from '../../utils/comparers';
import { useLocation } from 'react-router-dom';
import { uppercaseFirstLetter } from '../../utils/prettifiers';

// headers for table
const headerData: ITableHeader = [
  { key: 'token', title: 'Token', sortType: 'string' },
  { key: 'exchange', title: 'Exchange', sortType: 'string' },
  { key: 'listedSince', title: 'Listed Since', sortType: 'number' },
  { key: 'actions', title: 'Actions' },
  { key: 'tokenPrice', title: 'Token Price', sortType: 'tokenPrice' },
  { key: 'totalLiquidity', title: 'Total Liquidity', sortType: 'number' },
  { key: 'poolAmount', title: 'Initial Pool Amount', sortType: 'number' },
  { key: 'poolVariation', title: 'Pool Variation', sortType: 'number' },
  { key: 'poolRemaining', title: 'Pool Remaining', sortType: 'number' },
];

const LiveNewPairs: React.FC = observer(() => {
  const [searchValue, setSearchValue] = useState('');
  const [liveSwapsPlain, setLiveSwapsPlain] = useState<any[]>([]);
  const [liveSwaps, setLiveSwaps] = useState<any>();
  const [swapsFromBackend, setSwapsFromBackend] = useState<any>({ pairs: [] });

  const location = useLocation();

  const network = location.pathname.split('/')[1];
  const exchanges = useMemo(
    () => ExchangesByNetworks[uppercaseFirstLetter(network.toLowerCase())] || [],
    [network],
  );

  // final data for table
  const [tableData, setTableData] = useState<IRowLiveNewPairs[]>([]);

  // query new pairs from all exchanges
  const getLiveSwaps = useCallback(
    async (variables: any) => {
      try {
        const exchangesOfNetwork = Object.values(exchanges);
        if (!exchangesOfNetwork.length) return;
        const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
          return TheGraph.query({
            subgraph: SubgraphsByExchangeShort[exchangeOfNetwork],
            query: isExchangeLikeSushiswap(exchangeOfNetwork)
              ? GET_LIVE_SWAPS_SUSHISWAP
              : GET_LIVE_SWAPS,
            variables,
          });
        });
        const result = await Promise.all(results);
        setLiveSwapsPlain(result || []);
      } catch (e) {
        console.error(e);
      }
    },
    [exchanges],
  );

  useEffect(() => {
    if (!exchanges) return () => {};
    getLiveSwaps({});
    const interval = setInterval(() => getLiveSwaps({}), 15000);
    return () => clearInterval(interval);
  }, [exchanges, getLiveSwaps]);

  // concatenate data from all exchanges to 'pairs' field
  const concatenateLiveSwaps = useCallback(async () => {
    try {
      const exchangesOfNetwork = Object.values(exchanges);
      let pairsNew: any[] = [];
      liveSwapsPlain.map((item: any, i: number) => {
        if (!item) return null;
        let { pairs } = item;
        const exchange = exchangesOfNetwork[i];
        pairs = pairs.map((pair: any) => {
          return { ...pair, exchange };
        });
        pairsNew = pairsNew.concat(pairs || []);
        return null;
      });
      const dataNew = {
        pairs: uniqueArrayOfObjectsByKey(pairsNew, 'id'),
      };
      setLiveSwaps(dataNew);
    } catch (e) {
      console.error(e);
    }
  }, [liveSwapsPlain, exchanges]);

  useEffect(() => {
    if (!liveSwapsPlain || !liveSwapsPlain.length) return;
    concatenateLiveSwaps();
  }, [liveSwapsPlain, concatenateLiveSwaps]);

  // для фильтрации
  // сначала приходит ответ с бэка, это сетается в setSwapsFromBackend,
  // после обработка и сетается в setTableData
  useEffect(() => {
    if (liveSwaps) setSwapsFromBackend(liveSwaps);
  }, [liveSwaps]);

  // фильтрация
  useEffect(() => {
    if (searchValue) {
      const newSwaps = liveSwaps?.pairs.filter((data: any) => {
        if (
          data.token0.symbol.includes(searchValue.toUpperCase()) ||
          data.token1.symbol.includes(searchValue.toUpperCase())
        )
          return true;
        return false;
      });
      setSwapsFromBackend({ pairs: newSwaps || [] });
    } else setSwapsFromBackend(liveSwaps || { pairs: [] });
  }, [searchValue, liveSwaps]);

  useEffect(() => {
    if (swapsFromBackend?.pairs?.length) {
      const newData: Array<IRowLiveNewPairs> = swapsFromBackend?.pairs.map((swap: INewPair) => {
        const { exchange } = swap;
        // TBR = Token Being Reviewd
        const TBRSymbol = WHITELIST.includes(swap.token1.id)
          ? swap.token0.symbol
          : swap.token1.symbol;
        const TBRindex = WHITELIST.includes(swap.token0.id) ? '1' : '0';
        const TBRaddress = swap[`token${TBRindex}` as const].id;

        const otherTokenIndex = TBRindex === '1' ? '0' : '1';

        const poolAmount = +swap[`initialReserve${otherTokenIndex}` as const];
        const poolRemaining = +swap[`reserve${otherTokenIndex}` as const];

        let poolVariation = (poolRemaining / poolAmount) * 100 - 100;

        if (poolAmount === poolRemaining) poolVariation = 0;
        if (poolAmount === 0 && poolRemaining !== 0) poolVariation = 100;

        return {
          token: TBRSymbol,
          exchange,
          listedSince: swap.createdAtTimestamp,
          actions: {
            uniswap: TBRaddress,
            [network]: swap.creationTxnHash,
            unicrypt: swap.id,
            liveData: swap.id,
          },
          tokenPrice: {
            usd: +swap[`token${TBRindex}` as const].derivedUSD,
            eth: +swap[`token${TBRindex}` as const].derivedETH,
          },
          totalLiquidity: +swap.reserveUSD,
          poolAmount,
          poolVariation,
          poolRemaining,
          otherTokenSymbol: swap[`token${otherTokenIndex}` as const].symbol,
        };
      });
      setTableData(newData);
    }
  }, [network, swapsFromBackend]);

  return (
    <main className={s.section}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>LiveNewPairs - LessTools</title>
        <meta name="description" content="Multi-Chain Decentralized Fundraising Capital" />
      </Helmet>
      <div className={s.container}>
        <div className={s.info}>
          <div className={s.info_left}>
            <div className={s.info_title}>Live New Pairs</div>
            <div className={s.info_subtitle}>Search for live new pairs and pool updates</div>
          </div>
          <div className={s.info_right}>
            <Search value={searchValue} onChange={setSearchValue} placeholder="Search" />
          </div>
        </div>
        {liveSwaps === undefined ? (
          <img src={loader} alt="loader" />
        ) : (
          <Table data={tableData} header={headerData} tableType="liveNewPairs" />
        )}
      </div>
    </main>
  );
});

export default LiveNewPairs;
