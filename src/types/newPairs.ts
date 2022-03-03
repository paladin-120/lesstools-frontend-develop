export interface INewPair {
  exchange: string;
  createdAtTimestamp: string;
  creationTxnHash: string;
  id: string;
  initialReserve0: string;
  initialReserve1: string;
  reserve0: string;
  reserve1: string;
  reserveUSD: string;
  token0: {
    derivedETH: string;
    derivedUSD: string;
    id: string;
    symbol: string;
  };
  token1: {
    derivedETH: string;
    derivedUSD: string;
    id: string;
    symbol: string;
  };
}
