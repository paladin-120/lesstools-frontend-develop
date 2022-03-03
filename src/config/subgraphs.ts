import { Networks } from './networks';

export enum Subgraphs {
  Uniswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/reserve',
  Sushiswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-sushiswap',
  SushiswapXdai = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-sushiswap-xdai',
  SushiswapFantom = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-sushiswap-fantom',
  SushiswapPolygon = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-sushiswap-matic',
  SushiswapBinance = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-sushiswap-bsc',
  Pancake = 'https://api.thegraph.com/subgraphs/id/QmUvmgfqARpVLv6UU3rhpGuLMhKizXibARGaNNSzFsuJTa',
  Honeyswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/honeyswap-lesstools',
  Spookyswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/spookyswap-lesstools',
  Mdexbsc = 'https://api.thegraph.com/subgraphs/name/rock-n-block/mdex-bsc-lesstools',
  Biswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/biswap-lesstools',
  Babyswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/babyswap-lesstools',
  Apeswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/apeswap-lesstools',
  Spiritswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/spiritswap-lesstools',
  Joetrader = 'https://api.thegraph.com/subgraphs/name/rock-n-block/joe-trader-lesstools',
  Pangolin = 'https://api.thegraph.com/subgraphs/name/rock-n-block/pangolin-lesstools',
  Quickswap = 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-quickless',
}

export enum SubgraphsShort {
  Uniswap = '/name/rock-n-block/reserve',
  Sushiswap = '/name/rock-n-block/lesstools-sushiswap',
  SushiswapXdai = '/name/rock-n-block/lesstools-sushiswap-xdai',
  SushiswapFantom = '/name/rock-n-block/lesstools-sushiswap-fantom',
  SushiswapPolygon = '/name/rock-n-block/lesstools-sushiswap-matic',
  SushiswapBinance = '/name/rock-n-block/lesstools-sushiswap-bsc',
  Pancake = '/id/QmUvmgfqARpVLv6UU3rhpGuLMhKizXibARGaNNSzFsuJTa',
  Honeyswap = '/name/rock-n-block/honeyswap-lesstools',
  Spookyswap = '/name/rock-n-block/spookyswap-lesstools',
  Mdexbsc = '/name/rock-n-block/mdex-bsc-lesstools',
  Biswap = '/name/rock-n-block/biswap-lesstools',
  Babyswap = '/name/rock-n-block/babyswap-lesstools',
  Apeswap = '/name/rock-n-block/apeswap-lesstools',
  Spiritswap = '/name/rock-n-block/spiritswap-lesstools',
  Joetrader = '/name/rock-n-block/joe-trader-lesstools',
  Pangolin = '/name/rock-n-block/pangolin-lesstools',
  Quickswap = '/name/rock-n-block/lesstools-quickless',
}

export interface ISubgraphsByNetworks {
  [key: string]: string[];
}

export const SubgraphsByNetworks: ISubgraphsByNetworks = {
  [Networks.Ethereum]: [Subgraphs.Sushiswap, Subgraphs.Uniswap],
  [Networks.Binance]: [
    Subgraphs.Apeswap,
    Subgraphs.Babyswap,
    Subgraphs.Biswap,
    Subgraphs.Mdexbsc,
    Subgraphs.Pancake,
    Subgraphs.SushiswapBinance,
  ],
  [Networks.Polygon]: [Subgraphs.Quickswap, Subgraphs.SushiswapPolygon],
  [Networks.Xdai]: [Subgraphs.Honeyswap, Subgraphs.SushiswapXdai],
  [Networks.Fantom]: [Subgraphs.Spiritswap, Subgraphs.Spookyswap, Subgraphs.SushiswapFantom],
  [Networks.Avalanche]: [Subgraphs.Joetrader, Subgraphs.Pangolin],
};

export interface ISubgraphsByExchange {
  [key: string]: string;
}

export const SubgraphsByExchange: ISubgraphsByExchange = {
  Uniswap: Subgraphs.Uniswap,
  Sushiswap: Subgraphs.Sushiswap,
  SushiswapXdai: Subgraphs.SushiswapXdai,
  SushiswapFantom: Subgraphs.SushiswapFantom,
  SushiswapPolygon: Subgraphs.SushiswapPolygon,
  SushiswapBinance: Subgraphs.SushiswapBinance,
  Pancake: Subgraphs.Pancake,
  Honeyswap: Subgraphs.Honeyswap,
  Spookyswap: Subgraphs.Spookyswap,
  Mdexbsc: Subgraphs.Mdexbsc,
  Biswap: Subgraphs.Biswap,
  Babyswap: Subgraphs.Babyswap,
  Apeswap: Subgraphs.Apeswap,
  Spiritswap: Subgraphs.Spiritswap,
  Joetrader: Subgraphs.Joetrader,
  Pangolin: Subgraphs.Pangolin,
  Quickswap: Subgraphs.Quickswap,
};

export interface ISubgraphsByExchangeShort {
  [key: string]: string;
}

export const SubgraphsByExchangeShort: ISubgraphsByExchangeShort = {
  Uniswap: SubgraphsShort.Uniswap,
  Sushiswap: SubgraphsShort.Sushiswap,
  SushiswapXdai: SubgraphsShort.SushiswapXdai,
  SushiswapFantom: SubgraphsShort.SushiswapFantom,
  SushiswapPolygon: SubgraphsShort.SushiswapPolygon,
  SushiswapBinance: SubgraphsShort.SushiswapBinance,
  Pancake: SubgraphsShort.Pancake,
  Honeyswap: SubgraphsShort.Honeyswap,
  Spookyswap: SubgraphsShort.Spookyswap,
  Mdexbsc: SubgraphsShort.Mdexbsc,
  Biswap: SubgraphsShort.Biswap,
  Babyswap: SubgraphsShort.Babyswap,
  Apeswap: SubgraphsShort.Apeswap,
  Spiritswap: SubgraphsShort.Spiritswap,
  Joetrader: SubgraphsShort.Joetrader,
  Pangolin: SubgraphsShort.Pangolin,
  Quickswap: SubgraphsShort.Quickswap,
};
