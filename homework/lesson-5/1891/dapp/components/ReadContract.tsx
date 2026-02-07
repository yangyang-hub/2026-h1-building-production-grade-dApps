"use client";

import { useEffect, useState } from "react";
import { publicClient } from "../utils/viem";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/contract";

export default function ReadContract() {
  const [storedNumber, setStoredNumber] = useState<string>("-");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const number = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "storedNumber",
          args: [],
        })) as bigint;

        setStoredNumber(number.toString());
      } catch (e: any) {
        setError(e?.message || String(e));
      }
    };

    fetchData();
    const id = setInterval(fetchData, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ border: "1px solid #e11d48", borderRadius: 12, padding: 12, width: 420 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Contract Data</div>
      <div>storedNumber: {storedNumber}</div>
      {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
