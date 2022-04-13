const IS_PRODUCTION = false;
const IS_PREPRODUCTION = true;
export const REACT_APP_CRYPTOCOMPARE_API_KEY =
  '8eae098cd1fb6a0a2dc9ad364565acc313d7aa1cbd6132f56a2e46890a03258e';

export default {
  APIS: {
    // eslint-disable-next-line no-nested-ternary
    backend: IS_PRODUCTION
      ? ''
      : IS_PREPRODUCTION
      ? 'http://127.0.0.1:8000/api/v1/'
      : 'https://tools.less.xyz/api/v1/',
    COINGECKO: 'https://api.coingecko.com/api/v3',
    // backend: 'https://tools.less.xyz/api/v1/',
    THE_GRAPH: 'https://api.thegraph.com/subgraphs',
  },
  WALLET_TO_PAY: '0x5a4B4454EDC88325FA1f88A8D9016E8b6eB3BEC5',
};
