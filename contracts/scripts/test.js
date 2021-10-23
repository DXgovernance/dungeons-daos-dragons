const hre = require("hardhat");
const fs = require("fs");
const web3 = hre.web3;
let moment = require("moment");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const BN = web3.utils.BN;

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_UINT_256 =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
const ANY_FUNC_SIGNATURE = "0xaaaaaaaa";

const DDnD = artifacts.require("DDnD.sol");
const DDnDNFT = artifacts.require("DDnDNFT.sol");

async function main() {

  // Deploy DDnD
  console.log("Deploying DDnD...");
  const ddndNFT = await DDnDNFT.new();
  const ddnd = await DDnD.new(ddndNFT.address);
  console.log("DDnD deployed to:", ddnd.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
