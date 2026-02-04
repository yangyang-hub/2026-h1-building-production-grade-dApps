import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MiniSwapModule", (m) => {
    // Deploy token0 (ERC20)
    const token0 = m.contract("ERC20", ["Token0", "TK0", 1000n], { id: "Token0" });

    // Deploy token1 (ERC20)
    const token1 = m.contract("ERC20", ["Token1", "TK1", 1000n], { id: "Token1" });

    // Deploy MiniSwap with token0 and token1 addresses
    const miniSwap = m.contract("MiniSwap", [token0, token1]);

    return { token0, token1, miniSwap };
});
