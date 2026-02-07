"use client";

import { useState } from "react";
import { publicClient, getWalletClient } from "../utils/viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contract";

export default function WriteContract({ account }: { account: string | null }) {
  const [newNumber, setNewNumber] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const submit = async () => {
    if (!account) {
      setStatus("请先连接钱包");
      return;
    }
    if (!newNumber || isNaN(Number(newNumber))) {
      setStatus("请输入数字");
      return;
    }

    try {
      setStatus("准备交易...");
      const walletClient = await getWalletClient();

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "setNumber",
        args: [BigInt(newNumber)],
        account: walletClient.account,
      });

      setStatus("请在钱包确认...");
      const hash = await walletClient.writeContract(request);

      setStatus("等待链上确认...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setStatus(`成功: ${receipt.transactionHash}`);
      setNewNumber("");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  };

  return (
    <div style={{ border: "1px solid #e11d48", borderRadius: 12, padding: 12, width: 420 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Write Contract</div>
      <input
        style={{ width: "100%", padding: 8 }}
        placeholder="new number"
        value={newNumber}
        onChange={(e) => setNewNumber(e.target.value)}
        disabled={!account}
      />
      <button onClick={submit} style={{ marginTop: 8, width: "100%" }}>
        setNumber
      </button>
      {status && <div style={{ marginTop: 8, wordBreak: "break-all" }}>{status}</div>}
    </div>
  );
}
