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
  
  async getGame(gameId){
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return await providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      process.env.REACT_APP_DDND_ADDRESS,
    ).methods.games(gameId).call()
  }
  
  async getGamePlayers(gameId){
    const { providerStore } = this.context;
    return await providerStore.getContract(
        providerStore.getActiveWeb3React(),
        ContractType.DDND,
        process.env.REACT_APP_DDND_ADDRESS,
      ).methods.getPlayersAddresses(gameId).call()
  }
  
  async getGamePlayersState(gameId){
    const { providerStore } = this.context;
    return await providerStore.getContract(
        providerStore.getActiveWeb3React(),
        ContractType.DDND,
        process.env.REACT_APP_DDND_ADDRESS,
      ).methods.getPlayersState(gameId).call()
  }
  
  getGuilds(): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      process.env.REACT_APP_DDND_ADDRESS,
    ).methods.getGuilds().call();
  }
  
  async getMessages(topic) {
    const { providerStore } = this.context;
    const rawEvents = await providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.MessageLogger,
      process.env.REACT_APP_MESSAGE_LOGGER,
    ).getPastEvents("allEvents", { filter: {"topic": topic}, fromBlock: 1});
    return rawEvents.map((message) => {return {
      message: message.returnValues.message,
      sender: message.returnValues.sender
    }});
  }
  
  // getLiveProposals(gameId, )
  // 
  // executeProposal(gameId, guildAddress, stateGameHash, turn, action){
  // 
  // }
  // 
  // voteProposal(gameId, guildAddress, stateGameHash, turn, action){
  // 
  // }
  // 
  getGameTopic(players, gameId) {
    const { providerStore } = this.context;
    const { library } = providerStore.getActiveWeb3React();
    return library.utils.soliditySha3(...players, gameId);
  }

  createProposal(
    scheme: string,
    proposalData: any
  ): PromiEvent<any> {
    const { providerStore } = this.context;
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      scheme,
      'createProposal',
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

  vote(proposalId: string, amount: string): PromiEvent<any> {
    const { providerStore } = this.context;
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      proposalId,
      'setVote',
      [proposalId, amount],
      {}
    );
  }

}
