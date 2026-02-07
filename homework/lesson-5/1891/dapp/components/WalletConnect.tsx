"use client";

import { useEffect, useState } from "react";
import { polkadotTestnet } from "../utils/viem";

export default function WalletConnect({
  onConnect,
}: {
  onConnect: (account: string | null) => void;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      if (!window.ethereum) return;
      const accounts = (await window.ethereum.request({
        method: "eth_accounts",
      })) as string[];

      if (accounts.length) {
        setAccount(accounts[0]);
        onConnect(accounts[0]);
      }

      const chainIdHex = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;
      setChainId(parseInt(chainIdHex, 16));
    };

    check().catch(() => {});

    if (!window.ethereum) return;

    const onAccountsChanged = (accounts: string[]) => {
      const next = accounts[0] || null;
      setAccount(next);
      onConnect(next);
    };

    const onChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", onAccountsChanged);
      window.ethereum?.removeListener("chainChanged", onChainChanged);
    };
  }, [onConnect]);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${polkadotTestnet.id.toString(16)}` }],
      });
    } catch (err: any) {
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${polkadotTestnet.id.toString(16)}`,
              chainName: polkadotTestnet.name,
              rpcUrls: [polkadotTestnet.rpcUrls.default.http[0]],
              nativeCurrency: polkadotTestnet.nativeCurrency,
            },
          ],
        });
      } else {
        throw err;
      }
    }
  };

  const connect = async () => {
    setError(null);
    if (!window.ethereum) {
      setError("未检测到 MetaMask");
      return;
    }

    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    const next = accounts[0] || null;
    setAccount(next);
    onConnect(next);

    const chainIdHex = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string;
    const current = parseInt(chainIdHex, 16);
    setChainId(current);

    if (current !== polkadotTestnet.id) {
      await switchNetwork();
    }
  };

  return (
    <div style={{ border: "1px solid #e11d48", borderRadius: 12, padding: 12, width: 420 }}>
      {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

      {!account ? (
        <button onClick={connect} style={{ width: "100%" }}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontFamily: "monospace" }}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
          {chainId !== polkadotTestnet.id && (
            <button onClick={switchNetwork}>Switch Network</button>
          )}
        </div>
      )}
    </div>
  );
}
