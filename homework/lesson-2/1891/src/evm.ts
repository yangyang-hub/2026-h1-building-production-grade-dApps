import { ethers } from "ethers";
import { HUB_RPC_HTTP } from "./networks";

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(HUB_RPC_HTTP);
}

export async function getEvmBalanceWei(address: string): Promise<bigint> {
  const provider = getProvider();
  return (await provider.getBalance(address)).toBigInt();
}
