import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const { upgrades } = await import("@openzeppelin/hardhat-upgrades");

  const [deployer] = await ethers.getSigners();
  console.log("deployer:", deployer.address);

  const Factory = await ethers.getContractFactory("UpgradeableBoxV1");

  const proxy = await upgrades.deployProxy(Factory, [1n, 999n], {
    kind: "uups",
    initializer: "initialize",
  });
  await proxy.waitForDeployment();

  console.log("proxy:", await proxy.getAddress());
  console.log("impl :", await upgrades.erc1967.getImplementationAddress(await proxy.getAddress()));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
