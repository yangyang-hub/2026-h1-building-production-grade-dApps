import { createPublicClient, formatEther, http, getAddress } from "viem";
import { hdKeyToAccount, privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import * as path from "path";

// 读取 .env 文件
function loadEnv() {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) {
        throw new Error("❌ 未找到 .env 文件");
    }

    const envContent = fs.readFileSync(envPath, "utf-8");
    const env: Record<string, string> = {};

    envContent.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
            const [key, ...valueParts] = trimmed.split("=");
            if (key) {
                env[key.trim()] = valueParts
                    .join("=")
                    .trim()
                    .replace(/^["']|["']$/g, "");
            }
        }
    });

    return env;
}

// Polkadot Hub TestNet 配置
const POLKADOT_TESTNET_RPC = "https://eth-rpc-testnet.polkadot.io/";
const POLKADOT_CHAIN_ID = 420420417;

/**
 * 根据私钥获取地址
 * @param privateKey 私钥 (Hex格式，以0x开头)
 * @returns 返回对应的钱包地址
 */
function getAddressFromPrivateKey(privateKey: string): string {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    return account.address;
}

async function checkBalance() {
    try {
        console.log("🔍 检查 Polkadot Hub TestNet 余额");
        console.log("================================\n");

        // 加载环境变量
        const env = loadEnv();
        const privateKey = env.POLKADOT_TESTNET_PRIVATE_KEY;

        if (!privateKey) {
            console.error("❌ 错误: .env 文件中未找到 POLKADOT_TESTNET_PRIVATE_KEY");
            process.exit(1);
        }

        if (privateKey === "your_private_key_here" || !privateKey.startsWith("0x")) {
            console.error("❌ 错误: 请在 .env 中填入有效的私钥 (格式: 0x...)");
            process.exit(1);
        }

        // 创建公共客户端
        const publicClient = createPublicClient({
            chain: {
                id: POLKADOT_CHAIN_ID,
                name: "Polkadot Hub TestNet",
                network: "polkadot-testnet",
                nativeCurrency: {
                    decimals: 18,
                    name: "Paseo",
                    symbol: "PAS",
                },
                rpcUrls: {
                    default: {
                        http: [POLKADOT_TESTNET_RPC],
                    },
                },
                blockExplorers: {
                    default: {
                        name: "Blockscout",
                        url: "https://blockscout-testnet.polkadot.io/",
                    },
                },
            },
            transport: http(POLKADOT_TESTNET_RPC),
        });

        // 从私钥创建账户地址
        const privateKeyHex = `0x${privateKey.replace("0x", "")}` as `0x${string}`;
        // 简单的方法：直接使用 getAddress 验证格式
        const accountAddress = getAddressFromPrivateKey(privateKey) as `0x${string}`;

        console.log("📋 账户信息:");
        console.log(`   地址: ${accountAddress}`);
        console.log(`   网络: Polkadot Hub TestNet`);
        console.log(`   RPC: ${POLKADOT_TESTNET_RPC}`);
        console.log(`   Chain ID: ${POLKADOT_CHAIN_ID}\n`);

        // 获取余额
        console.log("⏳ 正在查询余额...\n");
        const balanceWei = await publicClient.getBalance({
            address: accountAddress,
        });

        // 转换为 PAS (ETH 单位)
        const balancePAS = formatEther(balanceWei);

        console.log("💰 余额信息:");
        console.log(`   Wei: ${balanceWei.toString()}`);
        console.log(`   PAS: ${balancePAS} PAS`);
        console.log("");

        // 评估余额状态
        const balance = parseFloat(balancePAS);
        console.log("📊 余额分析:");
        if (balance === 0) {
            console.log("   ⚠️  余额为 0，请从水龙头获取 PAS 代币");
            console.log("   访问: https://faucet.polkadot.io/");
        } else if (balance < 0.01) {
            console.log("   ⚠️  余额不足 0.01 PAS，建议补充更多代币以支付 Gas 费用");
        } else if (balance < 0.1) {
            console.log("   ⚠️  余额足以部署，但建议保留备用");
        } else {
            console.log("   ✅ 余额充足，可以进行部署");
        }

        console.log("");

        // 估算 Gas 费用
        console.log("💡 参考信息:");
        console.log("   - MiniSwap 部署预计消耗: ~1.5M gas");
        console.log("   - 2 个 ERC20 代币部署预计消耗: ~600K gas 每个");
        console.log("   - 总预计消耗: ~2.7M gas");
        console.log("   - 当前 Gas Price: 1 gwei/gas (参考值)");
        console.log("   - 预计费用: ~0.0027 PAS\n");

        console.log("🔗 浏览器链接:");
        console.log(`   https://blockscout-testnet.polkadot.io/address/${accountAddress}`);
        console.log("");

        // 获取网络信息
        console.log("🌐 网络状态:");
        const blockNumber = await publicClient.getBlockNumber();
        console.log(`   最新区块: #${blockNumber}`);

        const gasPrice = await publicClient.getGasPrice();
        console.log(`   Gas Price: ${gasPrice} wei (~${(Number(gasPrice) / 1e9).toFixed(2)} gwei)`);

        console.log("\n✅ 查询完成");
    } catch (error) {
        console.error("❌ 出错了:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

checkBalance();
