import React, { useState, useEffect, useRef, useCallback } from 'react'

interface BackgroundMusicProps {
  onMusicStateChange?: (isPlaying: boolean) => void
}

const BACKEND_URL = 'http://localhost:3000'

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ onMusicStateChange }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const healthData = await response.json()
            if (healthData.status === 'ok') {
              setBackendStatus('online')
              setError('')
            } else {
              setBackendStatus('offline')
              setError('Backend service health check failed')
            }
          } else {
            setBackendStatus('offline')
            setError('Backend service returned invalid response format')
          }
        } else {
          setBackendStatus('offline')
          setError(`Backend service error: ${response.status} ${response.statusText}`)
        }
      } catch (err) {
        setBackendStatus('offline')
        setError('Cannot connect to backend service. Please ensure the backend server is running on port 3000.')
        console.error('Backend health check failed:', err)
      }
    }

    checkBackendHealth()
  }, [])

  // Generate random music via backend API
  const generateRandomMusic = useCallback(async () => {
    if (backendStatus !== 'online') {
      setError('Backend service is not available')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('🎵 Requesting music from backend...')

      // Call backend API
      const response = await fetch(`${BACKEND_URL}/api/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, try to get text content
            const textContent = await response.text()
            if (textContent) {
              errorMessage = textContent.substring(0, 200) // Limit error message length
            }
          }
        } catch {
          // If JSON parsing fails, use default error message
          console.error('Failed to parse error response')
        }
        throw new Error(errorMessage)
      }

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error('Invalid JSON response from server')
      }

      if (!data.success || !data.audioData) {
        throw new Error('Invalid response from backend')
      }

      // Convert base64 to blob
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))],
        { type: data.contentType || 'audio/mpeg' }
      )

      // Create audio URL
      const audioUrl = URL.createObjectURL(audioBlob)

      // Create and play audio
      const audio = new Audio(audioUrl)
      audio.volume = 0.3 // Set moderate volume

      // Set up event listeners
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl) // Clean up URL
      })

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e)
        URL.revokeObjectURL(audioUrl)
      })

      // Store reference for cleanup
      audioRef.current = audio

      // Play the music
      await audio.play()

      // Update UI with track info
      setCurrentTrack(`🎵 ${data.prompt}`)
      setIsLoading(false)

      console.log('✅ Music generated and playing:', data.prompt)

        } catch (err) {
          let errorMessage = err instanceof Error ? err.message : 'Failed to generate music'

          // Provide more helpful error messages for common issues
          if (errorMessage.includes('401') || errorMessage.includes('invalid_api_key')) {
            errorMessage = 'Invalid ElevenLabs API key. Please check your backend/.env file and ensure you have a valid API key from https://elevenlabs.io/app/profile'
          } else if (errorMessage.includes('missing_permissions')) {
            errorMessage = 'API key lacks text-to-speech permissions. Please upgrade your ElevenLabs account or regenerate your API key at https://elevenlabs.io/app/profile'
          } else if (errorMessage.includes('Backend service is not available')) {
            errorMessage = 'Backend service is not running. Please start it with: pnpm dev:backend'
          }

          setError(errorMessage)
          console.error('❌ Music generation error:', err)
          setIsLoading(false)
        }
  }, [backendStatus])

  // Handle play/pause
  const toggleMusic = () => {
    const newState = !isMusicPlaying
    setIsMusicPlaying(newState)
    onMusicStateChange?.(newState)

    if (newState) {
      // Start generating new music
      generateRandomMusic()
    } else {
      // Stop current music
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setCurrentTrack('')
    }
  }

  // Auto-generate next track when current one ends
  useEffect(() => {
    if (!isMusicPlaying) return

    const interval = setInterval(() => {
      generateRandomMusic()
    }, 30000) // Generate new music every 30 seconds

    return () => clearInterval(interval)
  }, [isMusicPlaying, generateRandomMusic])

  return (
    <div className="music-generator">
      <div className="generator-container">
        <div className="visualizer">
          <div className={`wave ${isMusicPlaying ? 'active' : ''}`}>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        </div>

        <div className="control-section">
          <button
            onClick={toggleMusic}
            disabled={isLoading || !!error || backendStatus !== 'online'}
            className={`play-button ${isMusicPlaying ? 'playing' : ''} ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : isMusicPlaying ? (
              <div className="pause-icon">⏸️</div>
            ) : (
              <div className="play-icon">▶️</div>
            )}
          </button>

          <div className="status-display">
            {error && (
              <div className="error-indicator">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
              </div>
            )}
            {backendStatus === 'offline' && (
              <div className="error-indicator">
                <span className="error-icon">🔌</span>
                <span className="error-text">Backend service offline</span>
                <button
                  onClick={() => window.location.reload()}
                  className="retry-button"
                >
                  🔄 Retry
                </button>
              </div>
            )}
            {currentTrack && !error && backendStatus === 'online' && (
              <div className="track-info">
                <div className="track-label">Now Playing</div>
                <div className="track-name">{currentTrack.replace('🎵 ', '')}</div>
              </div>
            )}
            {!currentTrack && !error && backendStatus === 'online' && !isLoading && (
              <div className="ready-state">
                <div className="ready-icon">🎵</div>
                <div className="ready-text">Ready to generate music</div>
              </div>
            )}
            {backendStatus === 'checking' && (
              <div className="ready-state">
                <div className="ready-icon">🔄</div>
                <div className="ready-text">Connecting to backend...</div>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Generation</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔄</span>
              <span>Auto-Looping (30s)</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎭</span>
              <span>10+ Music Styles</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .music-generator {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 40px;
        }

        .generator-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .visualizer {
          margin-bottom: 30px;
        }

        .wave {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 60px;
        }

        .wave.active .wave-bar {
          animation: waveAnimation 1.5s ease-in-out infinite;
        }

        .wave-bar {
          width: 4px;
          background: linear-gradient(180deg, #667eea, #764ba2);
          border-radius: 2px;
          animation: waveAnimation 1.5s ease-in-out infinite;
          opacity: 0.3;
        }

        .wave-bar:nth-child(1) { animation-delay: -1.4s; }
        .wave-bar:nth-child(2) { animation-delay: -1.2s; }
        .wave-bar:nth-child(3) { animation-delay: -1.0s; }
        .wave-bar:nth-child(4) { animation-delay: -0.8s; }
        .wave-bar:nth-child(5) { animation-delay: -0.6s; }

        @keyframes waveAnimation {
          0%, 100% { height: 20px; opacity: 0.3; }
          50% { height: 60px; opacity: 1; }
        }

        .control-section {
          margin-bottom: 30px;
        }

        .play-button {
          width: 100px;
          height: 100px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .play-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .play-button:active:not(:disabled) {
          transform: scale(0.95);
        }

        .play-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .play-button.playing {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }

        .play-button.playing:hover:not(:disabled) {
          box-shadow: 0 12px 30px rgba(255, 107, 107, 0.4);
        }

        .play-icon, .pause-icon {
          font-size: 24px;
          color: white;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .status-display {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 107, 107, 0.3);
        }

        .retry-button {
          margin-left: 8px;
          padding: 4px 8px;
          border: none;
          border-radius: 6px;
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-button:hover {
          background: rgba(255, 107, 107, 0.3);
        }

        .error-icon {
          font-size: 16px;
        }

        .error-text {
          font-size: 14px;
          font-weight: 500;
        }

        .track-info {
          text-align: center;
        }

        .track-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .track-name {
          font-size: 14px;
          color: #61dafb;
          font-weight: 500;
          line-height: 1.4;
          max-width: 300px;
          margin: 0 auto;
        }

        .ready-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .ready-icon {
          font-size: 24px;
          opacity: 0.6;
        }

        .ready-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .info-section {
          margin-top: 30px;
        }

        .feature-list {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-icon {
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .music-generator {
            padding: 20px;
          }

          .generator-container {
            padding: 30px 20px;
          }

          .feature-list {
            gap: 12px;
          }

          .feature-item {
            font-size: 11px;
            padding: 6px 10px;
          }
        }
      `}</style>
    </div>
  )
}

export default BackgroundMusic
