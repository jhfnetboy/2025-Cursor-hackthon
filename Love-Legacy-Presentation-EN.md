# 💖 Love's Legacy - Digital Time Capsule

## Slide 1: Project Vision & Core Values

### 🎯 A Warm Digital Legacy Capsule

**"A compassionate digital time capsule for leaving messages, photos, and memories for loved ones"**

---

### 🌟 Our Mission

Love's Legacy is dedicated to providing a warm, safe digital space for people who wish to leave love and memories when they depart. Through modern technology, we help people:

- **💌 Share loving words** - Write warm letters and precious memories
- **📸 Preserve precious moments** - Upload and organize life's beautiful photos
- **🎤 Record heartfelt voices** - Leave voice messages and personal stories
- **📅 Schedule delivery** - Arrange delivery at important future moments

---

### 💝 Design Philosophy

- **❤️ Love & Warmth**: Pink-gold gradient colors, heart icons, gentle animations
- **🌟 Hope & Light**: Bright interface, positive visual language
- **🔗 Connection & Continuity**: Help bridge time to deliver loving messages
- **🎨 Caring Interface**: Design full of love and care, making users feel warmth

---

### 📱 App Preview

![Love's Legacy App](love-legacy/public/app-snapshot.png)

*A beautiful, compassionate interface for creating digital legacy capsules*

---

## Slide 2: Core Features & Technical Architecture

### ✨ Four Core Features

#### 💌 Loving Messages
- Write warm words and precious memories
- Rich text editor, supports long articles
- Save to local storage, support edit and delete
- Beautiful message card display

#### 📸 Precious Memories
- Drag & drop upload or click to select photos
- Add titles and descriptions
- Grid layout display, hover preview support
- Full-screen modal for viewing large images
- Photo deletion confirmation

#### 🎤 Heartfelt Voices
- Native browser recording functionality
- Real-time recording duration display and visual indicators
- ElevenLabs Speech-to-Text API integration
- Automatic transcription and text display
- Play/pause recording controls
- Recording deletion confirmation

#### 📅 Future Delivery
- Calendar and time pickers
- Schedule delivery at important future moments
- Generate directly accessible share links
- Local storage and scheduled task management
- Form validation and error handling
- *Note: Emails are simulated for demo - they appear to send successfully*

---

### 🛠️ Technology Stack

| Technology Area | Adopted Technology |
|----------------|-------------------|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 6 |
| **Animation Engine** | Framer Motion |
| **Icon Library** | Lucide React |
| **Recording** | Web Audio API |
| **State Management** | React Hooks |
| **Styling** | CSS-in-JS + Responsive Design |
| **Package Manager** | pnpm |
| **Code Quality** | ESLint + TypeScript |
| **Design Philosophy** | Warm pink-gold gradients, heart animations, and meaningful SVG logo |

---

### 📁 Project Structure

```
loves-legacy/
├── love-legacy/          # Main app (single page layout)
│   ├── src/components/   # Feature components
│   │   ├── MessageComposer.tsx  # 💌 Loving messages
│   │   ├── PhotoManager.tsx     # 📸 Precious memories
│   │   ├── VoiceRecorder.tsx    # 🎤 Heartfelt voices
│   │   └── ScheduleManager.tsx  # 📅 Future delivery
│   ├── api/             # Vercel serverless functions
│   ├── public/          # Static assets
│   └── vercel.json      # Vercel configuration
├── backend/             # Local development backend
├── docs/               # Project documentation
└── README.md           # Project documentation
```

---

## Slide 3: Deployment & Usage Guide

### 🚀 Quick Start

#### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

#### One-Click Launch
```bash
# Simplest way
./start.sh

# Automatically executes:
# - Check system dependencies (Node.js, pnpm, curl)
# - Clean up old processes (ports 3000 and 5173)
# - Install project dependencies
# - Start backend service (port 3000)
# - Start frontend application (port 5173)
```

---

### 🌐 Deployment Options

#### 🌟 Vercel (Recommended)
```bash
# Quick deploy to Vercel
./deploy-vercel.sh

# Or manually:
cd love-legacy
vercel --prod
```

**Production Environment**: https://love-legacy-k0ch6g638-jhfnetboys-projects.vercel.app

#### 🖥️ Local Development
```bash
# Install all dependencies
pnpm install:all

# Configure API key (for speech-to-text functionality)
echo "ELEVENLABS_API_KEY=your_actual_api_key_here" > backend/.env

# Start full application (frontend + backend)
pnpm dev:full

# Or start separately:
# Terminal 1: pnpm dev:backend  # Backend service (port 3000)
# Terminal 2: pnpm dev          # Frontend app (port 5173)

# Access application
# 💖 Love's Legacy: http://localhost:5173
# 💚 Backend health check: http://localhost:3000/health
#
# ✨ All features are now in one page, no tab switching needed!

# Stop services
# Press Ctrl+C in the terminal running start.sh, or run:
pkill -f "pnpm dev" && pkill -f "node.*server.js"
```

---

### 🎯 Key Features

- **📱 Single Page Layout**: All features integrated in one page, no tab switching
- **📱 Responsive Grid**: Mobile stacked, tablet 2 columns, desktop 4 columns
- **⚡ Instant Operations**: No page navigation required
- **🎯 Optimized Compact Design**: Maximum space efficiency
- **🔄 Real-time Sync**: Independent feature areas
- **💖 Beautiful Heart Logo**: Emotionally rich design

---

### 🔗 Share Features

- Directly accessible share links (`/share/{type}/{id}`)
- View content without account required
- Secure local content access
- Support message, voice, and photo sharing

---

### 📞 Getting ElevenLabs API Key

Love's Legacy uses ElevenLabs Speech-to-Text API to transcribe voice recordings:

#### 🎯 Recommended Setup (Full Features)
**Requires API key with speech_to_text permissions**

#### Step 1: Register ElevenLabs Account
1. Visit [elevenlabs.io](https://elevenlabs.io/) and create account
2. Verify email and log in

#### Step 2: Upgrade Account
1. Visit [ElevenLabs Pricing](https://elevenlabs.io/pricing)
2. Upgrade to paid plan to get speech-to-text permissions

#### Step 3: Get API Key
1. Go to account settings to find API key
2. Copy key for application configuration

---

### 🌟 Project Highlights

- **❤️ Emotional Value**: Help people pass on their final love and thoughts
- **🎨 Beautiful Design**: Warm visual design and user experience
- **⚡ Advanced Technology**: Modern frontend tech stack and best practices
- **🚀 Easy Deployment**: One-click deployment to Vercel
- **📱 User-Friendly**: Intuitive single-page application design
- **🔒 Privacy Protection**: Local storage and secure sharing mechanisms

---

### 📈 Future Outlook

- **AI Enhancement**: Smarter voice processing and emotion analysis
- **Multi-language Support**: Support for more languages and cultures
- **Advanced Sharing**: Social media integration and scheduled posting
- **Data Persistence**: Cloud backup and synchronization
- **Mobile Apps**: Native mobile application versions

---

**💖 Love's Legacy - Deliver Love, Across Time**

*Use technology to deliver love and warmth, let memories live forever*

---

**📞 Contact Us**

- **Project Home**: [GitHub Repository]
- **Demo URL**: https://love-legacy-k0ch6g638-jhfnetboys-projects.vercel.app
- **Tech Stack**: React + TypeScript + Vite + Vercel
- **License**: MIT License
