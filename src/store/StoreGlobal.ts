// eslint-disable-next-line max-classes-per-file
import { observable, action, makeObservable } from 'mobx';

// HotPairs

const initialPropsHotPairs = {
  setHotPairs: action,
};

abstract class HotPairs {
  public store: any;

  constructor() {
    this.setHotPairs = this.setHotPairs.bind(this);
  }

  setHotPairs(value: any) {
    const key = 'hotPairs';
    const newValue =  { [key]: { ...this.store[key], ...value } };
    this.store = Object.assign(this.store, newValue);
  }
}

// Store

const initialStore = {
  something: '',
};

const initialProps = {
  store: observable,
};

export class Store extends HotPairs {
  public store: any = initialStore;

  constructor() {
    super();
    makeObservable(this, {
      ...initialProps,
      ...initialPropsHotPairs,
    });
  }
}

export const StoreGlobal = new Store();
