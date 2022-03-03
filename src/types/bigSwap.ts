export interface IBigSwapInfo {
  exchange: string;
  amount0In: string;
  amount0Out: string;
  amount1In: string;
  amount1Out: string;
  amountUSD: string;
  pair: {
    reserve0: string;
    reserve1: string;
    id: string;
    token0: { symbol: string; id: string };
    token1: { symbol: string; id: string };
  };
  timestamp: string;
  transaction: { id: string };
}
