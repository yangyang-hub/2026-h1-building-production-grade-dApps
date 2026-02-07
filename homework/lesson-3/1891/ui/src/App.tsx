import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { ERC20_ABI, MiniSwap_ABI } from "./abi";

type Status = { type: "idle" | "ok" | "err"; message: string };

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [miniSwap, setMiniSwap] = useState<string>("");
  const [tokenA, setTokenA] = useState<string>("");
  const [tokenB, setTokenB] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const provider = useMemo(() => {
    if (!(window as any).ethereum) return null;
    return new ethers.BrowserProvider((window as any).ethereum);
  }, []);

  const connect = async () => {
    if (!provider) {
      setStatus({ type: "err", message: "未检测到 MetaMask" });
      return;
    }
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0] || "");
    setStatus({ type: "ok", message: "钱包已连接" });
  };

  const getSigner = async () => {
    if (!provider) throw new Error("MetaMask not found");
    return provider.getSigner();
  };

  const approveIfNeeded = async (token: string, spender: string, rawAmount: bigint) => {
    const signer = await getSigner();
    const erc20 = new ethers.Contract(token, ERC20_ABI, signer);
    const tx = await erc20.approve(spender, rawAmount);
    await tx.wait();
  };

  const addLiquidity = async () => {
    try {
      setStatus({ type: "idle", message: "" });
      const signer = await getSigner();
      const c = new ethers.Contract(miniSwap, MiniSwap_ABI, signer);
      const raw = ethers.parseUnits(amount, 18);
      await approveIfNeeded(tokenA, miniSwap, raw);
      await approveIfNeeded(tokenB, miniSwap, raw);
      const tx = await c.addLiquidity(tokenA, tokenB, raw);
      await tx.wait();
      setStatus({ type: "ok", message: "addLiquidity 成功" });
    } catch (e: any) {
      setStatus({ type: "err", message: e?.message || String(e) });
    }
  };

  const removeLiquidity = async () => {
    try {
      setStatus({ type: "idle", message: "" });
      const signer = await getSigner();
      const c = new ethers.Contract(miniSwap, MiniSwap_ABI, signer);
      const raw = ethers.parseUnits(amount, 18);
      const tx = await c.removeLiquidity(tokenA, tokenB, raw);
      await tx.wait();
      setStatus({ type: "ok", message: "removeLiquidity 成功" });
    } catch (e: any) {
      setStatus({ type: "err", message: e?.message || String(e) });
    }
  };

  const swap = async () => {
    try {
      setStatus({ type: "idle", message: "" });
      const signer = await getSigner();
      const c = new ethers.Contract(miniSwap, MiniSwap_ABI, signer);
      const raw = ethers.parseUnits(amount, 18);
      await approveIfNeeded(tokenA, miniSwap, raw);
      const tx = await c.swap(tokenA, tokenB, raw);
      await tx.wait();
      setStatus({ type: "ok", message: "swap 成功" });
    } catch (e: any) {
      setStatus({ type: "err", message: e?.message || String(e) });
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui" }}>
      <h2>MiniSwap (1891)</h2>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={connect}>连接 MetaMask</button>
        <div>Account: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "-"}</div>
      </div>

      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <label>
          MiniSwap 合约地址
          <input style={{ width: "100%" }} value={miniSwap} onChange={(e) => setMiniSwap(e.target.value)} placeholder="0x..." />
        </label>
        <label>
          TokenA 地址
          <input style={{ width: "100%" }} value={tokenA} onChange={(e) => setTokenA(e.target.value)} placeholder="0x..." />
        </label>
        <label>
          TokenB 地址
          <input style={{ width: "100%" }} value={tokenB} onChange={(e) => setTokenB(e.target.value)} placeholder="0x..." />
        </label>
        <label>
          Amount (按 18 decimals)
          <input style={{ width: "100%" }} value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={addLiquidity}>addLiquidity</button>
          <button onClick={removeLiquidity}>removeLiquidity</button>
          <button onClick={swap}>swap (A->B)</button>
        </div>

        {status.message && (
          <div style={{ padding: 12, border: "1px solid #ddd" }}>
            <b>{status.type.toUpperCase()}</b>: {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
