# 💖 Love's Legacy - Digital Time Capsule

## Slide 1: 项目愿景与核心价值

### 🎯 温暖的数字遗产胶囊

**"A compassionate digital time capsule for leaving messages, photos, and memories for loved ones"**

---

### 🌟 我们的使命

Love's Legacy 致力于为即将离世的人们提供温暖、安全的数字空间，通过现代科技帮助他们：

- **💌 分享爱的言语** - 撰写温暖的信件和珍贵回忆
- **📸 保存珍贵时刻** - 上传和整理生命中美好的照片
- **🎤 录制心声** - 留下语音信息和个人故事
- **📅 安排传递** - 在重要的未来时刻安排传递

---

### 💝 设计理念

- **❤️ 爱与温暖**: 粉金渐变色彩，心形图标，温柔动画
- **🌟 希望与光明**: 明亮界面，积极的视觉语言
- **🔗 连接与延续**: 帮助跨越时间传递爱的讯息
- **🎨 关怀界面**: 充满爱意的设计，让用户感受到温暖

---

### 📱 应用预览

![Love's Legacy App](love-legacy/public/app-snapshot.png)

*美丽而富有同情心的界面，用于创建数字遗产胶囊*

---

## Slide 2: 核心功能与技术架构

### ✨ 四大核心功能

#### 💌 爱的讯息
- 编写温暖的文字和珍贵回忆
- 富文本编辑器，支持长篇文章
- 本地存储，支持编辑和删除
- 美丽的消息卡片展示

#### 📸 珍贵回忆
- 拖拽上传或点击选择照片
- 添加标题和描述
- 网格布局展示，支持悬停预览
- 全屏模态框查看大图
- 照片删除确认

#### 🎤 心声录制
- 原生浏览器录音功能
- 实时录音时长显示和视觉指示器
- ElevenLabs 语音转文字 API 集成
- 自动转录和文本显示
- 播放/暂停录音控制

#### 📅 未来传递
- 日历和时间选择器
- 在重要的未来时刻安排传递
- 生成直接可访问的分享链接
- 本地存储和定时任务管理
- 表单验证和错误处理

---

### 🛠️ 技术栈

| 技术领域 | 采用技术 |
|---------|---------|
| **前端框架** | React 18 + TypeScript |
| **构建工具** | Vite 6 |
| **动画引擎** | Framer Motion |
| **图标库** | Lucide React |
| **录音功能** | Web Audio API |
| **状态管理** | React Hooks |
| **样式方案** | CSS-in-JS + 响应式设计 |
| **包管理器** | pnpm |
| **代码质量** | ESLint + TypeScript |

---

### 📁 项目架构

```
loves-legacy/
├── love-legacy/          # 主应用 (单页布局)
│   ├── src/components/   # 功能组件
│   │   ├── MessageComposer.tsx  # 💌 爱的讯息
│   │   ├── PhotoManager.tsx     # 📸 珍贵回忆
│   │   ├── VoiceRecorder.tsx    # 🎤 心声录制
│   │   └── ScheduleManager.tsx  # 📅 未来传递
│   ├── api/             # Vercel 服务器less函数
│   ├── public/          # 静态资源
│   └── vercel.json      # Vercel 配置
├── backend/             # 本地开发后端
├── docs/               # 项目文档
└── README.md           # 项目说明
```

---

## Slide 3: 部署与使用指南

### 🚀 快速开始

#### 前置要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0

#### 一键启动
```bash
# 最简单的方式
./start.sh

# 自动执行:
# - 检查系统依赖 (Node.js, pnpm, curl)
# - 清理旧进程 (端口 3000 和 5173)
# - 安装项目依赖
# - 启动后端服务 (端口 3000)
# - 启动前端应用 (端口 5173)
```

---

### 🌐 部署选项

#### 🌟 Vercel (推荐)
```bash
# 快速部署到 Vercel
./deploy-vercel.sh

# 或手动方式:
cd love-legacy
vercel --prod
```

**生产环境**: https://love-legacy-k0ch6g638-jhfnetboys-projects.vercel.app

#### 🖥️ 本地开发
```bash
# 安装所有依赖
pnpm install:all

# 配置 API 密钥 (语音转文字功能)
echo "ELEVENLABS_API_KEY=your_actual_api_key_here" > backend/.env

# 启动完整应用
pnpm dev:full
```

---

### 🎯 主要特性

- **📱 单页布局**: 所有功能集成在一页，无需标签切换
- **📱 响应式网格**: 移动端堆叠，平板2列，桌面4列
- **⚡ 即时操作**: 无页面导航
- **🎯 优化紧凑设计**: 最大化空间效率
- **🔄 实时同步**: 独立功能区域
- **💖 美丽心形标志**: 情感丰富的设计

---

### 🔗 分享功能

- 直接可访问的分享链接 (`/share/{type}/{id}`)
- 无需账户即可查看内容
- 安全的本地内容访问
- 支持消息、语音和照片分享

---

### 📞 获取 ElevenLabs API 密钥

#### 推荐设置 (完整功能)
**需要具有 speech_to_text 权限的 API 密钥**

1. **注册 ElevenLabs 账户**
   - 访问 [elevenlabs.io](https://elevenlabs.io/) 并创建账户
   - 验证邮箱并登录

2. **升级账户**
   - 访问 [ElevenLabs Pricing](https://elevenlabs.io/pricing)
   - 升级到付费计划以获得语音转文字权限

3. **获取 API 密钥**
   - 在账户设置中找到 API 密钥
   - 复制密钥用于应用配置

---

### 🌟 项目亮点

- **❤️ 情感价值**: 帮助人们传递最后的爱和思念
- **🎨 精美设计**: 温暖的视觉设计和用户体验
- **⚡ 技术先进**: 现代前端技术栈和最佳实践
- **🚀 部署便捷**: 一键部署到 Vercel
- **📱 用户友好**: 直观的单页应用设计
- **🔒 隐私保护**: 本地存储和安全分享机制

---

### 📈 未来展望

- **AI 增强**: 更智能的语音处理和情感分析
- **多语言支持**: 支持更多语言和文化
- **高级分享**: 社交媒体集成和定时发布
- **数据持久化**: 云端备份和同步
- **移动应用**: 原生移动应用版本

---

**💖 Love's Legacy - 传递爱，跨越时间**

*用科技传递爱与温暖，让思念永存*

---

**📞 联系我们**

- **项目主页**: [GitHub Repository]
- **演示地址**: https://love-legacy-k0ch6g638-jhfnetboys-projects.vercel.app
- **技术栈**: React + TypeScript + Vite + Vercel
- **许可证**: MIT License
