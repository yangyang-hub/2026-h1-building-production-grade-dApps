import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("deployer:", deployer.address);

  const Factory = await ethers.getContractFactory("ERC1891");
  const token = await Factory.deploy();
  await token.waitForDeployment();

  console.log("ERC1891 deployed to:", await token.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
