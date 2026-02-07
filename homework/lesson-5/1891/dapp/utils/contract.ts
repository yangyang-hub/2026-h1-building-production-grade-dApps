import StorageABI from "../abis/Storage.json";

export const CONTRACT_ABI = (StorageABI as any).abi;

// 部署后把合约地址填到这里（或者用 NEXT_PUBLIC_CONTRACT_ADDRESS 环境变量）
export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined) ||
  ("0x0000000000000000000000000000000000000000" as const);
