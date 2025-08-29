import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers"; // Explicitly importing hardhat-ethers

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      // You'll need to configure this network with your own details.
      // This is a placeholder.
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    // You'll need to configure this with your own Etherscan API key.
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};

export default config;
