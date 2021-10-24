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
  
  getGuildName(guildAddress): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      guildAddress,
    ).methods.name().call();
  }
  
  getProposalIds(guildAddress): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      guildAddress,
    ).methods.proposalsIds().call();
  }
  
  getProposal(guildAddress, proposalId): PromiEvent<any> {
    const { providerStore } = this.context;
    // const { library } = providerStore.getActiveWeb3React();
    return providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      guildAddress,
    ).methods.getProposal(proposalId).call();
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
  
  getGameTopic(players, gameId) {
    const { providerStore } = this.context;
    const { library } = providerStore.getActiveWeb3React();
    return library.utils.soliditySha3(...players, gameId);
  }
  
  async getAllGameData(gameId) {
    let gameData;
    await Promise.all([
      this.getGame(gameId),
      this.getGamePlayersState(gameId),
      this.getGamePlayers(gameId)
    ]).then( async ([game, playersState, playersAddresses]) => {
      gameData = game;
      gameData.topic = this.getGameTopic(playersAddresses, "1")
      gameData.playersState = playersState;
      gameData.playersAddresses = playersAddresses;
      gameData.messages = await this.getMessages(gameData.topic);
      gameData.actions = {}
      for (let index = 1; index < gameData.playersAddresses.length; index++) {
        const guildAddress = gameData.playersAddresses[index];
        gameData.actions[guildAddress] = {
          "move_south": {
            proposalId: "",
            eip1271Signature: "",
            votes: "0",
            state: "0"
          },
          "move_north": {
            proposalId: "",
            eip1271Signature: "",
            votes: "0",
            state: "0"
          },
          "move_east": {
            proposalId: "",
            eip1271Signature: "",
            votes: "0",
            state: "0"
          },
          "move_west": {
            proposalId: "",
            eip1271Signature: "",
            votes: "0",
            state: "0"
          },
        }
        await gameData.messages.map(async (message) => {
          if (message.message.split(':')[0] == guildAddress){
            const proposal = await this.getProposal(guildAddress, message.message.split(':')[1]);
            if (Number(gameData.turnNumber)+1 == Number(message.message.split(':')[2])){
              gameData.actions[guildAddress][message.message.split(':')[3]].proposalId = message.message.split(':')[1];
              gameData.actions[guildAddress][message.message.split(':')[3]].eip1271Signature = message.message.split(':')[4];
              gameData.actions[guildAddress][message.message.split(':')[3]].state = proposal.state
              gameData.actions[guildAddress][message.message.split(':')[3]].votes = proposal.totalVotes
            }
          }
        })
        console.log('GameData', gameData);
      }
      // Get Proposals from messages, form each proposal save the raw action, hashed action and signed action
      
      // When a proposal gets enough votes is collected by the DM, and executed with his hashed action and signed action
    
    })
    return gameData;
  }
  
  setNextTurnFromDM(
    gameId,
    turnNumber,
    gameState,
    finalActionsOfActualTurn, // [CLOSING DM ACTION, ACTIONS CHOSEN HASHED]
    winner, // address 0x0
    finalActionsSignatures,
    startActionsOfNextTurn // [OPENING DM ACTION, INITIAL STATE OF CHARACTER]
  ): PromiEvent<any> {
    const { providerStore } = this.context;
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.DDND,
      process.env.REACT_APP_DDND_ADDRESS,
      'setGameState',
      [
        gameId,
        turnNumber,
        gameState,
        finalActionsOfActualTurn,
        winner,
        finalActionsSignatures,
        startActionsOfNextTurn
      ],
      {}
    );
  }

  createProposal(
    guildAddress: string,
    proposalData: any
  ): PromiEvent<any> {
    const { providerStore } = this.context;
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      guildAddress,
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

  async voteAction(guildAddress: string, proposalId: string, amount: string, voteAction: string, gameTopic: string) {
    const { providerStore } = this.context;
    const { library, account } = providerStore.getActiveWeb3React();

    return await new Promise((resolve) => {
      library.eth.sign(
        voteAction,
        account
      ).then((eip1271Signature) => {
        console.log(eip1271Signature)
        resolve(eip1271Signature)
        providerStore.sendTransaction(
          providerStore.getActiveWeb3React(),
          ContractType.MessageLogger,
          process.env.REACT_APP_MESSAGE_LOGGER,
          'broadcast',
          [gameTopic, `${guildAddress}:${proposalId}:${voteAction}:${eip1271Signature}`]
        ).then(async () => {
          return await providerStore.sendTransaction(
            providerStore.getActiveWeb3React(),
            ContractType.ERC20Guild,
            guildAddress,
            'setVote',
            [proposalId, amount]
          );
        })
      });
    })
    
  }
  
  endProposal(guildAddress:string, proposalId: string): PromiEvent<any> {
    const { providerStore } = this.context;
    return providerStore.sendTransaction(
      providerStore.getActiveWeb3React(),
      ContractType.ERC20Guild,
      guildAddress,
      'endProposal',
      [proposalId],
      {}
    );
  }
  
  signMessage(messageToSign): PromiEvent<any> {
    const { providerStore } = this.context;
    const { library, account } = providerStore.getActiveWeb3React();
    return library.eth.sign(messageToSign, account);
  }

}
