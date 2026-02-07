import { run } from "hardhat";

async function main() {
  const address = process.env.CONTRACT_ADDRESS;
  if (!address) {
    throw new Error("请设置环境变量 CONTRACT_ADDRESS=刚部署的合约地址");
  }

  // ERC1891 没有构造参数
  await run("verify:verify", {
    address,
    constructorArguments: [],
  });

  console.log("verify submitted for:", address);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
