import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("deployer:", deployer.address);

  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const MiniSwap = await ethers.getContractFactory("MiniSwap");

  const initialSupply = ethers.parseUnits("1000000", 18);

  const tokenA = await MockERC20.deploy("TokenA", "TKA", initialSupply);
  await tokenA.waitForDeployment();

  const tokenB = await MockERC20.deploy("TokenB", "TKB", initialSupply);
  await tokenB.waitForDeployment();

  const miniSwap = await MiniSwap.deploy();
  await miniSwap.waitForDeployment();

  console.log("TokenA:", await tokenA.getAddress());
  console.log("TokenB:", await tokenB.getAddress());
  console.log("MiniSwap:", await miniSwap.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
