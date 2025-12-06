#!/bin/bash

# Love's Legacy - Vercel 部署脚本
# 此脚本帮助您快速部署 Love's Legacy 到 Vercel

echo "💖 Love's Legacy - Vercel 部署助手"
echo "=================================="

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装。请先安装："
    echo "npm install -g vercel"
    echo "或"
    echo "pnpm add -g vercel"
    exit 1
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 您需要登录 Vercel 账户："
    vercel login
fi

echo "📁 切换到前端目录..."
cd love-legacy

echo "🚀 开始部署到 Vercel..."
echo "提示：请按照提示进行以下配置："
echo "  - 项目名称：love-legacy (或您喜欢的名称)"
echo "  - 代码目录：./ (保持默认)"
echo "  - 构建命令：npm run build"
echo "  - 输出目录：dist"
echo "  - 是否覆盖设置：N (如果已配置)"

# 部署到 Vercel
vercel --prod

echo ""
echo "✅ 部署完成！"
echo "💡 接下来："
echo "  1. 在 Vercel 控制台添加 ELEVENLABS_API_KEY 环境变量"
echo "  2. 访问生成的 URL 测试应用"
echo "  3. 查看 love-legacy/VERCEL_DEPLOY.md 获取详细说明"

echo ""
echo "🔗 常用命令："
echo "  vercel env add ELEVENLABS_API_KEY  # 添加环境变量"
echo "  vercel logs                      # 查看日志"
echo "  vercel domains                   # 管理域名"
