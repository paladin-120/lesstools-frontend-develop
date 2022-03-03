import { types } from 'mobx-state-tree';

const TokenModel = types.model({
  derivedUSD: types.string,
  symbol: types.string,
  id: types.string,
});

const FavoritePairModel = types.model({
  id: types.string,
  token0: TokenModel,
  token1: TokenModel,
});

const UserModel = types
  .model({
    walletId: types.union(types.string, types.null),
    isVerified: types.boolean,
    favoritePairs: types.array(FavoritePairModel),
    lessBalance: types.number,
    planByHolding: types.union(
      types.literal('Free'),
      types.literal('Standard'),
      types.literal('Premium'),
    ),
    planByPayments: types.union(
      types.literal('Free'),
      types.literal('Standard'),
      types.literal('Premium'),
    ),
  })
  .actions((self) => ({
    setUserWalletId(walletId: string | null) {
      self.walletId = walletId;
    },
    setIsUserVerified(foo: boolean) {
      self.isVerified = foo;
    },
    setFavoritesPairs(pairs: any) {
      self.favoritePairs = pairs;
    },
    setLessBalance(balance: number) {
      self.lessBalance = balance;
    },
    setUserPlan(data: {
      planByHolding: 'Free' | 'Standard' | 'Premium';
      planByPayments: 'Free' | 'Standard' | 'Premium';
    }) {
      self.planByHolding = data.planByHolding;
      self.planByPayments = data.planByPayments;
    },
    disconect() {
      self.walletId = null;
      self.isVerified = false;
      self.lessBalance = 0;
      self.planByHolding = 'Free';
      self.planByPayments = 'Free';
    },
  }))
  .views((self) => ({
    get userPlan() {
      const plans = { Free: 0, Standard: 1, Premium: 2 };
      const maxPlan = Math.max(plans[self.planByHolding], plans[self.planByPayments]);
      return Object.keys(plans)[maxPlan];
    },
  }));

export default UserModel;
