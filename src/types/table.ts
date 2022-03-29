import { Exchanges } from '../config/exchanges';

export interface IRowBigSwap {
  pair: string;
  exchange: Exchanges;
  time: string | Date;
  type: 'sell' | 'buy';
  quantity: number;
  totalEth: number;
  totalUsd: number;
  change: number;
  others: { liveData?: string; etherscan: string };
}

export interface IRowLiveNewPairs {
  token: string;
  exchange: Exchanges;
  listedSince: string | Date;
  actions: { uniswap?: string; unicrypt?: string; etherscan?: string; liveData?: string };
  tokenPrice: { usd: number; eth: number };
  totalLiquidity: number;
  poolAmount: number;
  poolVariation: number;
  poolRemaining: number;
  otherTokenSymbol: string;
}

export interface IRowPairExplorer {
  data: number;
  tbr: { id: string; symbol: string };
  otherToken: { id: string; symbol: string };
  type: 'sell' | 'buy';
  priceUsd: number;
  priceEth: number;
  amountEth: number;
  totalEth: number;
  maker: string;
  others: { liveData?: string; etherscan: string };
}
