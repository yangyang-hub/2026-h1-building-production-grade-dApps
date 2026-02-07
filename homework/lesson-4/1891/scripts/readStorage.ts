import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) throw new Error("请设置环境变量 PROXY_ADDRESS");

  const v1 = await ethers.getContractAt("UpgradeableBoxV1", proxyAddress);

  const value = await v1.value();
  const unchanged = await v1.unchanged();

  console.log("value:", value.toString());
  console.log("unchanged:", unchanged.toString());

  // 如果已经升级到 V2，这个调用也会成功；否则会报错
  try {
    const v2 = await ethers.getContractAt("UpgradeableBoxV2", proxyAddress);
    const version = await v2.version();
    console.log("version:", version.toString());
  } catch (e) {
    console.log("version: <not upgraded>");
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
