import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { ConnectWallet } from "./components/ConnectWallet";
import { NETWORK_CONFIG } from "./constants";

// Components
import { Swap } from "./components/Swap";
import { Liquidity } from "./components/Liquidity";

function App() {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    const handleConnect = (connectedAccount: string, connectedProvider: ethers.BrowserProvider) => {
        setAccount(connectedAccount);
        setProvider(connectedProvider);
    };

    const handleDisconnect = () => {
        setAccount(null);
        setProvider(null);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>🔄 MiniSwap DEX</h1>
                        <span className="network-badge">{NETWORK_CONFIG.name}</span>
                    </div>
                    <div className="header-right">
                        {account ? (
                            <div className="account-info">
                                <div className="account-display">
                                    <span className="connected-badge">✓ Connected</span>
                                    <span className="account-address">
                                        {account.slice(0, 6)}...{account.slice(-4)}
                                    </span>
                                </div>
                                <button onClick={handleDisconnect} className="disconnect-btn">
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <ConnectWallet onConnect={handleConnect} />
                        )}
                    </div>
                </div>
            </header>

            <main>
                {account && provider ? (
                    <div className="dashboard">
                        <div className="dashboard-container">
                            <Swap provider={provider} account={account} />
                            <Liquidity provider={provider} account={account} />
                        </div>
                    </div>
                ) : (
                    <div className="welcome-section">
                        <div className="welcome-content">
                            <h2>Welcome to MiniSwap</h2>
                            <p className="welcome-msg">Please connect your wallet to start trading and providing liquidity.</p>
                            <div className="features">
                                <div className="feature-item">
                                    <span className="feature-icon">💱</span>
                                    <span>Swap Tokens</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">💧</span>
                                    <span>Add/Remove Liquidity</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">⚡</span>
                                    <span>Instant Settlement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <footer className="app-footer">
                <p>MiniSwap - A Simple AMM DEX | Powered by Smart Contracts</p>
            </footer>
        </div>
    );
}

export default App;
