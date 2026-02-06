#!/bin/bash

# MiniSwap Polkadot 快速部署脚本
# Quick deployment script for MiniSwap to Polkadot Hub TestNet

echo "🚀 MiniSwap Polkadot 部署工具"
echo "================================"
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ 未找到 .env 文件"
    echo "📝 正在创建 .env 文件..."
    cp .env.example .env
    echo "✅ 已创建 .env.example"
    echo "⚠️ 请编辑 .env 文件，填入你的私钥:"
    echo "   POLKADOT_TESTNET_PRIVATE_KEY=your_private_key_here"
    exit 1
fi

# 检查私钥
if grep -q "your_private_key_here" .env; then
    echo "❌ 请在 .env 文件中填入实际的私钥"
    exit 1
fi

# 编译合约
echo ""
echo "📦 正在编译合约..."
pnpm compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

echo "✅ 编译成功"
echo ""

# 部署合约
echo "🌍 正在部署到 Polkadot Hub TestNet..."
echo "网络: https://eth-rpc-testnet.polkadot.io/"
echo ""

pnpm hardhat ignition deploy ignition/modules/MiniSwap.ts --network polkadotTestnet

if [ $? -ne 0 ]; then
    echo "❌ 部署失败"
    exit 1
fi

echo ""
echo "✅ 部署成功!"
echo ""
echo "📌 重要: 请保存上面输出的合约地址，并更新 ui/src/constants.ts"
echo ""
echo "下一步:"
echo "1. 复制输出的合约地址"
echo "2. 编辑 ui/src/constants.ts"
echo "3. 替换 MiniSwap_ADDRESS, Token0_ADDRESS, Token1_ADDRESS"
echo "4. 运行: cd ui && npm run dev"
echo ""
