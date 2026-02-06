import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { MiniSwap_ADDRESS, MiniSwap_ABI, ERC20_ABI, Token0_ADDRESS, Token1_ADDRESS } from "../constants";

interface SwapProps {
    provider: ethers.BrowserProvider;
    account: string;
}

export const Swap = ({ provider, account }: SwapProps) => {
    const [amountIn, setAmountIn] = useState("");
    const [amountOut, setAmountOut] = useState("");
    const [selectedToken, setSelectedToken] = useState("token0");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const tokenIn = selectedToken === "token0" ? Token0_ADDRESS : Token1_ADDRESS;
    const tokenOut = selectedToken === "token0" ? Token1_ADDRESS : Token0_ADDRESS;

    const handleSwap = async () => {
        setStatus("");
        if (!amountIn || parseFloat(amountIn) <= 0) {
            setStatus("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            const signer = await provider.getSigner();
            const miniswapContract = new ethers.Contract(MiniSwap_ADDRESS, MiniSwap_ABI, signer);
            const tokenInContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);

            const amountInWei = ethers.parseEther(amountIn);

            // Check allowance and approve if necessary
            setStatus("Checking allowance...");
            const allowance = await tokenInContract.allowance(account, MiniSwap_ADDRESS);
            if (allowance < amountInWei) {
                setStatus("Approving token...");
                const approveTx = await tokenInContract.approve(MiniSwap_ADDRESS, amountInWei);
                await approveTx.wait();
            }

            // Execute swap
            setStatus("Executing swap...");
            const swapTx = await miniswapContract.swap(tokenIn, amountInWei);
            const receipt = await swapTx.wait();

            setStatus("✅ Swap successful!");
            setAmountIn("");
            setAmountOut("");

            // Fetch reserves to show updated prices
            await fetchPriceInfo();
        } catch (err: any) {
            console.error(err);
            setStatus(`❌ Swap failed: ${err.message.split("\n")[0]}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchPriceInfo = async () => {
        try {
            const miniswapContract = new ethers.Contract(MiniSwap_ADDRESS, MiniSwap_ABI, provider);
            const [reserve0, reserve1] = await miniswapContract.getReserves();

            if (amountIn && parseFloat(amountIn) > 0) {
                const amountInWei = ethers.parseEther(amountIn);
                // Simple price calculation
                const price = (Number(reserve1) / Number(reserve0)).toFixed(6);
                const estimatedOut = ((parseFloat(amountIn) / parseFloat(ethers.formatEther(reserve0))) * parseFloat(ethers.formatEther(reserve1))).toFixed(6);
                setAmountOut(estimatedOut);
            }
        } catch (err) {
            console.error("Failed to fetch price:", err);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (amountIn) {
                fetchPriceInfo();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [amountIn, selectedToken]);

    return (
        <div className="card">
            <h2>Swap Tokens</h2>

            <div className="input-group">
                <label>Select Pair</label>
                <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
                    <option value="token0">Token0 → Token1</option>
                    <option value="token1">Token1 → Token0</option>
                </select>
            </div>

            <div className="input-group">
                <label>Amount In</label>
                <input type="number" placeholder="0.0" value={amountIn} onChange={(e) => setAmountIn(e.target.value)} disabled={loading} />
            </div>

            <div className="input-group">
                <label>Estimated Amount Out</label>
                <input type="text" placeholder="0.0" value={amountOut} disabled={true} style={{ opacity: 0.6 }} />
            </div>

            <button onClick={handleSwap} disabled={loading || !amountIn}>
                {loading ? "Processing..." : "Swap"}
            </button>

            {status && <p className={`status-msg ${status.includes("✅") ? "success" : status.includes("❌") ? "error" : ""}`}>{status}</p>}
        </div>
    );
};
