import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, Square, Trash2, Heart, Volume2, Clock } from 'lucide-react';

interface VoiceRecording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  recordedAt: Date;
  title: string;
  transcription?: string;
  isTranscribing?: boolean;
  transcriptionError?: string;
}

const VoiceRecorder: React.FC = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load recordings from localStorage on component mount
  useEffect(() => {
    const savedRecordings = localStorage.getItem('loves-legacy-voice-recordings');
    if (savedRecordings) {
      try {
        // Note: We can't restore Blob objects from localStorage
        // In a real app, you'd store files on a server
        setRecordings([]);
      } catch (error) {
        console.error('Failed to load saved recordings:', error);
      }
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = recordingTime;

        const newRecording: VoiceRecording = {
          id: Date.now().toString(),
          blob,
          url,
          duration,
          recordedAt: new Date(),
          title: `Voice Message ${recordings.length + 1}`,
          isTranscribing: true
        };

        setRecordings(prev => [...prev, newRecording]);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Start transcription
        transcribeAudio(newRecording.id, blob);

        // Reset recording state
        setRecordingTime(0);
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  }, [recordingTime, recordings.length]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const transcribeAudio = async (recordingId: string, audioBlob: Blob) => {
    try {
      // Convert blob to base64 for Vercel Functions
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
        }),
      });

      const result = await response.json();

      if (!response.ok && !result.mock) {
        throw new Error(result.error || `Transcription failed: ${response.status}`);
      }

      setRecordings(prev => prev.map(recording =>
        recording.id === recordingId
          ? {
              ...recording,
              transcription: result.transcription,
              isTranscribing: false,
              transcriptionError: result.error || null
            }
          : recording
      ));

    } catch (error) {
      console.error('Transcription error:', error);
      setRecordings(prev => prev.map(recording =>
        recording.id === recordingId
          ? {
              ...recording,
              isTranscribing: false,
              transcriptionError: 'Failed to transcribe audio. Please try again.'
            }
          : recording
      ));
    }
  };

  const playRecording = useCallback(async (recording: VoiceRecording) => {
    if (currentlyPlaying === recording.id) {
      // Pause current playback
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      }
    } else {
      // Start new playback
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(recording.url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      };

      try {
        await audioRef.current.play();
        setCurrentlyPlaying(recording.id);
        setIsPlaying(true);
      } catch (error) {
        console.error('Playback error:', error);
        alert('Could not play audio. Please try again.');
      }
    }
  }, [currentlyPlaying]);

  const deleteRecording = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this voice recording? This action cannot be undone.')) {
      setRecordings(prev => prev.filter(recording => recording.id !== id));

      // Stop playback if this recording is playing
      if (currentlyPlaying === id && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
      }
    }
  }, [currentlyPlaying]);

  const updateRecordingTitle = useCallback((id: string, title: string) => {
    setRecordings(prev => prev.map(recording =>
      recording.id === id ? { ...recording, title } : recording
    ));
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="voice-recorder">
      <div className="voice-header">
        <div className="header-icon">
          <Volume2 size={24} />
        </div>
        <div className="header-text">
          <h2>Heartfelt Voice</h2>
          <p>Record your voice messages and preserve your words forever</p>
        </div>
      </div>

      <div className="voice-content">
        {/* Recording Controls */}
        <div className="recording-controls">
          <div className="recorder-main">
            {!isRecording ? (
              <button
                className="record-btn start"
                onClick={startRecording}
              >
                <Mic size={32} />
                <span>Start Recording</span>
              </button>
            ) : (
              <div className="recording-active">
                <div className="recording-indicator">
                  <div className="pulse-ring"></div>
                  <Mic className="recording-icon" size={32} />
                </div>
                <div className="recording-info">
                  <div className="recording-time">{formatTime(recordingTime)}</div>
                  <div className="recording-label">Recording...</div>
                </div>
                <button
                  className="record-btn stop"
                  onClick={stopRecording}
                >
                  <Square size={24} />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>

          <div className="recording-tips">
            <p>💡 <strong>Tips:</strong> Speak clearly and from a quiet environment for best transcription results.</p>
            <p>🎤 Make sure to allow microphone access when prompted by your browser.</p>
          </div>
        </div>

        {/* Recordings List */}
        {recordings.length > 0 && (
          <div className="recordings-section">
            <h3>Your Voice Messages ({recordings.length})</h3>
            <div className="recordings-list">
              {recordings.map(recording => (
                <div key={recording.id} className="recording-card">
                  <div className="recording-header">
                    <input
                      type="text"
                      value={recording.title}
                      onChange={(e) => updateRecordingTitle(recording.id, e.target.value)}
                      className="recording-title-input"
                      placeholder="Voice message title"
                    />
                    <div className="recording-actions">
                      <button
                        className={`play-btn ${currentlyPlaying === recording.id ? 'playing' : ''}`}
                        onClick={() => playRecording(recording)}
                        title={currentlyPlaying === recording.id ? 'Pause' : 'Play'}
                      >
                        {currentlyPlaying === recording.id && isPlaying ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} />
                        )}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteRecording(recording.id)}
                        title="Delete recording"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="recording-meta">
                    <span className="recording-duration">
                      <Clock size={14} />
                      {formatTime(recording.duration)}
                    </span>
                    <span className="recording-date">
                      {formatDate(recording.recordedAt)}
                    </span>
                  </div>

                  {/* Transcription Section */}
                  <div className="transcription-section">
                    {recording.isTranscribing && (
                      <div className="transcribing-indicator">
                        <div className="transcribing-spinner"></div>
                        <span>Transcribing your voice message...</span>
                      </div>
                    )}

                    {recording.transcription && (
                      <div className="transcription-content">
                        <h4>
                          Transcription:
                          {recording.transcriptionError && recording.transcription && (
                            <span className="mock-indicator"> (Demo Mode)</span>
                          )}
                        </h4>
                        <p>{recording.transcription}</p>
                        {recording.transcriptionError && recording.transcription && (
                          <div className="mock-notice">
                            <small>
                              💡 Need real transcription?<br/>
                              Visit <a href="https://elevenlabs.io/app/profile" target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary-pink)'}}>
                                ElevenLabs Profile
                              </a> and upgrade to Creator plan ($22/month).
                            </small>
                          </div>
                        )}
                      </div>
                    )}

                    {recording.transcriptionError && !recording.transcription && (
                      <div className="transcription-error">
                        <span>❌ {recording.transcriptionError}</span>
                        <div className="error-help">
                          <small>
                            💡 <strong>Need real transcription?</strong><br/>
                            Visit <a href="https://elevenlabs.io/app/profile" target="_blank" rel="noopener noreferrer">
                              ElevenLabs Profile</a> and upgrade your plan to enable speech-to-text.
                          </small>
                        </div>
                      </div>
                    )}

                    {!recording.isTranscribing && !recording.transcription && !recording.transcriptionError && (
                      <div className="no-transcription">
                        <span>Transcription not available</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recordings.length === 0 && (
          <div className="empty-state">
            <Mic size={64} />
            <h3>No Voice Messages Yet</h3>
            <p>Click the record button above to capture your first heartfelt voice message.</p>
            <Heart size={24} className="heart-icon" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
