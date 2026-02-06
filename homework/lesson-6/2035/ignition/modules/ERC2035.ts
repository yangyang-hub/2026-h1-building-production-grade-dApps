import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ERC2035Module", (m) => {
  const contract = m.contract("ERC2035");

  return { contract };
});
