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

## ✨ 应用特色

### 💌 **爱的讯息**
- 写下温暖的话语和珍贵的回忆
- 富文本编辑器，支持长篇文章
- 保存草稿和编辑现有消息

### 📸 **珍贵回忆**
- 拖拽上传照片
- 添加标题和描述
- 网格布局展示，悬停预览

### 🎤 **心声录音**
- 浏览器录音功能
- 实时时长显示和可视化
- 模拟文字转录（未来可集成真实API）
- 播放和下载选项

### 📅 **未来传递**
- 日历和时间选择器
- 安排未来某个时刻的传递
- 状态跟踪和倒计时显示
- 支持多种内容类型的调度

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
├── leaving-world-app/          # 主应用
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