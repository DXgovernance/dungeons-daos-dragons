require('dotenv').config();

require('@nomiclabs/hardhat-truffle5');

const INFURA_PROJECT_ID = process.env.KEY_INFURA_API_KEY;
const MNEMONIC = "ddnd ddnd ddnd ddnd ddnd ddnd ddnd ddnd ddnd ddnd ddnd ddnd";

const hardharNetworks = process.env.CI
  ? {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      gasLimit: 9000000,
      gasPrice: 10000000000, // 10 gwei
      timeout: 60000
    }
  }
  : {
    hardhat: {
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      gasLimit: 9000000,
      gasPrice: 10000000000, // 10 gwei
      timeout: 60000,
      mining: {
        auto: true,
        interval: 30000
      }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: { mnemonic: MNEMONIC },
      gasLimit: 9000000,
      gasPrice: 100000000000, // 100 gwei
      timeout: 60000
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: { mnemonic: MNEMONIC },
      gasLimit: 10000000,
      gasPrice: 1000000000, // 1 gwei
      timeout: 60000
    },
    xdai: {
      url: `https://rpc.xdaichain.com/`,
      accounts: { mnemonic: MNEMONIC },
      gasLimit: 17000000,
      gasPrice: 2000000000, // 2 gwei
      timeout: 60000
    },
    arbitrum: {
      url: `https://arb1.arbitrum.io/rpc`,
      accounts: { mnemonic: MNEMONIC },
      gasPrice: 1000000000, // 1 gwei
      chainId: 42161,
      timeout: 600000 // 10 minutes
    },
    arbitrumTestnet: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: { mnemonic: MNEMONIC },
      chainId: 421611,
      timeout: 60000
    }
  };


module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.8',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  },
  gasReporter: {
    currency: 'USD',
    enabled: process.env.ENABLE_GAS_REPORTER === 'true'
  },
  networks: hardharNetworks
};
