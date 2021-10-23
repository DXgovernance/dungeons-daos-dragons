import { Contract, ethers, utils } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { BigNumber } from 'ethers/utils'

import { getContractAddress } from '../util/networks'


const GuildAbi = [
  {
    inputs: [],
    name: 'getVotesForExecution',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'lockTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'tokensLocked',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenVault',
    outputs: [{ internalType: 'contract TokenVault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'contract IERC20Upgradeable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalLocked',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'releaseTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'to', type: 'address[]' },
      { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
      { internalType: 'uint256[]', name: 'value', type: 'uint256[]' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'bytes', name: 'contentHash', type: 'bytes' },
    ],
    name: 'createProposal',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'votesForCreation',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'votesOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'proposalId', type: 'bytes32' }],
    name: 'getProposal',
    outputs: [
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'startTime', type: 'uint256' },
      { internalType: 'uint256', name: 'endTime', type: 'uint256' },
      { internalType: 'address[]', name: 'to', type: 'address[]' },
      { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
      { internalType: 'uint256[]', name: 'value', type: 'uint256[]' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'bytes', name: 'contentHash', type: 'bytes' },
      { internalType: 'uint256', name: 'totalVotes', type: 'uint256' },
      { internalType: 'enum ERC20Guild.ProposalState', name: 'state', type: 'uint8' },
      { internalType: 'uint256', name: 'snapshotId', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProposalsIdsLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'proposalsIds',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
]

export interface Proposal {
  id: string
  address: string
  startTime: BigNumber
  endTime: BigNumber
  to: string[]
  data: string
  value: BigNumber[]
  description: string
  contentHash: string
  totalVotes: BigNumber
  state: BigNumber
  snapshotId: BigNumber
}

class OmenGuildService {
  user: ethers.providers.JsonRpcSigner
  network: number
  provider: any
  omenGuildAddress: string
  contract?: Contract

  constructor(provider: Web3Provider, network: number) {
    const signer = provider.getSigner()
    this.user = signer
    this.network = network
    this.provider = provider
    this.omenGuildAddress = getContractAddress(network, 'omenGuildProxy')
    if (this.omenGuildAddress) {
      this.contract = new ethers.Contract(this.omenGuildAddress, GuildAbi, provider.getSigner()).connect(signer)
    }
  }

  get getOmenGuildAddress(): string {
    return this.omenGuildAddress
  }

  static encodeLockTokens = (amount: any) => {
    const guildInterface = new utils.Interface(GuildAbi)
    return guildInterface.functions.lockTokens.encode([amount])
  }

  static encodeUnlockTokens = (amount: BigNumber) => {
    const guildInterface = new utils.Interface(GuildAbi)
    return guildInterface.functions.releaseTokens.encode([amount])
  }

  static encodeCreateProposal(
    to: string[],
    data: string[],
    amount: BigNumber[],
    description: string,
    contentHash: string,
  ) {
    const guildInterface = new utils.Interface(GuildAbi)
    return guildInterface.functions.createProposal.encode([to, data, amount, description, contentHash])
  }

  votesOf = async (address: string) => {
    return this.contract?.votesOf(address)
  }

  votesForCreation = async () => {
    return this.contract?.votesForCreation()
  }

  lockTokens = async (amount: BigNumber) => {
    return await this.contract?.lockTokens(amount)
  }

  unlockTokens = async (amount: BigNumber) => {
    return await this.contract?.releaseTokens(amount)
  }

  tokensLocked = async (address: string) => {
    return this.contract?.tokensLocked(address)
  }

  totalLocked = async () => {
    return this.contract?.totalLocked()
  }

  omenTokenAddress = async () => {
    return await this.contract?.token()
  }

  tokenVault = async () => {
    return this.contract?.tokenVault()
  }

  lockTime = async () => {
    return this.contract?.lockTime()
  }
  getVotesForExecution = async () => {
    return this.contract?.getVotesForExecution()
  }

  getProposalsIdsLength = async () => {
    return this.contract?.getProposalsIdsLength()
  }

  getProposal = async (id: number) => {
    return this.contract?.getProposal(id)
  }



}

export { OmenGuildService }