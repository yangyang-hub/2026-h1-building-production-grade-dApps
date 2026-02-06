import { useState } from "react";
import { ethers } from "ethers";
import { NETWORK_CONFIG } from "../constants";

interface ConnectWalletProps {
    onConnect: (account: string, provider: ethers.BrowserProvider) => void;
}

export const ConnectWallet = ({ onConnect }: ConnectWalletProps) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState("");

    const switchNetwork = async (provider: ethers.BrowserProvider) => {
        try {
            // 尝试切换到 Polkadot Hub TestNet
            await window.ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
            });
        } catch (switchError: any) {
            // 如果网络不存在，添加网络
            if (switchError.code === 4902) {
                try {
                    await window.ethereum?.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                                chainName: NETWORK_CONFIG.name,
                                rpcUrls: [NETWORK_CONFIG.rpcUrl],
                                blockExplorerUrls: [NETWORK_CONFIG.blockExplorer],
                                nativeCurrency: {
                                    name: "Paseo",
                                    symbol: NETWORK_CONFIG.currency,
                                    decimals: 18,
                                },
                            },
                        ],
                    });
                } catch (addError: any) {
                    throw new Error(`Failed to add network: ${addError.message}`);
                }
            } else {
                throw switchError;
            }
        }
    };

    const connect = async () => {
        setIsConnecting(true);
        setError("");

        if (typeof window.ethereum !== "undefined") {
            try {
                // 切换到 Polkadot Hub TestNet
                await switchNetwork(new ethers.BrowserProvider(window.ethereum));

                // 请求账户
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);

                if (accounts.length > 0) {
                    // 验证网络
                    const network = await provider.getNetwork();
                    if (network.chainId !== BigInt(NETWORK_CONFIG.chainId)) {
                        setError(`Wrong network. Please switch to ${NETWORK_CONFIG.name}`);
                        setIsConnecting(false);
                        return;
                    }

                    onConnect(accounts[0], provider);
                }
            } catch (err: any) {
                setError(err.message || "Failed to connect");
            } finally {
                setIsConnecting(false);
            }
        } else {
            setError("MetaMask is not installed");
            setIsConnecting(false);
        }
    };

    return (
        <div className="connect-wallet-container">
            <button onClick={connect} disabled={isConnecting} className="connect-btn">
                {isConnecting ? "Connecting..." : "Connect to Polkadot"}
            </button>
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};
