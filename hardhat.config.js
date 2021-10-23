require('dotenv').config();
require('@nomiclabs/hardhat-truffle5');
require('hardhat-dependency-compiler');

const MNEMONIC = "dxdao dxdao dxdao dxdao dxdao dxdao dxdao dxdao dxdao dxdao dxdao dxdao";
const INFURA_API_KEY = process.env.REACT_APP_KEY_INFURA_API_KEY;
const ALCHEMY_API_KEY = process.env.REACT_APP_KEY_ALCHEMY_API_KEY || "";

module.exports = {
  paths: {
    sources: "./src", // Use src folder isntead of contracts to avoid having empty conrtracts folder
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      },
      {
        version: '0.8.1',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        },
      }
    ]
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: { mnemonic: MNEMONIC },
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: false,
      mining: {
        auto: true,
        interval: 5000
      }
    },
    mainnet: {
      url: ALCHEMY_API_KEY.length > 0
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
        : `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
      gasLimit: 9000000,
      timeout: 20000
    },
    rinkeby: {
      url: ALCHEMY_API_KEY.length > 0
        ? `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
        : `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
      gasLimit: 9000000,
      gasPrice: 1000000000 // 1 gwei
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
      chainId: 42161,
      timeout: 60000
    },
    arbitrumTestnet: {
      url: 'https://rinkeby.arbitrum.io/rpc',
      accounts: { mnemonic: MNEMONIC },
      chainId: 421611,
      timeout: 60000
    }
  }
};
