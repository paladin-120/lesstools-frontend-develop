import { Helmet } from 'react-helmet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';

import Table, { ITableHeader } from '../../components/Table/index';
import Search from '../../components/Search/index';
// import AdBlock from '../../components/AdBlock/index';
import { IRowBigSwap } from '../../types/table';
import { GET_BIG_SWAPS } from '../../queries/index';
import { IBigSwapInfo } from '../../types/bigSwap';
import { WHITELIST } from '../../data/whitelist';

import s from './BigSwapExplorer.module.scss';
// import ad from '../../assets/img/sections/ad/ad1.png';
import loader from '../../assets/loader.svg';
import { ExchangesByNetworks } from '../../config/exchanges';
import TheGraph from '../../services/TheGraph';
import { SubgraphsByExchange } from '../../config/subgraphs';
import { uniqueArrayOfObjectsByKeyOfChild } from '../../utils/comparers';
import { useLocation } from 'react-router-dom';
import { uppercaseFirstLetter } from '../../utils/prettifiers';

// headers for table
const headerData: ITableHeader = [
  { key: 'pair', title: 'Pair', sortType: 'string' },
  { key: 'exchange', title: 'Exchange', sortType: 'string' },
  { key: 'time', title: 'Time', sortType: 'date' },
  { key: 'type', title: 'Type', sortType: 'string' },
  { key: 'quantity', title: 'Quantity', sortType: 'number' },
  { key: 'totalEth', title: 'Total ETH', sortType: 'number' },
  { key: 'totalUsd', title: 'Total USD', sortType: 'number' },
  { key: 'change', title: 'Change', sortType: 'number' },
  { key: 'others', title: 'Others' },
];

