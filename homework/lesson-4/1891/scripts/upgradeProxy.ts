import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const { upgrades } = await import("@openzeppelin/hardhat-upgrades");

  const proxyAddress = process.env.PROXY_ADDRESS;
  if (!proxyAddress) throw new Error("请设置环境变量 PROXY_ADDRESS");

  const FactoryV2 = await ethers.getContractFactory("UpgradeableBoxV2");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, FactoryV2);
  await upgraded.waitForDeployment();

  console.log("proxy:", await upgraded.getAddress());
  console.log("impl :", await upgrades.erc1967.getImplementationAddress(await upgraded.getAddress()));

  const tx = await upgraded.initializeV2();
  await tx.wait();
  console.log("initializeV2 done");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
