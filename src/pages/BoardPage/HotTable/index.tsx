import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { WHITELIST } from '../../../data/whitelist';
import { Networks, NetworksForHotTable } from '../../../config/networks';
import s from './HotTable.module.scss';
import compass from '../../../assets/img/sections/board-page/compass.svg';
import Checkbox from '../../../components/Checkbox';
import { newObject } from "../../../utils/formatDataTypes";
import { ExchangesByNetworks, isExchangeLikeSushiswap } from "../../../config/exchanges";
import TheGraph from "../../../services/TheGraph";
import { SubgraphsByExchangeShort } from "../../../config/subgraphs";
import { GET_HOT_PAIRS, GET_HOT_PAIRS_SUSHISWAP } from "../../../queries";
import { getStartOfHour } from "../../../utils/time";

interface ITableCellProps {
  tokenSymbol: string;
  tokenPrice: string;
  pairId: string;
  network?: string;
}

interface IToken {
  id: string;
  symbol: string;
  derivedUSD: string;
}

export interface IPairFromGraph {
  hourlyTxns: string;
  exchange?: string;
  pair: {
    id: string;
    token0: IToken;
    token1: IToken;
  };
}

const TableCell: React.FC<ITableCellProps> = ({ tokenSymbol, tokenPrice, pairId, network }) => {
  return (
    <div className={s.table_body__item}>
      <Link to={`/${network?.toLowerCase()}/pair-explorer/${pairId}`}>
        <div className={s.table_body__item_left}>
          <div className={s.table_body__item_left__token}>{tokenSymbol}</div>
          <p>${tokenPrice}</p>
        </div>
        <span>
          <img src={compass} alt="compass" />
        </span>
      </Link>
    </div>
  );
};

interface IHotTableProps {
  pairs?: any;
  title?: string;
  logo?: string;
}

const HotTable: React.FC<IHotTableProps> = observer((props) => {
  const { title } = props;

  const [network, setNetwork] = useState<Networks | string>(Networks.Ethereum);
  const [tableData, setTableData] = useState<any[]>([]);
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

  const getDataForAllExchangesOfNetwork = useCallback(
    async (net: string) => {
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
            variables: isExchangeLikeSushiswap(exchangeOfNetwork)
              ? {
                timestamp1: getStartOfHour(),
                timestamp2: getStartOfHour() - 3600,
                timestamp3: getStartOfHour() - 7200,
              }
              : {
                timestamp1: 1598338800,
                timestamp2: 1598338800 - 3600,
                timestamp3: 1598338800 - 7200,
              },
          });
        });
        const result = await Promise.all(results);
        const resultsFormatted: any[] = result.map((pair: any, i: number) => {
          return formatData(pair, exchangesOfNetwork[i]);
        });
        const resultsConсatenated = [].concat(...resultsFormatted);
        const resultsSorted = resultsConсatenated.sort((a: any, b: any) => +b.hourlyTxns - +a.hourlyTxns);
        console.log('HotTable getDataForAllExchangesOfNetwork:', {
          net,
          exchangesOfNetwork,
          result,
          resultsFormatted,
          resultsConсatenated,
          resultsSorted,
        });
        // setHotPairs({ [network]: resultsContatenated });
        return { [net]: resultsSorted };
      } catch (e) {
        console.error('HotTable getDataForAllExchangesOfNetwork:', e);
        return {};
      }
    },
    [],
  );

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
  }, [setHotPairs, getDataForAllExchangesOfNetwork])

  useEffect(() => {
    getAllData();
    const interval = setInterval(getAllData, 60000);
    return () => clearInterval(interval);
  }, [getAllData]);

  const showHotPairs = useCallback(() => {
    try {
      const hotPairsNew = newObject(hotPairs);
      const newTableData = hotPairsNew[network].slice(0, 20);
      if (newTableData) setTableData(newTableData);
      console.log('HotTable showHotPairs:', { hotPairs: hotPairsNew, newTableData });
    } catch (e) {
      console.error(e);
    }
  }, [network, hotPairs]);

  useEffect(() => {
    if (!network) return;
    if (!hotPairs) return;
    showHotPairs();
  }, [network, hotPairs, showHotPairs]);

  return (
    <section className={s.table}>
      <div className={s.table_header}>
        <div className={`${s.table_header__bg} ${s.sushi}`}>
          <div className={s.table_header__icon}>
            <div className={s.table_header__icon_img}>{/* <img src={logo} alt="logo" /> */}</div>
            <div className={s.table_header__icon_text}>
              <span>{title}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={s.checkboxes}>
        {Object.entries(NetworksForHotTable).map((item: [string, string]) => {
          const [net, networkName] = item;
          return (
            <Checkbox
              onClick={() => setNetwork(net)}
              checked={network === net}
            >
              {networkName}
            </Checkbox>
          );
        })}
      </div>
      <div className={s.table_body}>
        {!tableData.length &&
          new Array(20).fill(1).map(() => <div key={uuid()} className={s.empty_cell} />)}
        {tableData.map((pair: IPairFromGraph) => {
          return (
            <TableCell
              key={uuid()}
              tokenPrice={Number(
                WHITELIST.includes(pair.pair.token1.id)
                  ? pair.pair.token0.derivedUSD
                  : pair.pair.token1.derivedUSD,
              ).toFixed(5)}
              tokenSymbol={
                WHITELIST.includes(pair.pair.token1.id)
                  ? pair.pair.token0.symbol
                  : pair.pair.token1.symbol
              }
              pairId={pair.pair.id}
              network={network}
            />
          );
        })}
      </div>
    </section>
  );
});

export default HotTable;
