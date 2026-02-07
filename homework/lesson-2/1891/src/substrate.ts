import { ApiPromise, WsProvider } from "@polkadot/api";
import { HUB_RPC_WS } from "./networks";

let cachedApi: ApiPromise | null = null;

export async function getApi(): Promise<ApiPromise> {
  if (cachedApi) return cachedApi;

  const provider = new WsProvider(HUB_RPC_WS);
  cachedApi = await ApiPromise.create({ provider });
  return cachedApi;
}

export async function getSubstrateBalanceFree(ss58: string): Promise<bigint> {
  const api = await getApi();
  const accountInfo = await api.query.system.account(ss58);
  // AccountData.free: Balance (BN-like)
  const free = (accountInfo as any).data.free.toBigInt() as bigint;
  return free;
}
