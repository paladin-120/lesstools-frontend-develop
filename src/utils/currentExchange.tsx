import React from 'react';
// import { useLocation } from 'react-router-dom';

// import { useMst } from '../store/store';

const CurrentExchange: React.FC = ({ children }) => {
  // const location = useLocation();
  // const { pathname } = location;
  // const { currentExchange } = useMst();

  // useEffect(() => {
  //   const exchange = pathname.split('/').find((str) => str.includes('swap'));
  //
  //   if (exchange && exchange !== currentExchange.exchange) {
  //     // NOTE: setCurrentExchange accepts only "uniswap" or "sushiswap" thats why i use ts-ignore (str.includes returns "String")
  //     // eslint-disable-next-line
  //     // @ts-ignore
  //     currentExchange.setCurrentExchange(exchange);
  //   }
  //   // eslint-disable-next-line
  // }, [location, pathname]);

  return <>{children}</>;
};

export default CurrentExchange;
