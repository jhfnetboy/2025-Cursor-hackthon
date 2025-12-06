# 🎵 AI Music Generator + 🌹 Leaving the World

这个项目包含两个应用：

1. **🎵 AI Music Generator** - 结合动态粒子效果的AI音乐生成器，为编程和创造力提供沉浸式背景音乐
2. **🌹 Leaving the World** - 一个充满爱心的数字时光胶囊，帮助人们为所爱之人留下爱的讯息、珍贵回忆和心声

## 🚀 技术栈

### 🎵 Music Generator
- **前端**: React 18 + TypeScript + Vite 6
- **后端**: Node.js + Express (安全API密钥管理)
- **AI服务**: ElevenLabs API
- **视觉效果**: HTML5 Canvas + 粒子动画系统

### 🌹 Leaving the World
- **前端**: React 18 + TypeScript + Vite 6
- **动画**: Framer Motion
- **图标**: Lucide React
- **录音**: Web Audio API
- **设计**: 温暖的渐变色彩和柔和动画

### 共享技术栈
- **包管理器**: pnpm
- **代码质量**: ESLint + TypeScript
- **构建工具**: Vite 6

## 📦 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 快速启动 (推荐)

使用自动化启动脚本（会自动清理旧进程并启动服务）：

```bash
# 克隆项目
git clone <repository-url>
cd 2025-Cursor-hackthon

# 配置API密钥
echo "ELEVENLABS_API_KEY=your_actual_api_key_here" > backend/.env

# 🎵 启动AI音乐生成器
./start.sh

# 🎵 启动Leaving the World爱心应用
cd leaving-world-app && pnpm dev

# 访问应用
# 🎵 Music Generator: http://localhost:5173
# 🌹 Leaving the World: http://localhost:5174
```

### 手动启动

如果你需要分别控制前后端服务：

```bash
# 安装前端依赖
pnpm install

# 安装后端依赖
cd backend && pnpm install && cd ..

# 启动后端服务 (端口3000)
pnpm dev:backend

# 启动前端服务 (端口5173) - 在新终端中运行
pnpm dev
```

### 获取ElevenLabs API密钥

为了体验AI音乐生成功能，你需要配置ElevenLabs API密钥：

#### 步骤 1: 注册ElevenLabs账户
1. 访问 [elevenlabs.io](https://elevenlabs.io/) 并注册账户
2. 验证邮箱后登录账户

#### 步骤 2: 获取API密钥
1. 点击右上角头像 → "Profile"
2. 滚动到 "API Key" 部分
3. 点击 "Create" 或复制现有的API密钥

#### 步骤 3: 配置环境变量
1. 打开 `backend/.env` 文件
2. 替换 `your_api_key_here` 为你的实际API密钥：
   ```
   ELEVENLABS_API_KEY=sk_1234567890abcdef...你的真实密钥
   ```

#### 验证配置
重新启动后端服务，你应该看到：
```
✅ ElevenLabs client initialized successfully
```

如果仍然看到警告，请确保：
- API密钥正确复制（不包含多余空格）
- API密钥没有过期
- 账户有足够的积分
- **API密钥有text-to-speech权限** (见下方故障排除)

### 故障排除

#### "missing_permissions" 错误
如果遇到此错误，表示你的API密钥缺少text-to-speech权限：

**解决方案** (按推荐顺序):

1. **使用Sound Generation API** (推荐):
   - 应用会自动尝试使用ElevenLabs的Sound Generation API
   - 这个API在免费账户上可用
   - 生成更适合背景音乐的音频

2. **升级账户** (如果需要text-to-speech):
   - 访问 [ElevenLabs Pricing](https://elevenlabs.io/pricing)
   - 升级到付费计划以获得完整功能
   - Starter计划每月$5，包含text-to-speech

3. **重新生成API密钥**:
   - 进入 [Profile Settings](https://elevenlabs.io/app/profile)
   - 删除旧的API密钥
   - 创建新的API密钥
   - 新密钥会自动获得相应权限

#### 账户等级说明
- **免费账户**: Sound Generation API可用，text-to-speech有限制
- **Starter ($5/月)**: 完整text-to-speech功能，50,000字符/月
- **Creator ($22/月)**: 无限使用，所有功能解锁

### 架构说明

- **前端 (端口5173)**: React应用，处理用户界面和粒子效果
- **后端 (端口3000)**: Node.js/Express服务器，安全存储API密钥并调用ElevenLabs API
- **安全性**: API密钥仅存储在后端，永远不会暴露给前端

### 故障排除

#### "Unexpected end of JSON input" 错误
如果遇到此错误，通常表示：
1. **后端服务未运行**: 确保在另一个终端运行 `pnpm dev:backend`
2. **网络连接问题**: 检查端口3000是否被占用
3. **API密钥问题**: 验证 `backend/.env` 文件中的密钥是否正确

#### 解决步骤：
```bash
# 1. 检查后端是否运行
curl http://localhost:3000/health

# 2. 如果不运行，启动后端
pnpm dev:backend

# 3. 重新加载前端页面
# 或者点击错误信息中的 "🔄 Retry" 按钮
```

### 其他命令

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码质量检查
pnpm lint

# 启动脚本 (自动清理和启动)
./start.sh

# 分别启动服务
pnpm dev:backend    # 后端服务 (端口3000)
pnpm dev           # 前端服务 (端口5173)
```

## ✨ 项目特色

### 🎵 AI Music Generator
- 🤖 **AI音乐生成** - 使用ElevenLabs API生成独特的环境音乐
- 🎨 **动态粒子效果** - 响应音乐播放的实时粒子动画
- 🔄 **自动循环播放** - 每30秒生成新的音乐片段
- 🎭 **10种音乐风格** - 从lo-fi到环境电子音乐的多样选择
- 📱 **响应式设计** - 适配各种设备尺寸

### 🌹 Leaving the World
- 💌 **爱的讯息** - 写下温暖的话语和珍贵的回忆
- 📸 **珍贵回忆** - 上传和组织珍贵的照片
- 🎤 **心声录音** - 录制语音讯息并自动转录文字
- 📅 **未来传递** - 安排在未来某个时刻传递给所爱之人
- 🎨 **温暖界面** - 充满爱和关怀的设计

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

# Leaving World App (Separate Application)
leaving-world-app/
├── src/
│   ├── components/      # 爱心组件
│   │   ├── MessageComposer.tsx  # 写信组件
│   │   ├── PhotoManager.tsx     # 照片管理
│   │   ├── VoiceRecorder.tsx    # 录音组件
│   │   └── ScheduleManager.tsx  # 定时发送
│   └── App.tsx         # 主应用
└── README.md           # 爱心应用说明

# Backend Service
backend/
├── src/server.js       # Express服务器
├── .env               # API密钥配置
└── package.json       # 后端依赖

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