import { Interface } from 'ethers/utils';
import RootContext from '../contexts';
import { ContractType } from '../stores/Provider';

export default class MulticallService {
  context: RootContext;

  activeCalls: Call[];
  activeCallsRaw: any[];

  constructor(context: RootContext) {
    this.context = context;
    this.resetActiveCalls();
  }

  // Add call additions and removals
  async executeCalls(calls?: Call[], rawCalls?: any[]) {
    const { providerStore, configStore } = this.context;

    const multi = providerStore.getContract(
      providerStore.getActiveWeb3React(),
      ContractType.Multicall,
      configStore.getNetworkContracts().utils.multicall
    );

    const response = await multi.methods
      .aggregate(rawCalls || this.activeCallsRaw)
      .call();
    return {
      calls: calls || this.activeCalls,
      results: response.returnData,
      blockNumber: response.blockNumber,
    };
  }

  addCalls(calls: Call[]) {
    calls.forEach(call => this.addCall(call));
  }

  addCall(call: Call) {
    this.addContractCall(call);
  }

  addContractCall(call: Call) {
    const { abiService } = this.context;
    const iface = new Interface(abiService.getAbi(call.contractType));
    call.params = call.params ? call.params : [];
    const encoded = iface.functions[call.method].encode(call.params);
    this.activeCallsRaw.push([call.address, encoded]);
    this.activeCalls.push(call);
  }

  decodeCall(call: Call, result: any) {
    const { abiService } = this.context;
    const iface = new Interface(abiService.getAbi(call.contractType));
    return iface.functions[call.method].decode(result);
  }

  resetActiveCalls() {
    this.activeCalls = [];
    this.activeCallsRaw = [];
  }
}
