require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();              // ⇦ ova linija mora biti tu
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [process.env.SIGNER_PRIVATE_KEY],
        },
    },
};
