const HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

module.exports = {
     // See <http://truffleframework.com/docs/advanced/configuration>
     // to customize your Truffle configuration!
     networks: {
          ganache: {
               host: "localhost",
               port: 8545,
               network_id: "*", // Match any network id
               gas: 4700000
          },
          rinkeby: {
               host: "localhost",
               port: 7545,
               network_id: 4,
               gas: 4700000
          },
          ropsten: {
               provider: () => {
                    return new HDWalletProvider(
                         'person first nerve eager obtain bargain stool coin pulp witness elder measure',
                         "https://ropsten.infura.io/v3/6cc1f696559744a1834146d327efbc88")// + process.env.INFURA_PROJECT_ID);
          },
               network_id: 3,
               gas: 4700000,
               gasPrice: 10000000000
          }
     }
};
