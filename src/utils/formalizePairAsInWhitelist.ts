import { WHITELIST, WHITELIST_SYMBOLS } from '../data/whitelist';

interface IToken {
  id: string;
  symbol: string;
}

/**
 * Function description
 *
 * @param {IToken} token0 first token from pair
 * @param {IToken} token1 second token from pair
 * @returns return array, where first token is a token from whitelist and second is a shittoken
 */
export const formalizePairAsInWhitelist = (token0Id: IToken, token1Id: IToken) => {
  return WHITELIST.includes(token0Id.id) ? [token0Id, token1Id] : [token1Id, token0Id];
};

/**
 * Function description
 *
 * @param {string} token0Symbol first token symbol from pair
 * @param {string} token1Symbol second token symbol from pair
 * @returns return array, where first token is a token from whitelist and second is a shittoken
 */
export const formalizePairAsInWhitelistBySymbols = (token0Symbol: string, token1Symbol: string) => {
  return WHITELIST_SYMBOLS.includes(token0Symbol)
    ? [token0Symbol, token1Symbol]
    : [token1Symbol, token0Symbol];
};
