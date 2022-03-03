export interface IPairSwapsInfo {
  amount0In: string;
  amount0Out: string;
  amount1In: string;
  amount1Out: string;
  token0PriceETH: string;
  token0PriceUSD: string;
  token1PriceETH: string;
  token1PriceUSD: string;
  from: string;
  pair: {
    token0: { symbol: string; id: string; name: string };
    token1: { symbol: string; id: string; name: string };
  };
  timestamp: string;
  transaction: { id: string };
}
