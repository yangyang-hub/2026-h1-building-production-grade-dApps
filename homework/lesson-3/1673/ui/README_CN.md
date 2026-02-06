# MiniSwap UI - React 前端实现

这是 MiniSwap DEX 的完整 React 前端实现，已与 Smart Contract 完全对接。

## 功能特性

### 🔗 钱包连接
- MetaMask 钱包集成
- 支持连接/断开钱包
- 显示账户地址和连接状态

### 💱 代币交换 (Swap)
- 支持 Token0 ↔ Token1 交换
- 自动价格估算
- 实时准备金查看
- 自动 Token 授权管理

**工作流程:**
1. 选择交易对 (Token0 → Token1 或 Token1 → Token0)
2. 输入交换数量
3. 查看估算输出
4. 点击"Swap"执行交换
5. 系统自动处理 Token 授权并执行交换

### 💧 流动性管理 (Liquidity)
- **添加流动性**: 向池子提供等额比例的 Token0 和 Token1
- **移除流动性**: 使用 LP 凭证提取代币和收益
- 实时池信息显示
  - Token0 准备金
  - Token1 准备金
  - 用户的 LP 余额

**工作流程 - 添加流动性:**
1. 输入 Token0 和 Token1 数量
2. 点击"Add Liquidity"
3. 系统自动授权两个 Token
4. 执行添加流动性交易
5. 获得相应的 LP 凭证

**工作流程 - 移除流动性:**
1. 输入要移除的 LP 凭证数量
2. 点击"Remove Liquidity"
3. 系统执行移除流动性交易
4. 收回相应的 Token0 和 Token1

## 项目结构

```
ui/
├── src/
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 应用样式
│   ├── constants.ts         # 合约地址和 ABI
│   ├── components/
│   │   ├── ConnectWallet.tsx    # 钱包连接组件
│   │   ├── Swap.tsx             # 交换组件
│   │   └── Liquidity.tsx        # 流动性管理组件
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 合约地址配置

在 `src/constants.ts` 中配置合约地址：

```typescript
export const MiniSwap_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
export const Token0_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const Token1_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
```

## 核心技术栈

- **React 19.2.0** - UI 框架
- **TypeScript** - 类型安全
- **Ethers.js 6.16.0** - Web3 交互库
- **Vite** - 构建工具

## 使用方式

### 安装依赖

```bash
cd ui
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

## 与合约的交互说明

### ConnectWallet 组件
- 连接 MetaMask 钱包
- 获取用户账户和 Provider
- 返回账户地址和 ethers.BrowserProvider 对象

### Swap 组件
调用合约的 `swap()` 函数：
```typescript
const tx = await miniswapContract.swap(tokenIn, amountInWei);
```

关键步骤：
1. 检查并批准 Token 授权
2. 调用 swap 函数
3. 等待交易确认
4. 更新 UI 显示结果

### Liquidity 组件
**添加流动性:**
```typescript
// 授权两个 Token
await token0Contract.approve(MiniSwap_ADDRESS, amount0Wei);
await token1Contract.approve(MiniSwap_ADDRESS, amount1Wei);
// 调用 addLiquidity
const tx = await miniswapContract.addLiquidity(amount0Wei, amount1Wei);
```

**移除流动性:**
```typescript
const tx = await miniswapContract.removeLiquidity(sharesWei);
```

## 错误处理

应用包含完整的错误处理机制：
- 输入验证
- 合约调用失败捕获
- 用户友好的错误消息
- 交易状态实时更新

## 样式特点

- 现代化深色主题
- 渐变色设计
- 响应式布局
- 平滑动画和过渡效果
- 绿色和青色的品牌色 (#00ff88, #00ccff)

## 注意事项

1. **网络配置**: 确保 MetaMask 连接到正确的网络（Hardhat 本地网络或测试网络）
2. **Token 授权**: 首次交换或添加流动性时，需要授权 Token 使用权
3. **准备金**: 交换金额不能超过池的现有准备金
4. **浮点精度**: 所有金额使用 Wei 单位（10^18）进行计算

## 开发调试

### 查看合约事件
在浏览器控制台可以看到：
- 交易哈希
- Gas 使用情况
- 交易状态

### 常见问题

**Q: 为什么交换失败？**
A: 检查以下几点：
- MetaMask 已连接到正确的网络
- 账户有足够的 Token 余额
- Token 已授权给 MiniSwap 合约
- 交换金额大于 0

**Q: 流动性为什么显示为 0？**
A: 
- 检查账户是否添加过流动性
- 刷新页面重新加载数据
- 检查合约地址是否正确

## 部署到测试网

1. 在测试网上部署合约
2. 更新 `constants.ts` 中的合约地址
3. 在 MetaMask 中添加测试网络
4. 获取测试网 Token
5. 部署 UI：`npm run build && npm run preview`

## License

MIT
