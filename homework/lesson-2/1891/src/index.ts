import { ethers } from "ethers";
import {
  accountId32ToH160,
  accountId32ToSs58,
  h160ToAccountId32,
  ss58ToAccountId32,
} from "./address";
import { getEvmBalanceWei } from "./evm";
import { getSubstrateBalanceFree } from "./substrate";

async function main() {
  // 你可以只填一个：SS58 或 EVM 地址
  const SS58_ADDRESS = process.env.SS58_ADDRESS || "";
  const EVM_ADDRESS = process.env.EVM_ADDRESS || "";

  if (!SS58_ADDRESS && !EVM_ADDRESS) {
    throw new Error(
      "请通过环境变量提供 SS58_ADDRESS 或 EVM_ADDRESS（至少一个）"
    );
  }

  let ss58 = SS58_ADDRESS;
  let evm = EVM_ADDRESS;

  if (ss58 && !evm) {
    const accountId32 = ss58ToAccountId32(ss58);
    evm = accountId32ToH160(accountId32);
  }

  if (evm && !ss58) {
    const accountId32 = h160ToAccountId32(evm);
    ss58 = accountId32ToSs58(accountId32);
  }

  const accountIdFromSs58 = ss58ToAccountId32(ss58);
  const evmFromSs58 = accountId32ToH160(accountIdFromSs58);
  const accountIdFromEvm = h160ToAccountId32(evm);
  const ss58FromEvm = accountId32ToSs58(accountIdFromEvm);

  console.log("SS58:", ss58);
  console.log("EVM :", evm);
  console.log("SS58 -> AccountId32 -> EVM:", evmFromSs58);
  console.log("EVM  -> AccountId32 -> SS58:", ss58FromEvm);

  // 查询余额
  const [substrateFree, evmWei] = await Promise.all([
    getSubstrateBalanceFree(ss58),
    getEvmBalanceWei(evm),
  ]);

  console.log("Substrate free (raw):", substrateFree.toString());
  console.log("EVM balance (wei):   ", evmWei.toString());
  console.log("EVM balance (ether): ", ethers.formatEther(evmWei));

  // 作业要求：测试 balance 是否一致
  // 注意：不同链/不同接口返回单位可能不同；这里优先对比 raw 值是否完全一致
  const isEqual = substrateFree === evmWei;
  console.log("Balance raw equality:", isEqual);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
