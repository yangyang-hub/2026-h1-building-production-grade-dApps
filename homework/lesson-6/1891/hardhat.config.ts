import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import "@nomicfoundation/hardhat-verify";
import { defineConfig } from "hardhat/config";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL || "https://services.polkadothub-rpc.com/testnet";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// 课程示例中 viem 链配置的 chainId
const CHAIN_ID = 420420417;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: { version: "0.8.28" },
      production: {
        version: "0.8.28",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    },
  },
  networks: {
    polkadotTestNet: {
      type: "http",
      chainType: "l1",
      url: RPC_URL,
      chainId: CHAIN_ID,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  // Routescan 通常兼容 etherscan API；如果需要验证，把 API KEY 填到环境变量里
  etherscan: {
    apiKey: {
      polkadotTestNet: process.env.ROUTESCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "polkadotTestNet",
        chainId: CHAIN_ID,
        urls: {
          apiURL: process.env.ROUTESCAN_API_URL || "https://polkadot.testnet.routescan.io/api",
          browserURL: "https://polkadot.testnet.routescan.io",
        },
      },
    ],
  },
});
