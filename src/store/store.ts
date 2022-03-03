import { createContext, useContext } from 'react';
import { Instance, types, onSnapshot } from 'mobx-state-tree';

import {
  ModalsModel,
  HotPairsModel,
  CurrentExchangeModel,
  UserModel,
  MobileMenuModel,
} from './Models/index';

const RootModel = types.model({
  modals: ModalsModel,
  hotPairs: HotPairsModel,
  currentExchange: CurrentExchangeModel,
  user: UserModel,
  mobileMenu: MobileMenuModel,
});

export const Store = RootModel.create({
  modals: {
    openedModals: [],
    modalText: '',
  },
  hotPairs: {
    uniswap: [],
    sushiswap: [],
  },
  currentExchange: {
    exchange: 'uniswap',
  },
  user: {
    walletId: null,
    isVerified: false,
    favoritePairs: [],
    lessBalance: 0,
    planByHolding: 'Free',
    planByPayments: 'Free',
  },
  mobileMenu: {
    isActive: false,
  },
});

const rootStore = Store;

onSnapshot(rootStore, (snapshot) => {
  console.log('Snapshot: ', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const { Provider } = RootStoreContext;

export function useMst(): RootInstance {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be bull');
  }
  return store;
}

export default rootStore;
