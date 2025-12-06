# Vercel 部署指南

本指南将帮助您将 Love's Legacy 部署到 Vercel。

## 📋 前置要求

1. [Vercel 账户](https://vercel.com)
2. [GitHub 账户](https://github.com) (用于连接仓库)
3. ElevenLabs API 密钥 (可选，用于语音转文字功能)

## 🚀 部署步骤

### 步骤 1: 准备代码

确保您的代码已推送到 GitHub 仓库：

```bash
# 在项目根目录
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 步骤 2: 连接 Vercel

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 连接您的 GitHub 账户
4. 选择包含 Love's Legacy 的仓库

### 步骤 3: 配置项目

在 Vercel 项目设置中：

#### 基本配置
- **Framework Preset**: `Vite`
- **Root Directory**: `love-legacy` (重要！)
- **Build Command**: `npm run build` 或 `pnpm build`
- **Output Directory**: `dist`

#### 环境变量
添加以下环境变量（在项目设置 → Environment Variables）：

```
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NODE_ENV=production
```

### 步骤 4: 部署

1. 点击 "Deploy"
2. 等待构建完成
3. Vercel 会提供您的应用 URL

## 🔧 故障排除

### 构建失败
- 确保 Root Directory 设置为 `love-legacy`
- 检查是否所有依赖都在 `love-legacy/package.json` 中

### API 调用失败
- 确保环境变量已正确设置
- 检查 Vercel Functions 日志

### 语音功能不工作
- 确认 ElevenLabs API 密钥有效
- 检查是否升级到 Creator 计划

## 📁 项目结构

```
love-legacy/
├── api/                    # Vercel Functions
│   ├── health.js          # 健康检查 API
│   └── speech-to-text.js  # 语音转文字 API
├── src/                   # React 应用源码
├── public/                # 静态资源
├── vercel.json           # Vercel 配置
└── package.json          # 项目配置
```

## 🌐 访问应用

部署完成后，您将获得一个类似以下的 URL：
- **生产环境**: `https://your-project-name.vercel.app`
- **API 健康检查**: `https://your-project-name.vercel.app/api/health`

## 🔄 更新部署

每次推送代码到主分支，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Your update message"
git push origin main
```

## 💡 提示

- Vercel 提供免费的 Hobby 计划，包含 100GB 带宽
- 可以使用自定义域名
- 支持预览部署（从 Pull Request 自动创建）
