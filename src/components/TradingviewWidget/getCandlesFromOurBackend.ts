import backend from '../../services/backend';

export const resolutionsForOurBackend = {
  '1': 'minute',
  '5': '5minute',
  '30': 'hour',
  '60': '2hour',
  '120': '4day',
  '1D': 'day',
  '1W': 'week',
};

export const resolutionToCandlesAmount = {
  '1': 10000,
  '5': 10000,
  '30': 750,
  '60': 1440,
  '120': 10800,
  '1D': 90,
  '1W': 1800,
};

type TimeIntervals = '1' | '5' | '30' | '60' | '120' | '1D' | '1W';

interface IGetCandlesFromOurBackendProps {
  pair_id: string;
  pool: string;
  time_interval: TimeIntervals;
  candles?: number;
  fsym: string;
  tsym: string;
  fromTs: string;
  toTs: string;
  faddress: string;
  taddress: string;
}

interface ICandleFromBackend {
  close: string;
  high: string;
  low: string;
  open: string;
  time: number;
  volumefrom: number;
}

interface IFormattedCandle {
  time: number;
  low: string;
  high: string;
  open: string;
  close: string;
  volumefrom: number;
}

export const getCandlesFromOurBackend = async (data: IGetCandlesFromOurBackendProps) => {
  const candlesFromBackend = await backend.getCandlesFromOurBackned({
    pair_id: data.pair_id,
    pool: data.pool,
    time_interval: resolutionsForOurBackend[data.time_interval],
    candles: data.candles || resolutionToCandlesAmount[data.time_interval],
    fsym: data.fsym,
    tsym: data.tsym,
    fromTs: data.fromTs,
    toTs: data.toTs,
    faddress: data.faddress,
    taddress: data.taddress,
  });
  console.log('CandlesFromBackend', candlesFromBackend, data);
  const candles: Array<ICandleFromBackend> = Object.values(candlesFromBackend?.data || {});
  const formattedCandles: Array<IFormattedCandle> = [];

  for (let i = 0; i < candles.length; i += 1) {
    const currentCandle = candles[i];

    formattedCandles.push({
      time: currentCandle.time, // TradingView requires bar time in ms
      low: currentCandle.low,
      high: currentCandle.high,
      open: currentCandle.open,
      close: currentCandle.close,
      volumefrom: currentCandle.volumefrom,
    });
  }

  // for (let i = 0; i < Math.floor(formattedCandles.length / 2); i += 1) {
  //   const firstTime = formattedCandles[i].time;
  //   formattedCandles[i].time = formattedCandles[formattedCandles.length - i - 1].time;
  //   formattedCandles[formattedCandles.length - i - 1].time = firstTime;
  // }

  console.log(
    'getCandlesFromOurBackend',
    formattedCandles.sort((candle1, candle2) => {
      return candle1.time - candle2.time;
    }),
  );

  return formattedCandles
    .filter((candle) => candle.open)
    .sort((candle1, candle2) => {
      return candle1.time - candle2.time;
    });
};

export const getCandlesFromOurBackendNoReverse = async (data: IGetCandlesFromOurBackendProps) => {
  const candlesFromBackend = await backend.getCandlesFromOurBackned({
    pair_id: data.pair_id,
    pool: data.pool,
    time_interval: resolutionsForOurBackend[data.time_interval],
    candles: data.candles || resolutionToCandlesAmount[data.time_interval],
    fsym: data.fsym,
    tsym: data.tsym,
    fromTs: data.fromTs,
    toTs: data.toTs,
    faddress: data.faddress,
    taddress: data.taddress,
  });

  const candles: Array<ICandleFromBackend> = Object.values(candlesFromBackend?.data || {});
  const formattedCandles: Array<IFormattedCandle> = [];

  for (let i = 0; i < candles.length; i += 1) {
    const currentCandle = candles[i];

    if (currentCandle.open) {
      formattedCandles.push({
        time: currentCandle.time * 1000, // TradingView requires bar time in ms
        low: currentCandle.low,
        high: currentCandle.high,
        open: currentCandle.open,
        close: currentCandle.close,
        volumefrom: currentCandle.volumefrom,
      });
    }
  }

  console.log(
    'getCandlesFromOurBackendNoReverse',
    formattedCandles.sort((candle1, candle2) => {
      return candle2.time - candle1.time;
    }),
  );

  return formattedCandles.sort((candle1, candle2) => {
    return candle2.time - candle1.time;
  });
};