const BigSwapExplorer: React.FC = observer(() => {
  const [searchValue, setSearchValue] = useState('');
  const [swapsDataPlain, setSwapsDataPlain] = useState<any[]>([]);
  const [swapsData, setSwapsData] = useState<any>();
  const [tableData, setTableData] = useState<IRowBigSwap[]>([]);

  const location = useLocation();

  const network = location.pathname.split('/')[1];
  const exchanges = useMemo(
    () => ExchangesByNetworks[uppercaseFirstLetter(network.toLowerCase())] || [],
    [network],
  );

  // query big swaps
  const getSwapsData = useCallback(
    async (variables: any) => {
      try {
        const exchangesOfNetwork = Object.values(exchanges);
        if (!exchangesOfNetwork.length) return;
        const results = exchangesOfNetwork.map((exchangeOfNetwork: any) => {
          return TheGraph.query({
            // TODO: testing this
            subgraph: SubgraphsByExchange[exchangeOfNetwork],
            query: GET_BIG_SWAPS,
            variables,
          });
        });
        const result = await Promise.all(results);
        setSwapsDataPlain(result || []);
      } catch (e) {
        console.error(e);
      }
    },
    [exchanges],
  );

  useEffect(() => {
    if (!exchanges) return () => {};
    getSwapsData({ lowerThreshold: 10000 });
    const interval = setInterval(() => getSwapsData({ lowerThreshold: 10000 }), 15000);
    return () => clearInterval(interval);
  }, [exchanges, getSwapsData]);

  // concatenate data from all exchanges to 'pairs' field
  const concatenateSwapsData = useCallback(async () => {
    try {
      const exchangesOfNetwork = Object.values(exchanges);
      let resultData: any[] = [];
      swapsDataPlain.map((item: any, i: number) => {
        if (!item) return null;
        let { swaps } = item;
        const exchange = exchangesOfNetwork[i];
        swaps = swaps.map((swap: any) => {
          return { ...swap, exchange };
        });
        resultData = resultData.concat(swaps || []);
        return null;
      });
      const swaps = uniqueArrayOfObjectsByKeyOfChild(resultData, 'transaction', 'id');
      const dataNew = { swaps };
      console.log('BigSwapExplorer concatenateSwapsData:', dataNew);
      setSwapsData(dataNew);
    } catch (e) {
      console.error(e);
    }
  }, [swapsDataPlain, exchanges]);

  useEffect(() => {
    if (!swapsDataPlain || !swapsDataPlain.length) return;
    concatenateSwapsData();
  }, [swapsDataPlain, concatenateSwapsData]);

  // для фильтрации
  // сначала приходит ответ с бэка, это сетается в setSwapsToTable,
  // после обработка и сетается в setTableData
  const [swapsFromBackend, setSwapsFromBackend] = useState<any>({ swaps: [] });
  useEffect(() => {
    if (swapsData) setSwapsFromBackend(swapsData);
  }, [swapsData]);

  // фильтрация
  useEffect(() => {
    if (searchValue) {
      const newSwaps = swapsData?.swaps.filter((data: any) => {
        if (
          data.pair.token0.symbol.includes(searchValue.toUpperCase()) ||
          data.pair.token1.symbol.includes(searchValue.toUpperCase())
        )
          return true;
        return false;
      });
      const newSwapsfromBackend = { swaps: newSwaps || [] };
      console.log(newSwapsfromBackend);
      setSwapsFromBackend(newSwapsfromBackend);
    } else setSwapsFromBackend(swapsData || { swaps: [] });
  }, [searchValue, swapsData]);

  useEffect(() => {
    console.log({ swapsFromBackend });
    if (!swapsFromBackend?.swaps?.length) {
      setTableData([]);
      return;
    }
    const newData: any[] = swapsFromBackend?.swaps.map((swap: IBigSwapInfo) => {
      const { exchange } = swap;
      // TBR = Token Being Reviewd
      const TBRSymbol = WHITELIST.includes(swap.pair.token1.id)
        ? swap.pair.token0.symbol
        : swap.pair.token1.symbol;
      const TBRindex = WHITELIST.includes(swap.pair.token1.symbol) ? '0' : '1';
      const TBRamountOut = swap[`amount${TBRindex}Out` as const];
      const TBRamountIn = swap[`amount${TBRindex}In` as const];
      const TBRreserve = `reserve${TBRindex}` as const;
      const TBRtype = +TBRamountOut === 0 ? 'sell' : 'buy';
      const TBRquantity = TBRtype === 'sell' ? +TBRamountIn : +TBRamountOut;
      const otherTokenIndex = TBRindex === '1' ? '0' : '1';
      return {
        pair: TBRSymbol,
        exchange,
        time: moment(+swap.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
        type: TBRtype,
        quantity: TBRquantity,
        totalEth:
          TBRtype === 'buy'
            ? +swap[`amount${otherTokenIndex}In` as const]
            : +swap[`amount${otherTokenIndex}Out` as const],
        totalUsd: +swap.amountUSD,
        change: (TBRquantity / +swap.pair[TBRreserve]) * 100,
        others: {
          liveData: swap.pair.id,
          [network]: swap.transaction.id,
        },
      };
    });
    console.log({ newData });
    setTableData(newData);
  }, [network, swapsFromBackend]);

  return (
    <main className={s.section}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>BigSwapExplorer - LessTools</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>
      <div className={s.container}>
        {/* <AdBlock adImg={ad} /> */}
        <div className={s.info}>
          <div className={s.info_left}>
            <div className={s.info_title}>Big Swap Explorer</div>
            <div className={s.info_subtitle}>
              Shows latest big swaps in {network} with useful information
            </div>
          </div>
          <div className={s.info_right}>
            <Search value={searchValue} onChange={setSearchValue} placeholder="Search" />
          </div>
        </div>
        {!swapsData ? (
          <img src={loader} alt="loader" />
        ) : (
          <Table data={tableData} header={headerData} tableType="bigSwap" />
        )}
      </div>
    </main>
  );
});

export default BigSwapExplorer;
