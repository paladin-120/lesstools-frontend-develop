import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Web3Service } from '../services/web3/index';
import backend from '../services/backend/index';
import { useMst } from '../store/store';

const Web3ConnectorContext = React.createContext({
  web3: {},
  handleInit: () => {},
  disconect: () => {},
});

const Web3Connector: React.FC = ({ children }) => {
  const [web3Provider, setWeb3Provider] = useState<any>({});
  const { user, modals } = useMst();
  const location = useLocation();

  const login = async (web3: Web3Service) => {
    try {
      const adresses = await web3.connect();
      user.setUserWalletId(adresses[0]);
      if (localStorage.getItem('lesstools_token')) {
        user.setIsUserVerified(true);

        const res = await backend.getUserPlan();
        if (res.data) {
          user.setLessBalance(res.data.holdings.ethereum ? res.data.holdings.ethereum : 0);
          user.setUserPlan({
            planByHolding: res.data.plan_by_holding,
            planByPayments: res.data.plan_by_payments,
          });
        }
      }
    } catch (error: any) {
      if (error.code === -32002) {
        localStorage.removeItem('lesstools_token');
        window.location.reload();
      }
    }
  };

  const init = () => {
    try {
      const web3 = new Web3Service();
      if (!web3.provider) {
        modals.open('Info', 'No Metamask (or other Web3 Provider) installed');
        return;
      }

      web3.provider.on('accountsChanged', (accounts: string[]) => {
        console.log('ACCOUNTS CHANGED', accounts);
        localStorage.removeItem('lesstools_token');
        window.location.reload();
      });

      web3.provider.on('disconnect', (code: string, reason: string) => {
        console.log('ACCOUNT DISCONNECTED', code, reason);
        localStorage.removeItem('lesstools_token');
        user.disconect();
      });

      setWeb3Provider(web3);
      login(web3);
    } catch (error) {
      console.log(error);
    }
  };

  const disconect = () => {
    user.disconect();
    localStorage.removeItem('lesstools_token');
  };

  useEffect(() => {
    if (location.pathname === '/app/user-account') init();
    // eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem('lesstools_token')) init();
    // eslint-disable-next-line
  }, []);

  return (
    <Web3ConnectorContext.Provider
      value={{ web3: web3Provider, handleInit: () => init(), disconect: () => disconect() }}
    >
      {children}
    </Web3ConnectorContext.Provider>
  );
};

function useWeb3Context() {
  return useContext(Web3ConnectorContext);
}

export { Web3Connector, useWeb3Context };
