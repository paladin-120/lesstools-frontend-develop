import rootStore from '../../store/store';
import { TradingviewExchangesNames } from '../../config/exchanges';
import { getCandlesFromOurBackend } from './getCandlesFromOurBackend';

const history: any = {};

export default {
  history,

  getBars: async (
    symbolInfo: any,
    resolution: '1' | '3' | '5' | '15' | '30' | '60' | '120' | '240' | '1D' | '1W',
    from: any,
    to: any,
    first: any,
    limit: any,
  ) => {
    try {
      const split_symbol: Array<string> = symbolInfo.name.split(/[:/]/);
      console.info('getBars', resolution, split_symbol, first, limit);
      const locationPathname = window.location.pathname.split('/');
      const pair_id = locationPathname[locationPathname.length - 1];
      const pool = TradingviewExchangesNames[rootStore.currentExchange.exchange] || 'mainnet';

      return await getCandlesFromOurBackend({
        pair_id,
        pool,
        time_interval: resolution,
        from,
        to,
      });
    } catch (e) {
      rootStore.modals.open('Info', 'Not enough data to display the graph or very little');
      return [];
    }
  },
};
