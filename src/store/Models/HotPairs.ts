import { types } from 'mobx-state-tree';

const TokenModel = types.model({
  id: types.string,
  symbol: types.string,
  derivedUSD: types.string,
});

const PairModel = types.model({
  id: types.string,
  token0: TokenModel,
  token1: TokenModel,
});

const InfoModel = types.model({
  hourlyTxns: types.union(types.string, types.number),
  pair: PairModel,
});

const HotPairsModel = types
  .model({
    uniswap: types.array(InfoModel),
    sushiswap: types.array(InfoModel),
    quickswap: types.array(InfoModel),
    ethereum: types.array(InfoModel),
  })
  .actions((self) => ({
    // todo: remove
    setUniPairs(pairs: any) {
      self.uniswap = pairs;
    },
    // todo: remove
    setSushiPairs(pairs: any) {
      self.sushiswap = pairs;
    },
    // todo: remove
    setQuickswapPairs(pairs: any) {
      self.quickswap = pairs;
    },
    //
    setHotPairs(pairs: any) {
      // eslint-disable-next-line no-param-reassign
      self = { ...self, ...pairs };
    },
  }));

export default HotPairsModel;
