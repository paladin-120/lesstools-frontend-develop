/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import axios from 'axios';

import rootStore from '../../store/store';
import { REACT_APP_CRYPTOCOMPARE_API_KEY } from '../../config/index';
import { TradingviewExchangesNames } from '../../config/exchanges';
import { getCandlesFromOurBackend } from './getCandlesFromOurBackend';

const api_root = 'https://min-api.cryptocompare.com';
const history: any = {};
const api_key = REACT_APP_CRYPTOCOMPARE_API_KEY;

interface IExchange {
  [key: string]: {
    markets: Array<string>;
  };
}

interface IExchanges {
  [key: string]: IExchange;
}

const findExchangeForPair = (exchanges: IExchanges, firstSymbolInPair: string) => {
  if (exchanges[firstSymbolInPair]) {
    const secondSymbolsInPair = exchanges[firstSymbolInPair];
    const symbolWithUsd = Object.keys(secondSymbolsInPair).find(
      (symbol) => symbol.startsWith('USD') || symbol.endsWith('USD'),
    );

    if (symbolWithUsd) {
      return {
        symbols: [firstSymbolInPair, symbolWithUsd],
        exchange: secondSymbolsInPair[symbolWithUsd].markets[0],
      };
    }

    const secondSymbol = Object.keys(secondSymbolsInPair)[0];
    return {
      symbols: [firstSymbolInPair, secondSymbol],
      exchange: secondSymbolsInPair[secondSymbol].markets[0],
    };
  }

  return null;
};

const resolutions = {
  '1': '/data/histominute',
  '5': '/data/histominute',
  '30': '/data/histohour',
  '60': '/data/histohour',
  '120': '/data/histoday',
  '1D': '/data/histoday',
  '1W': '/data/histoday',
};

// const fetchFromCryptoCompare = async (
//   url: string,
//   params: any,
//   fromTimestamp: any,
//   toTimestamp: any,
// ) => {
//   let iTimestamp = toTimestamp;
//   let result: any[] = [];
//   while (iTimestamp > fromTimestamp) {
//     const response = await axios.get(`${api_root}${url}`, {
//       params: { ...params, toTs: iTimestamp },
//     });
//     console.log('fetchFromCryptoCompare', response, params);
//     if (response && response.data && response.data.TimeFrom) {
//       iTimestamp = response.data.TimeFrom;
//     }
//     if (response && response.data && response.data.Response === 'Error') {
//       iTimestamp -= (fromTimestamp - toTimestamp) / 10;
//       continue;
//     }
//     result = [...result, ...response.data.Data];
//   }
//   return result.sort((data1, data2) => data1.time - data2.time);
// };

export default {
  history,

  getBars: async (
    symbolInfo: any,
    resolution: '1' | '5' | '30' | '60' | '120' | '1D' | '1W',
    _from: any,
    _to: any,
    first: any,
    pairInfo: any,
  ) => {
    if (!first) return [];
    try {
      const split_symbol: Array<string> = symbolInfo.name.split(/[:/]/);
      const locationPathname = window.location.pathname.split('/');
      const pair_id = locationPathname[locationPathname.length - 1];
      const pool = TradingviewExchangesNames[rootStore.currentExchange.exchange] || 'mainnet';

      console.log('Get Bars', split_symbol, pair_id, pool, resolution, _from, _to, pairInfo);
      // query data from our api
      const url = resolutions[resolution];
      let data = [];

      // query data from third-party backend
      // const params = {
      //   fsym: split_symbol[0],
      //   tsym: split_symbol[1],
      //   limit: limit || 2000,
      //   api_key,
      // };

      data = await getCandlesFromOurBackend({
        pair_id,
        pool,
        time_interval: resolution,
        fsym: split_symbol[0],
        tsym: split_symbol[1],
        fromTs: _from,
        toTs: _to,
        faddress: pairInfo[0],
        taddress: pairInfo[1],
      });
      // data = await fetchFromCryptoCompare(url, params, _from, _to);

      console.log('Get Bars Result', _from, _to, data);
      if (data.length === 0) {
        const exchanges = await axios.get(`${api_root}/data/cccagg/pairs/excluded`);
        const newRequestData = findExchangeForPair(exchanges.data.Data, split_symbol[0]);
        if (newRequestData) {
          const newBars = await axios.get(`${api_root}${url}`, {
            params: {
              fsym: newRequestData.symbols[0],
              tsym: newRequestData.symbols[1],
              limit: 2000,
              api_key,
              e: newRequestData.exchange,
            },
          });

          return newBars.data.Data.reduce((res: Array<any>, el: any) => {
            if (el.open !== 0) {
              res.push({
                time: el.time * 1000, // TradingView requires bar time in ms
                low: el.low,
                high: el.high,
                open: el.open,
                close: el.close,
                volume: el.volumefrom,
              });
            }

            return res;
          }, []);
        }

        rootStore.modals.open('Info', 'Not enough data to display the graph or very little');
        // query data from our api
        return await getCandlesFromOurBackend({
          pair_id,
          pool,
          time_interval: resolution,
          fsym: split_symbol[0],
          tsym: split_symbol[1],
          fromTs: _from,
          toTs: _to,
          faddress: pairInfo[0],
          taddress: pairInfo[1],
        });
      }

      if (data.length) {
        const bars = data.reduce((res: Array<any>, el: any) => {
          if (el.open !== 0) {
            res.push({
              time: el.time * 1000, // TradingView requires bar time in ms
              low: el.low,
              high: el.high,
              open: el.open,
              close: el.close,
              volume: el.volumefrom,
            });
          }

          return res;
        }, []);

        if (first) {
          const lastBar = bars[bars.length - 1];
          history[symbolInfo.name] = { lastBar };
        }
        return bars;
      }
      rootStore.modals.open('Info', 'Not enough data to display the graph or very little');
      return [];
    } catch (e) {
      rootStore.modals.open('Info', 'Not enough data to display the graph or very little');
      return [];
    }
  },
};
