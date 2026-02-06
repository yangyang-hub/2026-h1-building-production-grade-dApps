// Polkadot Hub TestNet Configuration
// 网络信息:
// - RPC URL: https://eth-rpc-testnet.polkadot.io/
// - Chain ID: 420420417
// - Currency: PAS
// - Block Explorer: https://blockscout-testnet.polkadot.io/

// 部署到 Polkadot 后，请更新以下地址为实际部署的合约地址
// 获取地址: 部署交易的日志输出

export const NETWORK_CONFIG = {
    name: "Polkadot Hub TestNet",
    chainId: 420420417,
    rpcUrl: "https://eth-rpc-testnet.polkadot.io/",
    currency: "PAS",
    blockExplorer: "https://blockscout-testnet.polkadot.io/",
};

// 合约地址（待部署后填入实际地址）
export const MiniSwap_ADDRESS = "0xDe2CD3019Fd321b7aAda31b43c6f46f616578c48"; // 部署 MiniSwap 后填入此地址

export const Token0_ADDRESS = "0xCD8AAd0d86f131b18e03C8B94B20c6aE667d5102"; // 部署 Token0 (ERC20) 后填入此地址
export const Token1_ADDRESS = "0x030a25a6555B21A965151c64b824731C41dcB70F"; // 部署 Token1 (ERC20) 后填入此地址

// 注意：这些地址是本地 Hardhat 网络的地址，不适用于 Polkadot
// 部署步骤：
// 1. pnpm hardhat compile
// 2. pnpm hardhat ignition deploy ignition/modules/MiniSwap.ts --network polkadotTestnet
// 3. 复制输出的合约地址到上面

export const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_spender", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_from", type: "address" },
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { name: "_owner", type: "address" },
            { name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        payable: true,
        stateMutability: "payable",
        type: "fallback",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "owner", type: "address" },
            { indexed: true, name: "spender", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "from", type: "address" },
            { indexed: true, name: "to", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
];

export const MiniSwap_ABI = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "addLiquidity",
        outputs: [
            {
                internalType: "uint256",
                name: "shares",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        name: "balance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getReserves",
        outputs: [
            {
                internalType: "uint256",
                name: "_reserve0",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_reserve1",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_shares",
                type: "uint256",
            },
        ],
        name: "removeLiquidity",
        outputs: [
            {
                internalType: "uint256",
                name: "amount0",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "amount1",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "reserve0",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "reserve1",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_tokenIn",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_amountIn",
                type: "uint256",
            },
        ],
        name: "swap",
        outputs: [
            {
                internalType: "uint256",
                name: "amountOut",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "token0",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token1",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
