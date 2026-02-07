import { ethers } from "ethers";
import { getProvider } from "./evm";

const HASH_PRECOMPILE = "0x0000000000000000000000000000000000000002";

async function main() {
  const provider = getProvider();

  // 选择一个 precompile：这里调用 sha256 预编译合约（0x02）
  // 直接传入任意 data，返回值就是 sha256(data)
  const message = "Hello Polkadot!";
  const inputBytes = ethers.toUtf8Bytes(message);
  const data = ethers.hexlify(inputBytes);

  const result = await provider.call({
    to: HASH_PRECOMPILE,
    data,
  });

  const localHash = ethers.sha256(inputBytes);

  console.log("precompile(sha256) input message:", message);
  console.log("precompile(sha256) input hex:", data);
  console.log("precompile(sha256) output:", result);
  console.log("local sha256 output:", localHash);
  console.log("hash match:", result.toLowerCase() === localHash.toLowerCase());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
