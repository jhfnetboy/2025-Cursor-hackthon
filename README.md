# Vite + React Demo

基于YouTube视频 [S143_JtCtV8](https://www.youtube.com/watch?v=S143_JtCtV8) 学习创建的现代化React应用演示项目。

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

### 环境配置

为了使用AI背景音乐功能，你需要配置ElevenLabs API密钥：

1. 访问 [ElevenLabs](https://elevenlabs.io/) 注册账户
2. 获取API密钥
3. 在项目根目录创建 `.env` 文件：
   ```
   VITE_ELEVENLABS_API_KEY=your_api_key_here
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

## 🎯 功能特性

- ⚡ 基于Vite的快速开发体验
- 🔄 热模块替换 (HMR)
- 📱 响应式设计
- 🎨 现代化UI组件
- 🛡️ TypeScript类型安全
- 📋 ESLint代码质量保证
- 🎵 AI生成编程背景音乐
- 🔄 自动循环音乐播放

## 📁 项目结构

```
src/
├── components/     # React组件
│   └── Demo.tsx   # 演示组件
├── hooks/         # 自定义Hooks
├── utils/         # 工具函数
├── types/         # TypeScript类型定义
├── App.tsx        # 主应用组件
├── main.tsx       # 应用入口
└── index.css      # 全局样式

docs/               # 项目文档
├── Solution.md    # 解决方案说明
├── Features.md    # 功能特性
├── Plan.md        # 开发计划
├── Changes.md     # 更新日志
└── Deploy.md      # 部署指南
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