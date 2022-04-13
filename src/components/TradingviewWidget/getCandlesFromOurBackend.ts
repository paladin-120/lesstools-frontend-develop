import backend from '../../services/backend';

export const resolutionsForOurBackend = {
  '1': 'minute',
  '3': '3minute',
  '5': '5minute',
  '15': '15minute',
  '30': '30minute',
  '60': 'hour',
  '120': '2hour',
  '240': '12hour',
  '1D': 'day',
  '1W': 'week',
};

type TimeIntervals = '1' | '3' | '5' | '15' | '30' | '60' | '120' | '240' | '1D' | '1W';

interface IGetCandlesFromOurBackendProps {
  pair_id: string;
  pool: string;
  time_interval: TimeIntervals;
  from?: any;
  to?: any;
}

interface ICandleFromBackend {
  close: string;
  end_time: number;
  high: string;
  low: string;
  open: string;
  start_time: number;
  volume: number;
}

interface IFormattedCandle {
  time: number;
  low: string;
  high: string;
  open: string;
  close: string;
  volume: number;
}

export const getCandlesFromOurBackend = async (data: IGetCandlesFromOurBackendProps) => {
  const candlesFromBackend = await backend.getCandlesFromOurBackned({
    pair_id: data.pair_id,
    pool: data.pool,
    time_interval: resolutionsForOurBackend[data.time_interval],
    from: `${data?.from}` || '0',
    to: `${data?.to}` || '0',
  });

  const candles: Array<ICandleFromBackend> = Object.values(candlesFromBackend?.data || {});
  const formattedCandles: Array<IFormattedCandle> = [];
  let oldCandle: any = null;

  for (let i = 0; i < candles.length; i += 1) {
    const currentCandle = candles[i];
    if (parseInt(currentCandle.open, 10) > 0) {
      formattedCandles.push({
        time: currentCandle.start_time * 1000, // TradingView requires bar time in ms
        low: currentCandle.low,
        high: currentCandle.high,
        open: currentCandle.open,
        close: currentCandle.close,
        volume: currentCandle.volume,
      });
      oldCandle = currentCandle;
    } else {
      formattedCandles.push({
        time: currentCandle.start_time * 1000, // TradingView requires bar time in ms
        low: oldCandle?.high,
        high: oldCandle?.high,
        open: oldCandle?.high,
        close: oldCandle?.high,
        volume: 0,
      });
    }
  }
  console.log(
    'getCandlesFromOurBackend',
    resolutionsForOurBackend[data.time_interval],
    candles,
    formattedCandles,
  );
  return formattedCandles
    .filter((candle) => candle.open)
    .sort((candle1, candle2) => candle1.time - candle2.time);
};

export const getCandlesFromOurBackendNoReverse = async (data: IGetCandlesFromOurBackendProps) => {
  const candlesFromBackend = await backend.getCandlesFromOurBackned({
    pair_id: data.pair_id,
    pool: data.pool,
    time_interval: resolutionsForOurBackend[data.time_interval],
    from: `${data.from}` || '0',
    to: `${data.to}` || '0',
  });

  const candles: Array<ICandleFromBackend> = Object.values(candlesFromBackend?.data || {});
  const formattedCandles: Array<IFormattedCandle> = [];

  for (let i = 0; i < candles.length; i += 1) {
    const currentCandle = candles[i];

    if (currentCandle.open) {
      formattedCandles.push({
        time: currentCandle.start_time * 1000, // TradingView requires bar time in ms
        low: currentCandle.low,
        high: currentCandle.high,
        open: currentCandle.open,
        close: currentCandle.close,
        volume: currentCandle.volume,
      });
    }
  }

  return formattedCandles
    .filter((candle) => candle.open)
    .sort((candle1, candle2) => {
      return candle1.time - candle2.time;
    });
};
