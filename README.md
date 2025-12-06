# 🎵 AI Music Generator

一个结合动态粒子效果的AI音乐生成器，为编程、专注和创造力提供沉浸式背景音乐体验。

## 🚀 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 6
- **语言**: TypeScript
- **包管理器**: pnpm
- **代码质量**: ESLint

## 📦 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装和运行

```bash
# 克隆项目
git clone <repository-url>
cd 2025-Cursor-hackthon

# 安装依赖
pnpm install

# 配置环境变量 (可选，用于背景音乐功能)
cp .env.example .env
# 编辑 .env 文件，添加你的 ElevenLabs API 密钥

# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

### 获取ElevenLabs API密钥

为了体验AI音乐生成功能，你需要配置ElevenLabs API密钥：

1. 访问 [elevenlabs.io](https://elevenlabs.io/) 注册账户
2. 进入设置页面获取API密钥
3. 将密钥添加到 `.env` 文件中：
   ```
   VITE_ELEVENLABS_API_KEY=你的实际API密钥
   ```

### 其他命令

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码质量检查
pnpm lint
```

## ✨ 特色功能

- 🤖 **AI音乐生成** - 使用ElevenLabs API生成独特的环境音乐
- 🎨 **动态粒子效果** - 响应音乐播放的实时粒子动画
- 🔄 **自动循环播放** - 每30秒生成新的音乐片段
- 🎭 **10种音乐风格** - 从lo-fi到环境电子音乐的多样选择
- 📱 **响应式设计** - 适配各种设备尺寸
- ⚡ **快速开发体验** - Vite构建工具提供秒级热重载
- 🛡️ **TypeScript类型安全** - 完整的类型检查和智能提示

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── BackgroundMusic.tsx    # AI音乐生成器组件
│   └── ParticleBackground.tsx # 动态粒子背景组件
├── hooks/               # 自定义Hooks
├── utils/               # 工具函数
├── types/               # TypeScript类型定义
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
├── App.css             # 应用样式
└── index.css           # 全局样式

docs/                   # 项目文档
├── Solution.md         # 解决方案说明
├── Features.md         # 功能特性
├── Plan.md            # 开发计划
├── Changes.md         # 更新日志
└── Deploy.md          # 部署指南
```

## 📚 文档

详细文档请查看 [docs/](docs/) 目录：

- [解决方案](docs/Solution.md)
- [功能特性](docs/Features.md)
- [开发计划](docs/Plan.md)
- [部署指南](docs/Deploy.md)
- [更新日志](docs/Changes.md)

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件