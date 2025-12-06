import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, Pause, Square, Trash2, Download } from 'lucide-react'
import { motion } from 'framer-motion'

interface VoiceMessage {
  id: string
  blob: Blob
  duration: number
  transcribedText?: string
  createdAt: Date
  title: string
}

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [recordTime, setRecordTime] = useState(0)
  const [voiceMessages, setVoiceMessages] = useState<VoiceMessage[]>([])
  const [currentTitle, setCurrentTitle] = useState('')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Request microphone permission on mount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Microphone access granted')
      })
      .catch((error) => {
        console.error('Microphone access denied:', error)
      })
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const duration = recordTime

        const voiceMessage: VoiceMessage = {
          id: Date.now().toString(),
          blob: audioBlob,
          duration,
          createdAt: new Date(),
          title: currentTitle || `Voice Message ${voiceMessages.length + 1}`
        }

        setVoiceMessages(prev => [voiceMessage, ...prev])
        setCurrentTitle('')

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordTime(0)

      // Start timer
      recordTimerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current)
      }
    }
  }

  const playMessage = async (messageId: string) => {
    const message = voiceMessages.find(m => m.id === messageId)
    if (!message) return

    if (isPlaying === messageId) {
      // Pause
      const audio = audioRefs.current[messageId]
      if (audio) {
        audio.pause()
      }
      setIsPlaying(null)
    } else {
      // Play
      setIsPlaying(messageId)

      const audio = new Audio(URL.createObjectURL(message.blob))
      audioRefs.current[messageId] = audio

      audio.onended = () => {
        setIsPlaying(null)
        URL.revokeObjectURL(audio.src)
      }

      audio.onerror = () => {
        setIsPlaying(null)
        URL.revokeObjectURL(audio.src)
      }

      try {
        await audio.play()
      } catch (error) {
        console.error('Error playing audio:', error)
        setIsPlaying(null)
      }
    }
  }

  const deleteMessage = (messageId: string) => {
    setVoiceMessages(prev => prev.filter(m => m.id !== messageId))

    // Clean up audio reference
    if (audioRefs.current[messageId]) {
      audioRefs.current[messageId].pause()
      delete audioRefs.current[messageId]
    }

    if (isPlaying === messageId) {
      setIsPlaying(null)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Mock transcription (in a real app, you'd use a speech-to-text API)
  const transcribeMessage = async (messageId: string) => {
    // Simulate API call
    setTimeout(() => {
      setVoiceMessages(prev => prev.map(msg =>
        msg.id === messageId
          ? { ...msg, transcribedText: "This is a simulated transcription. In a real application, this would use Google's Speech-to-Text API or similar service to convert your voice message to text." }
          : msg
      ))
    }, 2000)
  }

  return (
    <div className="voice-recorder">
      <div className="recorder-header">
        <h2>Voice from Heart</h2>
        <p>Record voice messages that will be transcribed and preserved for your loved ones</p>
      </div>

      {/* Recording Interface */}
      <motion.div
        className="recording-section card"
        animate={isRecording ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
      >
        <div className="recorder-controls">
          {!isRecording ? (
            <div className="pre-record">
              <input
                type="text"
                className="input title-input"
                placeholder="Give your message a title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
              />
              <motion.button
                className="btn btn-primary record-btn"
                onClick={startRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic size={24} />
                Start Recording
              </motion.button>
            </div>
          ) : (
            <div className="recording-active">
              <div className="recording-indicator">
                <div className="pulse-ring"></div>
                <Mic size={48} className="recording-icon" />
              </div>
              <div className="recording-info">
                <div className="recording-time">{formatTime(recordTime)}</div>
                <p>Recording... Speak from your heart</p>
              </div>
              <motion.button
                className="btn btn-secondary stop-btn"
                onClick={stopRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Square size={20} />
                Stop Recording
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Voice Messages List */}
      {voiceMessages.length > 0 && (
        <div className="messages-section">
          <h3>Your Voice Messages ({voiceMessages.length})</h3>
          <div className="messages-list">
            {voiceMessages.map((message) => (
              <motion.div
                key={message.id}
                className="voice-message card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-header">
                  <h4>{message.title}</h4>
                  <span className="duration">{formatTime(message.duration)}</span>
                </div>

                <div className="message-controls">
                  <button
                    className="btn-icon play-btn"
                    onClick={() => playMessage(message.id)}
                  >
                    {isPlaying === message.id ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <div className="message-actions">
                    <button
                      className="btn-icon transcribe-btn"
                      onClick={() => transcribeMessage(message.id)}
                      disabled={!!message.transcribedText}
                    >
                      📝 {message.transcribedText ? 'Transcribed' : 'Transcribe'}
                    </button>

                    <button
                      className="btn-icon download-btn"
                      onClick={() => {
                        const url = URL.createObjectURL(message.blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `${message.title}.wav`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      <Download size={16} />
                    </button>

                    <button
                      className="btn-icon delete-btn"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {message.transcribedText && (
                  <div className="transcription">
                    <h5>Transcription:</h5>
                    <p>{message.transcribedText}</p>
                  </div>
                )}

                <div className="message-meta">
                  Created: {message.createdAt.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {voiceMessages.length === 0 && (
        <div className="empty-state">
          <Mic size={64} />
          <h3>No Voice Messages Yet</h3>
          <p>Record heartfelt voice messages that will be preserved and transcribed for your loved ones.</p>
        </div>
      )}

      <style jsx>{`
        .voice-recorder {
          max-width: 800px;
          margin: 0 auto;
        }

        .recorder-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .recorder-header h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .recorder-header p {
          color: #666;
        }

        .recording-section {
          margin-bottom: 2rem;
        }

        .recorder-controls {
          text-align: center;
        }

        .pre-record {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .title-input {
          max-width: 300px;
        }

        .record-btn {
          font-size: 1.1rem;
          padding: 1rem 2rem;
        }

        .recording-active {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .recording-indicator {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pulse-ring {
          position: absolute;
          width: 80px;
          height: 80px;
          border: 3px solid #ff6b9d;
          border-radius: 50%;
          animation: pulse 1.5s ease-out infinite;
        }

        .recording-icon {
          color: #ff6b9d;
          z-index: 1;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .recording-info {
          text-align: center;
        }

        .recording-time {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .stop-btn {
          margin-top: 1rem;
        }

        .messages-section h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .messages-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .voice-message {
          transition: all 0.3s ease;
        }

        .voice-message:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .message-header h4 {
          margin: 0;
          color: #333;
        }

        .duration {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .message-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .play-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .message-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: auto;
        }

        .btn-icon {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover:not(:disabled) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .btn-icon:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .transcribe-btn:disabled {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
        }

        .delete-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }

        .transcription {
          background: rgba(102, 126, 234, 0.05);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .transcription h5 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .transcription p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }

        .message-meta {
          font-size: 0.875rem;
          color: #888;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-state svg {
          color: #ddd;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .recording-active {
            gap: 1rem;
          }

          .message-controls {
            flex-direction: column;
            gap: 0.5rem;
          }

          .message-actions {
            margin-left: 0;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default VoiceRecorder
