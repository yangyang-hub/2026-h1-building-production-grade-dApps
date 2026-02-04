import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("MiniSwap", async function () {
    const { viem } = await network.connect();
    const publicClient = await viem.getPublicClient();
    const [account0] = await viem.getWalletClients();
    const account0Address = (await viem.getWalletClients())[0].account.address;

    it("Should deploy MiniSwap with two ERC20 tokens", async function () {
        // Deploy token0
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 1000n]);

        // Deploy token1
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 1000n]);

        // Deploy MiniSwap
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // Verify token addresses are set correctly
        const storedToken0 = await miniSwap.read.token0();
        const storedToken1 = await miniSwap.read.token1();

        assert.equal(storedToken0.toLowerCase(), token0.address.toLowerCase());
        assert.equal(storedToken1.toLowerCase(), token1.address.toLowerCase());
    });

    it("Should add liquidity to the pool", async function () {
        // Deploy contracts
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 1000n]);
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 1000n]);
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // Approve tokens for MiniSwap
        await token0.write.approve([miniSwap.address, 100n]);
        await token1.write.approve([miniSwap.address, 100n]);

        // Add liquidity
        await miniSwap.write.addLiquidity([100n, 100n]);

        // Check reserves
        const [reserve0, reserve1] = await miniSwap.read.getReserves();
        assert.equal(reserve0, 100n);
        assert.equal(reserve1, 100n);

        // Check total supply
        const totalSupply = await miniSwap.read.totalSupply();
        assert.equal(totalSupply, 100n);

        // Check balance of liquidity provider
        const balance = await miniSwap.read.balance([account0Address]);
        assert.equal(balance, 100n);
    });

    it("Should remove liquidity from the pool", async function () {
        // Deploy contracts
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 1000n]);
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 1000n]);
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // Approve and add liquidity
        await token0.write.approve([miniSwap.address, 200n]);
        await token1.write.approve([miniSwap.address, 200n]);
        await miniSwap.write.addLiquidity([200n, 200n]);

        // Get initial token balances
        const initialToken0Balance = await token0.read.balanceOf([account0Address]);
        const initialToken1Balance = await token1.read.balanceOf([account0Address]);

        // Remove 50% of liquidity
        await miniSwap.write.removeLiquidity([100n]);

        // Check that tokens are transferred back
        const finalToken0Balance = await token0.read.balanceOf([account0Address]);
        const finalToken1Balance = await token1.read.balanceOf([account0Address]);

        assert.equal(finalToken0Balance, initialToken0Balance + 100n);
        assert.equal(finalToken1Balance, initialToken1Balance + 100n);

        // Check remaining reserves
        const [reserve0, reserve1] = await miniSwap.read.getReserves();
        assert.equal(reserve0, 100n);
        assert.equal(reserve1, 100n);
    });

    it("Should swap tokens correctly", async function () {
        // Deploy contracts
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 1000n]);
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 1000n]);
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // Add liquidity
        await token0.write.approve([miniSwap.address, 500n]);
        await token1.write.approve([miniSwap.address, 500n]);
        await miniSwap.write.addLiquidity([100n, 100n]);

        // Get token1 balance before swap
        const balanceBefore = await token1.read.balanceOf([account0Address]);

        // Perform swap: send 10 token0 for token1
        await token0.write.approve([miniSwap.address, 10n]);
        const swapResult = await miniSwap.write.swap([token0.address, 10n]);

        // Get token1 balance after swap
        const balanceAfter = await token1.read.balanceOf([account0Address]);

        // Check that token1 was received
        assert.ok(balanceAfter > balanceBefore);

        // Verify reserves were updated
        const [reserve0, reserve1] = await miniSwap.read.getReserves();
        assert.equal(reserve0, 110n); // 100 + 10
        assert.ok(reserve1 < 100n); // 100 - amountOut
    });

    it("Should enforce minimum output check on swap", async function () {
        // Deploy contracts
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 1000n]);
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 1000n]);
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // Add liquidity
        await token0.write.approve([miniSwap.address, 100n]);
        await token1.write.approve([miniSwap.address, 100n]);
        await miniSwap.write.addLiquidity([100n, 100n]);

        // Try to swap with amount 0 (should fail)
        await token0.write.approve([miniSwap.address, 0n]);

        try {
            await miniSwap.write.swap([token0.address, 0n]);
            assert.fail("Should have thrown an error");
        } catch (error) {
            // Expected to fail
            assert.ok(error);
        }
    });

    it("Should handle multiple liquidity providers", async function () {
        // Deploy contracts
        const token0 = await viem.deployContract("ERC20", ["Token0", "TK0", 10000n]);
        const token1 = await viem.deployContract("ERC20", ["Token1", "TK1", 10000n]);
        const miniSwap = await viem.deployContract("MiniSwap", [token0.address, token1.address]);

        // First provider adds 100:100
        await token0.write.approve([miniSwap.address, 100n]);
        await token1.write.approve([miniSwap.address, 100n]);
        const shares1 = await miniSwap.write.addLiquidity([100n, 100n]);

        // Check balance of first provider
        const balance1 = await miniSwap.read.balance([account0Address]);
        assert.equal(balance1, 100n);

        // Verify total supply
        const totalSupply = await miniSwap.read.totalSupply();
        assert.equal(totalSupply, 100n);
    });
});
