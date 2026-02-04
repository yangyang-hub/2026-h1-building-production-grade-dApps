# MiniSwap 部署到 Polkadot Hub TestNet 指南

## 📌 Polkadot Hub TestNet 网络信息

| 信息 | 值 |
|------|-----|
| **网络名称** | Polkadot Hub TestNet |
| **RPC URL** | https://eth-rpc-testnet.polkadot.io/ |
| **链 ID** | 420420417 |
| **货币符号** | PAS |
| **区块浏览器** | https://blockscout-testnet.polkadot.io/ |

---

## 🚀 部署步骤

### 第 1 步：获取 PAS 测试网代币

1. 访问 [Polkadot Faucet](https://faucet.polkadot.io/)
2. 选择网络：**Polkadot Hub TestNet**
3. 输入你的账户地址
4. 点击 "Get Some PASs" 获取测试代币
5. 等待代币到账（通常几分钟）

**获取地址:**
- 在 MetaMask 中复制你的账户地址
- 确保地址是有效的以太坊格式（0x开头）

### 第 2 步：配置环境变量

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的私钥：
```bash
POLKADOT_TESTNET_PRIVATE_KEY=your_private_key_here
POLKADOT_TESTNET_RPC_URL=https://eth-rpc-testnet.polkadot.io/
```

**⚠️ 安全警告:**
- 不要将 `.env` 文件提交到 Git
- 不要分享你的私钥
- `.env` 文件已添加到 `.gitignore`

### 第 3 步：编译智能合约

```bash
pnpm compile
```

**预期输出:**
```
Compiled 3 Solidity files successfully
```

### 第 4 步：部署合约到 Polkadot TestNet

```bash
pnpm hardhat ignition deploy ignition/modules/MiniSwap.ts --network polkadotTestnet
```

**预期输出:**
```
Deploying [ MiniSwapModule ]

Batch #1
  Executed MiniSwapModule#Token0
  Executed MiniSwapModule#Token1

Batch #2
  Executed MiniSwapModule#MiniSwap

[ MiniSwapModule ] successfully deployed 🚀

Deployed Addresses

MiniSwapModule#Token0 - 0x...
MiniSwapModule#Token1 - 0x...
MiniSwapModule#MiniSwap - 0x...
```

### 第 5 步：更新 UI 配置

1. 打开 `ui/src/constants.ts`
2. 找到合约地址部分
3. 用部署输出的地址替换：

```typescript
export const MiniSwap_ADDRESS = "0x...";      // 从部署输出复制
export const Token0_ADDRESS = "0x...";       // 从部署输出复制
export const Token1_ADDRESS = "0x...";       // 从部署输出复制
```

### 第 6 步：启动 React 前端

```bash
cd ui
npm install  # 如果需要
npm run dev
```

访问: `http://localhost:5173`

### 第 7 步：在 MetaMask 中配置网络

UI 会自动提示添加网络，或手动添加：

1. 打开 MetaMask
2. 点击网络选择器 → "Add Network"
3. 填入以下信息：
   - **网络名称**: Polkadot Hub TestNet
   - **RPC URL**: https://eth-rpc-testnet.polkadot.io/
   - **链 ID**: 420420417
   - **货币符号**: PAS
   - **区块浏览器**: https://blockscout-testnet.polkadot.io/

4. 点击 "Save"

---

## 🧪 测试合约

### 运行测试套件

```bash
# 在本地 Hardhat 网络上运行测试（可选）
pnpm test

# 预期输出：
# MiniSwap
#   ✔ Should deploy MiniSwap with two ERC20 tokens
#   ✔ Should add liquidity to the pool
#   ✔ Should remove liquidity from the pool
#   ✔ Should swap tokens correctly
#   ✔ Should enforce minimum output check on swap
#   ✔ Should handle multiple liquidity providers
#
# 6 passing
```

### 在区块浏览器上验证

1. 访问 [Polkadot Blockscout](https://blockscout-testnet.polkadot.io/)
2. 输入合约地址
3. 查看合约详情、交易历史

---

## 🔄 使用 UI 进行测试

### 测试 1: 连接钱包

1. 打开 `http://localhost:5173`
2. 点击 "Connect to Polkadot"
3. MetaMask 会提示添加网络和连接账户
4. 确认连接
5. **预期**: 显示账户地址和 "✓ Connected"

### 测试 2: 添加流动性

1. 在 Liquidity Management 卡片中
2. 在 "Add Liquidity" 标签页
3. 输入 Token0: `10`
4. 输入 Token1: `10`
5. 点击 "Add Liquidity"
6. 在 MetaMask 中确认交易

**预期:**
- 显示 "✅ Liquidity added successfully!"
- 池信息更新显示准备金和 LP 余额

### 测试 3: 执行交换

1. 在 Swap Tokens 卡片中
2. 选择交易对：Token0 → Token1
3. 输入数量：`2`
4. 查看估算输出
5. 点击 "Swap"

**预期:**
- 显示 "✅ Swap successful!"
- 池信息中准备金更新

### 测试 4: 移除流动性

1. 在 Liquidity Management → Remove Liquidity
2. 输入要移除的 LP 份额
3. 点击 "Remove Liquidity"

**预期:**
- 显示 "✅ Liquidity removed successfully!"
- 收回代币到钱包

---

## 📊 查看交易

### 在区块浏览器上查看

1. 访问 [Blockscout](https://blockscout-testnet.polkadot.io/)
2. 输入你的地址或交易哈希
3. 查看交易详情

### 在 MetaMask 中查看

1. 打开 MetaMask
2. 点击 "Activity" 标签
3. 查看交易历史
4. 点击交易查看详情

---

## 🐛 常见问题排查

### 问题 1：部署失败 - "insufficient funds"

```
Error: insufficient funds for gas * price + value
```

**解决:**
- 确保账户有足够的 PAS 代币（至少 0.1 PAS）
- 从 [Polkadot Faucet](https://faucet.polkadot.io/) 获取更多代币

### 问题 2：部署失败 - "invalid private key"

```
Error: Invalid private key
```

**解决:**
- 确保 `.env` 文件中私钥格式正确
- 私钥应该是 64 个十六进制字符（不带 0x 前缀）
- 检查文件编码是否为 UTF-8

### 问题 3：UI 连接失败

```
Error: Wrong network. Please switch to Polkadot Hub TestNet
```

**解决:**
- UI 会自动提示添加网络
- 在 MetaMask 中手动切换到 Polkadot Hub TestNet
- 刷新页面

### 问题 4：合约地址无效

```
Error: No code at that address
```

**解决:**
- 确保合约地址是部署输出的正确地址
- 检查 `constants.ts` 中的地址是否正确
- 地址应该以 "0x" 开头

### 问题 5：交换失败 - Insufficient liquidity

```
Error: Insufficient output
```

**解决:**
- 池中没有足够的流动性
- 先添加流动性再进行交换
- 或者减少交换金额

---

## 📈 性能监控

### 查看 Gas 使用情况

在 Blockscout 上查看交易：
1. 交易的 "Gas Used" 字段
2. "Gas Price" 字段
3. 总成本 = Gas Used × Gas Price

### 估算交易费用

```
Gas Used: ~150,000
Gas Price: ~1 gwei
Total Cost: 0.00015 PAS
```

---

## 🔐 安全建议

1. **私钥管理**
   - 不要在代码中硬编码私钥
   - 使用 `.env` 文件存储
   - 定期轮换测试账户

2. **合约验证**
   - 在 Blockscout 上验证合约代码
   - 查看合约源代码是否正确

3. **测试网使用**
   - 只在测试网上测试
   - 生产环境前进行安全审计
   - 不要在测试网泄露生产私钥

---

## ✅ 完整检查清单

- [ ] 从 Faucet 获取 PAS 测试代币
- [ ] 配置 `.env` 文件
- [ ] 编译合约 (`pnpm compile`)
- [ ] 部署合约 (`pnpm hardhat ignition deploy ... --network polkadotTestnet`)
- [ ] 记录部署的合约地址
- [ ] 更新 `ui/src/constants.ts`
- [ ] 启动 React 应用 (`npm run dev`)
- [ ] 在 MetaMask 中配置 Polkadot 网络
- [ ] 测试钱包连接
- [ ] 测试添加流动性
- [ ] 测试交换功能
- [ ] 测试移除流动性
- [ ] 在 Blockscout 上验证合约

---

## 📞 获取帮助

### 问题排查资源

1. **Polkadot 官方文档**: https://wiki.polkadot.network/
2. **区块浏览器**: https://blockscout-testnet.polkadot.io/
3. **水龙头**: https://faucet.polkadot.io/
4. **Hardhat 文档**: https://hardhat.org/
5. **Ethers.js 文档**: https://docs.ethers.org/

### 常用命令

```bash
# 查看 Hardhat 网络配置
pnpm hardhat networks

# 查看合约编译情况
pnpm hardhat compile

# 运行测试
pnpm hardhat test

# 查看账户余额
pnpm hardhat accounts --network polkadotTestnet

# 清理构建文件
pnpm hardhat clean
```

---

祝部署顺利! 🚀
