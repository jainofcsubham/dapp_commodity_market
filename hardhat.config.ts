import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

const config: HardhatUserConfig = {
  solidity: {
    version :"0.8.25",
    settings :{
      optimizer :{
        enabled :true,
        runs : 200,
      }
    }
  },
  networks :{
    sepolia :{
      url : `https://eth-sepolia.g.alchemy.com/v2/fN2xkOEGwvyFklSrpJlt57lPI0VnBIiE`,
      accounts: []
    }
  },
  gasReporter :{
    currency :'INR',
    enabled :   true,
    coinmarketcap : "8ef7c7fd-e58a-4fc6-859c-ccd61d591db2"
    // gasPriceApi:"https://api.etherscan.io/api?module=proxy&action=eth_gasPrice"
  }
};

export default config;
