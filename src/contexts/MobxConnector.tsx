import React, { createContext, useContext } from 'react';
import { Store, StoreGlobal } from '../store/StoreGlobal';

const StoreContext = createContext<Store>(StoreGlobal);

const StoreConnector: React.FC = ({ children }) => {
  return <StoreContext.Provider value={StoreGlobal}>{children}</StoreContext.Provider>;
};

const useStoreContext = () => useContext(StoreContext);

export { StoreConnector, useStoreContext };
