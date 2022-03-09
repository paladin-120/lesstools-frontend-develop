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

const resolutions = {
  '1': '/data/histominute',
  '5': '/data/histominute',
  '30': '/data/histohour',
  '60': '/data/histohour',
  '120': '/data/histoday',
  '1D': '/data/histoday',
  '1W': '/data/histoday',
};

const fetchFromCryptoCompare = async (
  url: string,
  params: any,
  fromTimestamp: any,
  toTimestamp: any,
) => {
  let iTimestamp = toTimestamp;
  let result: any[] = [];
  while (iTimestamp > fromTimestamp) {
    const response = await axios.get(`${api_root}${url}`, {
      params: { ...params, toTs: iTimestamp },
    });
    if (response && response.data && response.data.TimeFrom) {
      iTimestamp = response.data.TimeFrom;
    }
    if (response && response.data && response.data.Response === 'Error') {
      iTimestamp -= (fromTimestamp - toTimestamp) / 10;
      continue;
    }
    result = [...result, ...response.data.Data];
  }
  return result.sort((data1, data2) => data1.time - data2.time);
};

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
    try {
      const split_symbol: Array<string> = symbolInfo.name.split(/[:/]/);
      const locationPathname = window.location.pathname.split('/');
      const pair_id = locationPathname[locationPathname.length - 1];
      const pool = TradingviewExchangesNames[rootStore.currentExchange.exchange] || 'mainnet';

      // query data from our api
      const url = resolutions[resolution];
      let data = [];

      // query data from third-party backend
      const params = {
        fsym: split_symbol[0],
        tsym: split_symbol[1],
        limit: 2000,
        api_key,
      };

      let fromTs = _from;
      if (resolution === '1') {
        fromTs = parseInt(_to, 10) - 24 * 3600;
      } else if (resolution === '5') {
        fromTs = parseInt(_to, 10) - 3 * 24 * 3600;
      } else if (resolution === '30') {
        fromTs = parseInt(_to, 10) - 7 * 24 * 3600;
      } else if (resolution === '60') {
        fromTs = parseInt(_to, 10) - 14 * 24 * 3600;
      } else if (resolution === '120') {
        fromTs = parseInt(_to, 10) - 30 * 24 * 3600;
      } else if (resolution === '1D') {
        fromTs = parseInt(_to, 10) - 60 * 24 * 3600;
      } else if (resolution === '1W') {
        fromTs = parseInt(_to, 10) - 360 * 24 * 3600;
      }

      if (fromTs > _from) {
        fromTs = _from;
      }

      data = await getCandlesFromOurBackend({
        pair_id,
        pool,
        time_interval: resolution,
        fsym: split_symbol[0],
        tsym: split_symbol[1],
        fromTs,
        toTs: _to,
        faddress: pairInfo[0],
        taddress: pairInfo[1],
      });

      if (data.length === 0 && false) {
        data = await fetchFromCryptoCompare(url, params, _from, _to);
      }

      if (data.length) {
        const bars = data
          .filter((el) => {
            return el.time >= _from && el.time <= _to;
          })
          .reduce((res: Array<any>, el: any) => {
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
      return [];
    } catch (e) {
      rootStore.modals.open('Info', 'Not enough data to display the graph or very little');
      return [];
    }
  },
};
