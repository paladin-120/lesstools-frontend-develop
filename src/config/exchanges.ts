import uniswap from '../assets/img/sections/live-new-pairs/uniswap.svg';
import apeswap from '../assets/img/sections/live-new-pairs/apeswap.svg';
import babyswap from '../assets/img/sections/live-new-pairs/babyswap.svg';
import biswap from '../assets/img/sections/live-new-pairs/biswap.svg';
import honeyswap from '../assets/img/sections/live-new-pairs/honeyswap.svg';
import joetrader from '../assets/img/sections/live-new-pairs/joetrader.svg';
import mdex from '../assets/img/sections/live-new-pairs/mdex.svg';
import pancake from '../assets/img/sections/live-new-pairs/pancake.svg';
import pangolin from '../assets/img/sections/live-new-pairs/pangolin.svg';
import quickswap from '../assets/img/sections/live-new-pairs/quickswap.svg';
import spiritswap from '../assets/img/sections/live-new-pairs/spiritswap.svg';
import spookyswap from '../assets/img/sections/live-new-pairs/spookyswap.svg';
import sushiswap from '../assets/img/sections/live-new-pairs/sushiswap.svg';
import { Networks } from './networks';

// todo: remove (used in mobx)
export type Exchange = 'uniswap' | 'sushiswap' | 'quickswap' | 'ethereum';

export enum Exchanges {
  Uniswap = 'Uniswap',
  Sushiswap = 'Sushiswap',
  SushiswapXdai = 'SushiswapXdai',
  SushiswapFantom = 'SushiswapFantom',
  SushiswapPolygon = 'SushiswapPolygon',
  SushiswapBinance = 'SushiswapBinance',
  Pancake = 'Pancake',
  Quickswap = 'Quickswap',
  Honeyswap = 'Honeyswap',
  Spookyswap = 'Spookyswap',
  Mdexbsc = 'Mdexbsc',
  Biswap = 'Biswap',
  Babyswap = 'Babyswap',
  Apeswap = 'Apeswap',
  Spiritswap = 'Spiritswap',
  Joetrader = 'Joetrader',
  Pangolin = 'Pangolin',
}

export const ExchangesIcons: { [key: string]: string } = {
  [Exchanges.Uniswap]: uniswap,
  [Exchanges.Sushiswap]: sushiswap,
  [Exchanges.SushiswapXdai]: sushiswap,
  [Exchanges.SushiswapFantom]: sushiswap,
  [Exchanges.SushiswapPolygon]: sushiswap,
  [Exchanges.SushiswapBinance]: sushiswap,
  [Exchanges.Pancake]: pancake,
  [Exchanges.Quickswap]: quickswap,
  [Exchanges.Honeyswap]: honeyswap,
  [Exchanges.Spookyswap]: spookyswap,
  [Exchanges.Mdexbsc]: mdex,
  [Exchanges.Biswap]: biswap,
  [Exchanges.Babyswap]: babyswap,
  [Exchanges.Apeswap]: apeswap,
  [Exchanges.Spiritswap]: spiritswap,
  [Exchanges.Joetrader]: joetrader,
  [Exchanges.Pangolin]: pangolin,
};

export const UnicryptExchangesNames: { [key: string]: string } = {
  [Exchanges.Uniswap]: 'uni-v2',
  [Exchanges.Sushiswap]: 'sushi-v1',
  [Exchanges.SushiswapXdai]: 'sushi-v1',
  [Exchanges.SushiswapFantom]: 'sushi-v1',
  [Exchanges.SushiswapPolygon]: 'sushi-v1',
  [Exchanges.SushiswapBinance]: 'sushi-v1',
  [Exchanges.Pancake]: 'pancake-v2',
  [Exchanges.Quickswap]: 'quickswap-v1',
  [Exchanges.Honeyswap]: 'honey-v1',
  [Exchanges.Spookyswap]: '',
  [Exchanges.Mdexbsc]: '',
  [Exchanges.Biswap]: '',
  [Exchanges.Babyswap]: '',
  [Exchanges.Apeswap]: '',
  [Exchanges.Spiritswap]: '',
  [Exchanges.Joetrader]: '',
  [Exchanges.Pangolin]: '',
};

export const TradingviewExchangesNames: { [key: string]: string } = {
  [Exchanges.Uniswap]: 'uniswap',
  [Exchanges.Sushiswap]: 'mainnet',
  [Exchanges.SushiswapXdai]: 'xdai',
  [Exchanges.SushiswapFantom]: 'fantom',
  [Exchanges.SushiswapPolygon]: 'matic',
  [Exchanges.SushiswapBinance]: 'BSC',
  [Exchanges.Pancake]: 'pancakeswap',
  [Exchanges.Quickswap]: 'quickswap',
  [Exchanges.Honeyswap]: 'honeyswap',
  [Exchanges.Spookyswap]: 'spookyswap',
  [Exchanges.Mdexbsc]: 'mdex_bsc',
  [Exchanges.Biswap]: 'biswap',
  [Exchanges.Babyswap]: 'babyswap',
  [Exchanges.Apeswap]: 'apeswap',
  [Exchanges.Spiritswap]: 'spiritswap',
  [Exchanges.Joetrader]: 'joetrader',
  [Exchanges.Pangolin]: 'pangolinswap',
};

export const ExchangesByNetworks: { [key: string]: string[] } = {
  [Networks.Ethereum]: [Exchanges.Uniswap, Exchanges.Sushiswap],
  [Networks.Binance]: [
    Exchanges.Apeswap,
    Exchanges.Babyswap,
    Exchanges.Biswap,
    Exchanges.Mdexbsc,
    Exchanges.Pancake,
    Exchanges.SushiswapBinance,
  ],
  [Networks.Polygon]: [Exchanges.Quickswap, Exchanges.SushiswapPolygon],
  [Networks.Xdai]: [Exchanges.Honeyswap, Exchanges.SushiswapXdai],
  [Networks.Fantom]: [Exchanges.Spiritswap, Exchanges.Spookyswap, Exchanges.SushiswapFantom],
  [Networks.Avalanche]: [Exchanges.Joetrader, Exchanges.Pangolin],
};

export const SushiswapLikeExchanges: Exchanges[] = [
  Exchanges.Sushiswap,
  Exchanges.SushiswapBinance,
  Exchanges.SushiswapFantom,
  Exchanges.SushiswapPolygon,
  Exchanges.SushiswapXdai,
];

export const isExchangeLikeSushiswap = (exchange: Exchanges) =>
  SushiswapLikeExchanges.includes(exchange);
