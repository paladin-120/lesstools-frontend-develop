import { types } from 'mobx-state-tree';

const MobileMenuModel = types
  .model({
    isActive: types.boolean,
  })
  .actions((self) => ({
    toogleMobileMenu() {
      self.isActive = !self.isActive;
    },
    setMobileMenu(foo: boolean) {
      self.isActive = foo;
    },
  }));

export default MobileMenuModel;
