import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import rootStore, { Provider as StoreProvider } from './store/store';
import ScrollToTop from './utils/scrollToTop';
import CurrentExchange from './utils/currentExchange';
import { App } from './App';
import { Web3Connector } from './contexts/Web3Connector';
import { StoreConnector } from './contexts/MobxConnector';

import './styles/index.scss';
import { Subgraphs } from './config/subgraphs';

const httpLink = (uri: string) =>
  new HttpLink({
    uri,
  });

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`GraphQL error: ${message}`, { locations, path }),
    );
  if (networkError) console.log(`GraphQL network error: ${networkError}`);
});

const initApolloClient = (uri: string) =>
  new ApolloClient({
    uri,
    link: from([errorLink, httpLink(uri)]),
    cache: new InMemoryCache(),
  });

export interface IApolloClients {
  [key: string]: any;
}

// uniswap (default)
export const uniswapSubgraph = initApolloClient(Subgraphs.Uniswap);

// sushiswap for Ethereum
export const sushiswapSubgraph = initApolloClient(Subgraphs.Sushiswap);

// для номера блока (pair explorer page)
export const getBlockClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/avalanche-blocks',
  cache: new InMemoryCache(),
});

// для hot pairs (hot pairs component) -- WILL BE DELETED
export const uniswapCurrentVersion = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/rock-n-block/lesstools-uniswap-v2',
  cache: new InMemoryCache(),
});

export const ApolloClientsForExchanges: IApolloClients = {
  Uniswap: initApolloClient(Subgraphs.Uniswap),
  Sushiswap: initApolloClient(Subgraphs.Sushiswap),
  Pancake: initApolloClient(Subgraphs.Pancake),
  Honeyswap: initApolloClient(Subgraphs.Honeyswap),
  Spookyswap: initApolloClient(Subgraphs.Spookyswap),
  Mdexbsc: initApolloClient(Subgraphs.Mdexbsc),
  Biswap: initApolloClient(Subgraphs.Biswap),
  Babyswap: initApolloClient(Subgraphs.Babyswap),
  Apeswap: initApolloClient(Subgraphs.Apeswap),
  Spiritswap: initApolloClient(Subgraphs.Spiritswap),
  Joetrader: initApolloClient(Subgraphs.Joetrader),
  Pangolin: initApolloClient(Subgraphs.Pangolin),
  Quickswap: initApolloClient(Subgraphs.Quickswap),
};

ReactDOM.render(
  <ApolloProvider client={ApolloClientsForExchanges.Uniswap}>
    <Router>
      <StoreProvider value={rootStore}>
        <Web3Connector>
          <StoreConnector>
            <CurrentExchange>
              <ScrollToTop>
                <App />
              </ScrollToTop>
            </CurrentExchange>
          </StoreConnector>
        </Web3Connector>
      </StoreProvider>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
