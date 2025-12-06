# 💖 Love's Legacy

一个充满爱心的数字遗产应用，帮助人们为所爱之人留下爱的讯息、珍贵回忆和心声。创建温暖的时光胶囊，保存那些想让后代知道的重要话语、珍贵瞬间和内心独白。

## 🎯 使命

Love's Legacy 致力于为那些希望在离开时留下爱和回忆的人们提供一个温暖、安全的数字空间。通过现代技术，我们帮助人们：

- **💌 传递爱的话语** - 写下温暖的信件和珍贵的回忆
- **📸 保存珍贵瞬间** - 上传和组织一生的美好照片
- **🎤 录制心声** - 留下语音信息和个人故事
- **📅 安排传递** - 在未来的重要时刻将消息传递给 loved ones

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 启动应用

```bash
# 克隆项目
git clone <repository-url>
cd 2025-Cursor-hackthon

# 最简单的方式 - 一键启动
./start.sh

# start.sh 会自动：
# - 检查系统依赖 (Node.js, pnpm, curl)
# - 清理旧进程 (端口3000和5173)
# - 安装项目依赖
# - 启动后端服务 (端口3000)
# - 启动前端应用 (端口5173)
# - 等待服务就绪并显示状态

# 或者手动方式：

# 安装所有依赖
pnpm install:all

# 配置API密钥（用于语音转文字功能）
echo "ELEVENLABS_API_KEY=your_actual_api_key_here" > backend/.env

# 启动完整应用（前后端）
pnpm dev:full

# 或者分别启动：
# 终端1: pnpm dev:backend  # 后端服务 (端口3000)
# 终端2: pnpm dev          # 前端应用 (端口5173)

# 访问应用
# 💖 Love's Legacy: http://localhost:5173
# 💚 后端健康检查: http://localhost:3000/health

# 停止服务
# 在运行 start.sh 的终端按 Ctrl+C，或运行：
pkill -f "pnpm dev" && pkill -f "node.*server.js"
```

### 获取ElevenLabs API密钥

Love's Legacy使用ElevenLabs的语音转文字API来转录录音信息：

#### 🎯 推荐配置（完整功能）
**需要 speech_to_text 权限的API密钥**

#### 步骤 1: 注册ElevenLabs账户
1. 访问 [elevenlabs.io](https://elevenlabs.io/) 并注册账户
2. 验证邮箱后登录账户

#### 步骤 2: 升级账户获取语音转文字权限
1. 访问 [ElevenLabs Pricing](https://elevenlabs.io/pricing)
2. 升级到 **Creator** 计划 ($22/月) 或更高
3. 确保账户包含 **Speech-to-Text** 功能

#### 步骤 3: 获取API密钥
1. 点击右上角头像 → "Profile"
2. 滚动到 "API Key" 部分
3. 点击 "Create" 生成新的API密钥

#### 步骤 4: 配置环境变量
1. 打开 `backend/.env` 文件
2. 替换为你的实际API密钥：
   ```
   ELEVENLABS_API_KEY=sk_1234567890abcdef...你的真实密钥
   PORT=3000
   ```

#### 🔄 备选方案（开发模式）
如果没有合适的API密钥，系统会自动使用**模拟转录**功能：
- ✅ 录音功能完全可用
- ✅ 显示示例转录文本
- ✅ 提供升级提示
- ⚠️ 转录内容为示例文本

#### 验证配置
重新启动后端服务，你应该看到：
```
✅ ElevenLabs client initialized successfully
```

如果看到权限错误，系统会自动切换到模拟模式。

### 其他命令

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码质量检查
pnpm lint
```

## ✨ 应用特色

### 🔗 **分享功能**
- 直接可访问的分享链接 (`/share/{type}/{id}`)
- 无需账户即可查看内容
- 安全的本地内容访问
- 支持消息、语音和照片分享

### 💌 **爱的讯息** ✅ 已实现
- 写下温暖的话语和珍贵的回忆
- 富文本编辑器，支持长篇文章
- 保存到本地存储，支持编辑和删除
- 美观的消息卡片展示

### 📸 **珍贵回忆** ✅ 已实现
- 拖拽上传照片或点击选择
- 添加标题和描述
- 网格布局展示，支持悬停预览
- 全屏模态框查看大图
- 删除照片确认功能

### 🎤 **心声录音** ✅ 已实现
- 浏览器原生录音功能
- 实时录音时长显示和视觉指示器
- ElevenLabs语音转文字API集成
- 自动转录并显示文字内容
- 播放/暂停录音控制
- 删除录音确认功能

### 📅 **未来传递** ✅ 已实现
- 日历和时间选择器
- 安排未来某个时刻的传递
- 生成可直接访问的分享链接
- 本地存储和管理调度任务

### 🎨 **温暖界面**
- 充满爱和关怀的设计
- 采用温暖的粉金渐变色彩
- 爱心动画和流畅过渡
- 响应式设计，适配所有设备

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **动画引擎**: Framer Motion
- **图标库**: Lucide React
- **录音功能**: Web Audio API
- **状态管理**: React Hooks
- **样式方案**: CSS-in-JS + 响应式设计
- **包管理器**: pnpm
- **代码质量**: ESLint + TypeScript

## 📁 项目结构

```
loves-legacy/
├── love-legacy/          # 主应用
│   ├── src/
│   │   ├── components/         # 爱心组件
│   │   │   ├── MessageComposer.tsx  # 写信组件
│   │   │   ├── PhotoManager.tsx     # 照片管理
│   │   │   ├── VoiceRecorder.tsx    # 录音组件
│   │   │   └── ScheduleManager.tsx  # 定时发送
│   │   ├── App.tsx            # 主应用组件
│   │   ├── App.css            # 应用样式
│   │   └── index.css          # 全局样式
│   ├── public/
│   │   └── heart-icon.svg     # 爱心图标
│   └── package.json
├── docs/                      # 项目文档
│   ├── Solution.md
│   ├── Features.md
│   ├── Plan.md
│   ├── Changes.md
│   └── Deploy.md
└── README.md                  # 项目说明
```

## 📚 文档

详细文档请查看 [docs/](docs/) 目录。

## 🌟 设计理念

**Love's Legacy** 的设计理念基于：

- **❤️ 爱与温暖**: 粉金色彩方案，爱心图标，温柔的动画
- **🌟 希望与光明**: 明亮的界面，积极的视觉语言
- **🔗 连接与延续**: 帮助跨越时间传递爱的信息
- **🎨 美丽与关怀**: 精美的设计，注重用户情感体验
- **📱 无障碍**: 支持所有设备和辅助技术

## 🤝 贡献

我们欢迎所有希望为这个充满爱心的项目做出贡献的人们！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

*"The most important thing in life is to love and be loved."*

Love's Legacy 希望能为那些需要的人们带来安慰和希望。