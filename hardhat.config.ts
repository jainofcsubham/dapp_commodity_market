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
      accounts: [
        "6fdcaa41d9968938d84d913f01ae27a23ba946c828b1fbc1b232fd0c9b0db789",
        "797672516807dbd9c82c8b56ee4789a6f7bddca8f4aaff704d985841e68b5e0f",
        "0939564378c4f239584c09397f080685f5598a310e2f6e2feaeec55b3325d9b8",
        "7bef76242eb7e12602fe33131906b88b6dd0e8ab1174ca0ff2e7d71ec000a800",
        "b92e96c2fbbab0be327cf2ccf0e3fd2fe6027f2b3a6d85e28800f4f793b7f0c9",
        "d65f4372adb158f0cc26aa1186283b90de06906729a9163d7e3ebeca6df3b2dd",
        "a030fe5a132eb172f2bde22e6fc0826ce1ba8c933db196409a569bc7dc763ca6",
        "2c5a8ebf5fda2541fd5aae4bcf5f74e27152a4424d70cc6c5d0032477047546b",
        "b087a7c8940308d5f8fc3fe2ca7c07a020e9ed1b5a513229ed47f6552d543f96",
        "d315962f35883aa76fc8f0ad3734daa525f06a94814bb99f7cd1a11a29df32cc"
      ]
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
