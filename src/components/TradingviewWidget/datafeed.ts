import historyProvider from './historyProvider';
import moment from 'moment';

declare global {
  interface Window {
    interval: NodeJS.Timeout;
  }
}

const config = {
  supported_resolutions: ['1', '5', '30', '60', '120', '1D', '1W'],
};

export default (tokensArray: any) => {
  return {
    onReady: (callback: any) => {
      console.log('Tradingview Datafeed onReady:');
      setTimeout(() => callback(config), 0);
    },

    resolveSymbol: (
      symbolName: any,
      onSymbolResolvedCallback: any,
      onResolveErrorCallback: any,
    ) => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // expects a symbolInfo object in response
        const split_data = symbolName.split(/[:/]/);
        const symbolInfo = {
          name: symbolName,
          full_name: symbolName,
          pro_name: symbolName,
          description: '',
          type: 'crypto',
          session: '24x7',
          timezone,
          ticker: symbolName,
          exchange: split_data[0],
          minmov: 1,
          pricescale: 1000000000000000,
          has_intraday: true,
          has_no_volume: false,
          has_weekly_and_monthly: true,
          intraday_multipliers: ['1', '60'],
          supported_resolution: config.supported_resolutions,
          volume_precision: 8,
          data_status: 'streaming',
        };

        setTimeout(function () {
          onSymbolResolvedCallback(symbolInfo);
        }, 0);
      } catch (e) {
        console.error('Tradingview Datafeed resolveSymbol:', e);
        onResolveErrorCallback('Not feeling it today');
      }
    },

    getBars(
      symbolInfo: any,
      resolution: any,
      periodParams: any,
      onHistoryCallback: any = () => {},
      onErrorCallback: any = () => {},
    ) {
      const { from, to, countBack, firstDataRequest } = periodParams;
      console.log('Get Bars', resolution, from, to, countBack, firstDataRequest);
      historyProvider
        .getBars(symbolInfo, resolution, from, to, firstDataRequest, tokensArray)
        .then((bars) => {
          console.log('History Provider Get Bars', bars, from, to);
          if (bars.length) {
            onHistoryCallback(bars, { noData: false });
          } else {
            onHistoryCallback(bars, { noData: true });
          }
        })
        .catch((err) => {
          console.error('Tradingview Datafeed getBars:', { err });
          onErrorCallback(err);
        });
    },

    subscribeBars(symbolInfo: any, resolution: any, onRealtimeCallback: any) {
      console.log('SUBSCRIBE BARS: ', { symbolInfo, resolution });

      window.interval = setInterval(async function () {
        const now = moment().unix();
        const data = await historyProvider.getBars(
          symbolInfo,
          resolution,
          now - 18000,
          now,
          false,
          tokensArray,
        );

        if (data && data[data.length - 1]) {
          console.log('Subscribe', data[data.length - 1]);
          onRealtimeCallback(data[data.length - 1]);
        }
      }, 1000 * 60); // 60s update interval
    },

    unsubscribeBars() {
      console.log('UNSUBSCRIBE BARS');

      if (window.interval) {
        clearInterval(window.interval);
      }
    },

    calculateHistoryDepth: (resolution: any) => {
      // while optional, this makes sure we request 24 hours of minute data at a time
      // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
      return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined;
    },
  };
};
