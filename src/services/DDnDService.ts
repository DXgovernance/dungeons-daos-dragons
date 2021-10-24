import { action, makeObservable } from 'mobx';
import PromiEvent from 'promievent';
import RootContext from '../contexts';
import { ContractType } from '../stores/Provider';

export default class DDnDService {
  context: RootContext;

  constructor(context: RootContext) {
    this.context = context;

    makeObservable(this, {
      createProposal: action,
      vote: action
    });
  }
  
  gameCount(): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      process.env.REACT_APP_DDND_ADDRESS,
    ).methods.gameCount().call();
  }
  
  getGame(gameId): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      process.env.REACT_APP_DDND_ADDRESS,
    ).methods.games(gameId).call();
  }
  
  // getGuilds(): PromiEvent<any> {
  //   const { providerStore } = this.context;
  //   // const { library } = providerStore.getActiveWeb3React();
  //   return providerStore.getContract(
  //     providerStore.getActiveWeb3React(),
  //     ContractType.DDND,
  //     process.env.REACT_APP_DDND_ADDRESS,
  //   ).methods.guilds().call();
  // }

  createProposal(
    scheme: string,
    proposalData: any
  ): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      scheme,
      'proposeCalls',
      [
        proposalData.to,
        proposalData.data,
        proposalData.value,
        proposalData.titleText,
        proposalData.descriptionHash,
      ],
      {}
    );
  }

  vote(decision: string, amount: string, proposalId: string): PromiEvent<any> {
    const { providerStore } = this.context;
    const { account } = providerStore.getActiveWeb3React();
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      proposalId,
      'vote',
      [proposalId, decision, amount, account],
      {}
    );
  }

}
