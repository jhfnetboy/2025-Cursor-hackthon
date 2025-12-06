import React, { useState } from 'react'
import BackgroundMusic from './components/BackgroundMusic'
import ParticleBackground from './components/ParticleBackground'
import './App.css'

function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  return (
    <div className="App">
      <ParticleBackground isMusicPlaying={isMusicPlaying} />
      <div className="content-overlay">
        <header className="App-header">
          <div className="hero-section">
            <h1 className="main-title">🎵 AI Music Generator</h1>
            <p className="subtitle">Generate ambient music for coding, focus, and creativity</p>
          </div>
          <BackgroundMusic onMusicStateChange={setIsMusicPlaying} />
        </header>
      </div>
    </div>
  )
}

export default App
