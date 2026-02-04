# Polkadot Hub TestNet 快速参考

## 🌍 网络信息

```
网络名称:  Polkadot Hub TestNet
RPC URL:   https://eth-rpc-testnet.polkadot.io/
Chain ID:  420420417
货币:      PAS (Paseo)
浏览器:    https://blockscout-testnet.polkadot.io/
```

---

## 🚀 快速开始

### 1️⃣ 获取测试代币 (3-5 分钟)
- 访问: https://faucet.polkadot.io/
- 选择: Polkadot Hub TestNet
- 输入你的地址
- 点击: "Get Some PASs"

### 2️⃣ 配置环境 (1 分钟)
```bash
cp .env.example .env
# 编辑 .env，填入私钥
# POLKADOT_TESTNET_PRIVATE_KEY=your_key_here
```

### 3️⃣ 部署合约 (2-5 分钟)
```bash
pnpm compile
pnpm hardhat ignition deploy ignition/modules/MiniSwap.ts --network polkadotTestnet
```

### 4️⃣ 更新前端 (1 分钟)
```bash
# 编辑 ui/src/constants.ts
# 复制部署的合约地址
# MiniSwap_ADDRESS = "0x..."
# Token0_ADDRESS = "0x..."
# Token1_ADDRESS = "0x..."
```

### 5️⃣ 启动 UI (30 秒)
```bash
cd ui
npm run dev
# 访问: http://localhost:5173
```

---

## 📋 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm compile` | 编译合约 |
| `pnpm test` | 本地测试 |
| `pnpm hardhat ignition deploy ignition/modules/MiniSwap.ts --network polkadotTestnet` | 部署到 Polkadot |
| `cd ui && npm run dev` | 启动前端开发服务器 |
| `cd ui && npm run build` | 构建生产版本 |

---

## 🔗 重要链接

| 资源 | 链接 |
|------|------|
| 水龙头 (获取 PAS) | https://faucet.polkadot.io/ |
| 区块浏览器 | https://blockscout-testnet.polkadot.io/ |
| Polkadot Wiki | https://wiki.polkadot.network/ |
| Hardhat 文档 | https://hardhat.org/ |

---

## ✅ 检查清单

### 部署前
- [ ] 获取了 PAS 测试代币（至少 0.1）
- [ ] 配置了 .env 文件
- [ ] 私钥安全保存

### 部署中
- [ ] 编译成功
- [ ] 部署成功
- [ ] 记录了合约地址

### 部署后
- [ ] 更新了 constants.ts
- [ ] 前端启动成功
- [ ] MetaMask 连接正确

---

## 🧪 测试流程 (5-10 分钟)

1. ✅ 连接钱包 (MetaMask)
2. ✅ 添加流动性 (Token0: 10, Token1: 10)
3. ✅ 执行交换 (Token0 → Token1: 2)
4. ✅ 反向交换 (Token1 → Token0: 1)
5. ✅ 移除流动性 (LP: 5)

---

## 🐛 快速排查

| 问题 | 解决方案 |
|------|--------|
| 部署失败 - insufficient funds | 从水龙头获取更多 PAS |
| 部署失败 - invalid private key | 检查 .env 文件中的私钥格式 |
| 连接失败 - Wrong network | 手动在 MetaMask 中添加网络 |
| 交换失败 - Insufficient liquidity | 先添加流动性 |
| 地址无效 - No code at that address | 检查 constants.ts 中的地址 |

---

## 📱 MetaMask 配置

```
网络名称:     Polkadot Hub TestNet
RPC URL:      https://eth-rpc-testnet.polkadot.io/
链 ID:        420420417
货币符号:     PAS
区块浏览器:   https://blockscout-testnet.polkadot.io/
```

---

## 💡 有用的 Tips

### 查看账户余额
```bash
pnpm hardhat accounts --network polkadotTestnet
```

### 查看合约 ABI
```bash
cat artifacts/contracts/MiniSwap.sol/MiniSwap.json | jq '.abi'
```

### 获取交易详情
在 Blockscout 上输入交易哈希

### 监控 Gas 费用
```
Gas Used × Gas Price = 总费用
例: 150,000 × 1 gwei = 0.00015 PAS
```

---

## 🔐 安全提示

⚠️ **不要:**
- 分享你的私钥
- 将 .env 提交到 Git
- 在公共地方暴露私钥

✅ **请:**
- 定期检查 .env 权限
- 使用测试账户和测试网
- 进行安全审计后再上主网

---

## 📞 需要帮助？

- 查看 [POLKADOT_DEPLOYMENT.md](./POLKADOT_DEPLOYMENT.md) 详细指南
- 访问 Polkadot Wiki: https://wiki.polkadot.network/
- 检查区块浏览器: https://blockscout-testnet.polkadot.io/

---

**状态**: ✅ 已准备好部署到 Polkadot Hub TestNet

祝你部署顺利! 🚀
