interface IToken {
  id: string;
  symbol: string;
  name: string;
}

type ITokenPair = {
  id: string;
  txCount: string;
  token0: IToken;
  token1: IToken;
};

export interface ISearchByIdResponse {
  match_by_pair: Array<ITokenPair>;
  match_by_token: Array<{
    id: string;
    pairBase: Array<ITokenPair>;
  }>;
}

export interface ISearchBySymbolResponse {
  match_by_symbol: Array<{
    id: string;
    symbol: string;
    pairBase: Array<ITokenPair>;
    pairQuote: Array<ITokenPair>;
  }>;
}

export type IPairsBySymbol = Array<{
  id: string;
  symbol: string;
  pairBase: Array<ITokenPair>;
  pairQuote: Array<ITokenPair>;
}>;
