import { types } from 'mobx-state-tree';

const CurrentExchangeModel = types
  .model({
    exchange: types.string,
  })
  .actions((self) => ({
    setCurrentExchange(exchange: string) {
      self.exchange = exchange;
    },
  }));

export default CurrentExchangeModel;
