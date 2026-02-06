import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MiniSwap_ADDRESS, MiniSwap_ABI, ERC20_ABI, Token0_ADDRESS, Token1_ADDRESS } from "../constants";

interface LiquidityProps {
    provider: ethers.BrowserProvider;
    account: string;
}

export const Liquidity = ({ provider, account }: LiquidityProps) => {
    const [mode, setMode] = useState<"add" | "remove">("add");
    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");
    const [shares, setShares] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [poolInfo, setPoolInfo] = useState({ reserve0: "0", reserve1: "0", lpBalance: "0" });

    // Fetch pool information
    const fetchPoolInfo = async () => {
        try {
            const miniswapContract = new ethers.Contract(MiniSwap_ADDRESS, MiniSwap_ABI, provider);
            const [reserve0, reserve1] = await miniswapContract.getReserves();
            const balance = await miniswapContract.balance(account);
            const totalSupply = await miniswapContract.totalSupply();

            setPoolInfo({
                reserve0: ethers.formatEther(reserve0),
                reserve1: ethers.formatEther(reserve1),
                lpBalance: ethers.formatEther(balance),
            });
        } catch (err) {
            console.error("Failed to fetch pool info:", err);
        }
    };

    useEffect(() => {
        fetchPoolInfo();
        const interval = setInterval(fetchPoolInfo, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, [account]);

    const handleAddLiquidity = async () => {
        setStatus("");
        if (!amount0 || !amount1 || parseFloat(amount0) <= 0 || parseFloat(amount1) <= 0) {
            setStatus("Please enter valid amounts");
            return;
        }

        setLoading(true);
        try {
            const signer = await provider.getSigner();
            const miniswapContract = new ethers.Contract(MiniSwap_ADDRESS, MiniSwap_ABI, signer);
            const token0Contract = new ethers.Contract(Token0_ADDRESS, ERC20_ABI, signer);
            const token1Contract = new ethers.Contract(Token1_ADDRESS, ERC20_ABI, signer);

            const amount0Wei = ethers.parseEther(amount0);
            const amount1Wei = ethers.parseEther(amount1);

            // Approve Token0
            setStatus("Approving Token0...");
            const allowance0 = await token0Contract.allowance(account, MiniSwap_ADDRESS);
            if (allowance0 < amount0Wei) {
                const approveTx0 = await token0Contract.approve(MiniSwap_ADDRESS, amount0Wei);
                await approveTx0.wait();
            }

            // Approve Token1
            setStatus("Approving Token1...");
            const allowance1 = await token1Contract.allowance(account, MiniSwap_ADDRESS);
            if (allowance1 < amount1Wei) {
                const approveTx1 = await token1Contract.approve(MiniSwap_ADDRESS, amount1Wei);
                await approveTx1.wait();
            }

            // Add Liquidity
            setStatus("Adding liquidity...");
            const tx = await miniswapContract.addLiquidity(amount0Wei, amount1Wei);
            const receipt = await tx.wait();

            setStatus("✅ Liquidity added successfully!");
            setAmount0("");
            setAmount1("");
            setShares("");

            // Refresh pool info
            await fetchPoolInfo();
        } catch (err: any) {
            console.error(err);
            setStatus(`❌ Failed: ${err.message.split("\n")[0]}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveLiquidity = async () => {
        setStatus("");
        if (!shares || parseFloat(shares) <= 0) {
            setStatus("Please enter valid shares amount");
            return;
        }

        setLoading(true);
        try {
            const signer = await provider.getSigner();
            const miniswapContract = new ethers.Contract(MiniSwap_ADDRESS, MiniSwap_ABI, signer);

            const sharesWei = ethers.parseEther(shares);

            setStatus("Removing liquidity...");
            const tx = await miniswapContract.removeLiquidity(sharesWei);
            const receipt = await tx.wait();

            setStatus("✅ Liquidity removed successfully!");
            setShares("");
            setAmount0("");
            setAmount1("");

            // Refresh pool info
            await fetchPoolInfo();
        } catch (err: any) {
            console.error(err);
            setStatus(`❌ Failed: ${err.message.split("\n")[0]}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Liquidity Management</h2>

            {/* Pool Info */}
            <div className="pool-info">
                <h3>Pool Information</h3>
                <div className="info-row">
                    <span>Token0 Reserve:</span>
                    <strong>{poolInfo.reserve0}</strong>
                </div>
                <div className="info-row">
                    <span>Token1 Reserve:</span>
                    <strong>{poolInfo.reserve1}</strong>
                </div>
                <div className="info-row">
                    <span>Your LP Balance:</span>
                    <strong>{poolInfo.lpBalance}</strong>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={mode === "add" ? "active" : ""} onClick={() => setMode("add")} disabled={loading}>
                    Add Liquidity
                </button>
                <button className={mode === "remove" ? "active" : ""} onClick={() => setMode("remove")} disabled={loading}>
                    Remove Liquidity
                </button>
            </div>

            {/* Add Liquidity Form */}
            {mode === "add" && (
                <>
                    <div className="input-group">
                        <label>Token0 Amount</label>
                        <input type="number" placeholder="0.0" value={amount0} onChange={(e) => setAmount0(e.target.value)} disabled={loading} />
                    </div>
                    <div className="input-group">
                        <label>Token1 Amount</label>
                        <input type="number" placeholder="0.0" value={amount1} onChange={(e) => setAmount1(e.target.value)} disabled={loading} />
                    </div>
                    <button onClick={handleAddLiquidity} disabled={loading || !amount0 || !amount1}>
                        {loading ? "Processing..." : "Add Liquidity"}
                    </button>
                </>
            )}

            {/* Remove Liquidity Form */}
            {mode === "remove" && (
                <>
                    <div className="input-group">
                        <label>LP Shares to Remove</label>
                        <input type="number" placeholder="0.0" value={shares} onChange={(e) => setShares(e.target.value)} disabled={loading} />
                        <small>Available: {poolInfo.lpBalance}</small>
                    </div>
                    <button onClick={handleRemoveLiquidity} disabled={loading || !shares}>
                        {loading ? "Processing..." : "Remove Liquidity"}
                    </button>
                </>
            )}

            {/* Status Message */}
            {status && <p className={`status-msg ${status.includes("✅") ? "success" : status.includes("❌") ? "error" : ""}`}>{status}</p>}
        </div>
    );
};
