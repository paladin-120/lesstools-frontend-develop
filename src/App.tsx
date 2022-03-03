import { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from './store/store';
import { BigSwapExplorer, LiveNewPairs, PairExplorer, BoardPage, UserAccount } from './pages';

import HotPairs from './components/CommonQueries/HotPairs';
import Footer from './components/Footer/index';
import Sidebar from './components/Sidebar/index';
import InfoBlock from './components/InfoBlock';
import MobileHeader from './components/MobileHeader';

export const App: React.FC = observer((props: any) => {
  const { mobileMenu } = useMst();

  useEffect(() => {
    const body = document.querySelector('body');
    if (mobileMenu.isActive) body?.classList.add('fixed');
    else body?.classList.remove('fixed');
  }, [mobileMenu.isActive, props]);

  return (
    <div className="App">
      <HotPairs />
      <MobileHeader />
      <Sidebar />
      <Route path={['/ethereum', '/binance', '/polygon', '/fantom', '/avalanche', '/xdai']}>
        <InfoBlock />
      </Route>

      <Switch>
        <Route exact path="/">
          <BoardPage />
        </Route>
        <Route
          exact
          path={[
            '/ethereum/big-swap-explorer',
            '/binance/big-swap-explorer',
            '/polygon/big-swap-explorer',
            '/fantom/big-swap-explorer',
            '/avalanche/big-swap-explorer',
            '/xdai/big-swap-explorer',
          ]}
        >
          <BigSwapExplorer />
        </Route>
        <Route
          exact
          path={[
            '/ethereum/live-new-pairs',
            '/binance/live-new-pairs',
            '/polygon/live-new-pairs',
            '/fantom/live-new-pairs',
            '/avalanche/live-new-pairs',
            '/xdai/live-new-pairs',
          ]}
        >
          <LiveNewPairs />
        </Route>
        <Route
          path={[
            '/ethereum/pair-explorer/:id',
            '/binance/pair-explorer/:id',
            '/polygon/pair-explorer/:id',
            '/fantom/pair-explorer/:id',
            '/avalanche/pair-explorer/:id',
            '/xdai/pair-explorer/:id',
          ]}
        >
          <PairExplorer />
        </Route>
        <Route path="/user-account">
          <UserAccount />
        </Route>
        <Redirect to="/" />
      </Switch>
      <Footer />
    </div>
  );
});
