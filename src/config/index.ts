const IS_PRODUCTION = false;
const IS_PREPRODUCTION = true;
export const REACT_APP_CRYPTOCOMPARE_API_KEY =
  '6db91bc6e02689fbf54e97df570d533fd9db38e3da019281b1df292c6d480b0a';

export default {
  APIS: {
    // eslint-disable-next-line no-nested-ternary
    backend: IS_PRODUCTION
      ? ''
      : IS_PREPRODUCTION
      ? // ? 'http://localhost:8000/api/v1/'
        'https://tools.less.xyz/api/v1/'
      : // 'https://tools.less.xyz/api/v1/'
        'https://lesstools.rocknblock.io/api/v1/',
    COINGECKO: 'https://api.coingecko.com/api/v3',
    // backend: 'https://tools.less.xyz/api/v1/',
    THE_GRAPH: 'https://api.thegraph.com/subgraphs',
  },
  WALLET_TO_PAY: '0x5a4B4454EDC88325FA1f88A8D9016E8b6eB3BEC5',
};
