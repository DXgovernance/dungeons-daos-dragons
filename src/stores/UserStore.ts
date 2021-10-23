import { makeObservable, observable, } from 'mobx';
import RootContext from '../contexts';
import { BigNumber, bnum } from '../utils';

export default class UserStore {
  userInfo: {
    address: string;
    ethBalance: BigNumber;
    repBalance: BigNumber;
    dxdBalance: BigNumber;
    dxdApproved: BigNumber;
    genBalance: BigNumber;
    genApproved: BigNumber;
  };
  context: RootContext;

  constructor(context) {
    this.context = context;
    this.userInfo = {
      address: context.providerStore.getActiveWeb3React(),
      ethBalance: bnum(0),
      repBalance: bnum(0),
      dxdBalance: bnum(0),
      dxdApproved: bnum(0),
      genBalance: bnum(0),
      genApproved: bnum(0),
    };
    makeObservable(this, {
      userInfo: observable
    });
  }

  getUserInfo() {
    return this.userInfo;
  }

}
