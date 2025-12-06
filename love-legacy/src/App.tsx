import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Camera, Heart, Calendar, Users } from 'lucide-react';
import './App.css';

// Import components
import MessageComposer from './components/MessageComposer';
import PhotoManager from './components/PhotoManager';
import VoiceRecorder from './components/VoiceRecorder';
import ScheduleManager from './components/ScheduleManager';
import ShareView from './components/ShareView';

// Type definitions
export interface ScheduledItem {
  id: string;
  contentId: string;
  contentType: 'message' | 'photo' | 'voice';
  title: string;
  recipientEmail: string;
  scheduledDate: Date;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
}

export interface MessageItem {
  id: string;
  title: string;
  content: string;
  recipient?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  description?: string;
  url: string; // Base64 encoded image
  fileSize: number;
  createdAt: string;
}

export interface VoiceRecording {
  id: string;
  title: string;
  audioUrl: string; // Blob URL or base64
  transcription: string;
  transcriptionError?: boolean;
  apiUsed?: string;
  createdAt: string;
}

function App() {
  const [shareView, setShareView] = useState<{
    contentType: 'message' | 'photo' | 'voice';
    contentId: string;
  } | null>(null);

  // State management for content
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem('love-legacy-messages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    const storedPhotos = localStorage.getItem('love-legacy-photos');
    if (storedPhotos) {
      setPhotos(JSON.parse(storedPhotos));
    }

    const storedVoiceRecordings = localStorage.getItem('love-legacy-voice-recordings');
    if (storedVoiceRecordings) {
      setVoiceRecordings(JSON.parse(storedVoiceRecordings));
    }

    const storedScheduledItems = localStorage.getItem('love-legacy-scheduled-items');
    if (storedScheduledItems) {
      const parsedItems = JSON.parse(storedScheduledItems).map((item: any) => ({
        ...item,
        scheduledDate: new Date(item.scheduledDate),
        createdAt: new Date(item.createdAt),
      }));
      setScheduledItems(parsedItems);
    }
  }, []);

  // Check for share URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    const shareMatch = path.match(/^\/share\/(message|photo|voice)\/(.+)$/);

    if (shareMatch) {
      const [, contentType, contentId] = shareMatch;
      setShareView({
        contentType: contentType as 'message' | 'photo' | 'voice',
        contentId
      });
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('love-legacy-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('love-legacy-photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('love-legacy-voice-recordings', JSON.stringify(voiceRecordings));
  }, [voiceRecordings]);

  useEffect(() => {
    localStorage.setItem('love-legacy-scheduled-items', JSON.stringify(scheduledItems));
  }, [scheduledItems]);

  // Callback functions for scheduled items
  const handleAddScheduledItem = (item: ScheduledItem) => {
    setScheduledItems(prev => [...prev, item]);
  };

  const handleUpdateScheduledItem = (item: ScheduledItem) => {
    setScheduledItems(prev => prev.map(scheduledItem =>
      scheduledItem.id === item.id ? item : scheduledItem
    ));
  };

  const handleDeleteScheduledItem = (id: string) => {
    setScheduledItems(prev => prev.filter(item => item.id !== id));
  };

  // No tabs needed - single page layout

  // All components rendered in single page layout

  // If we're in share view, show the share component
  if (shareView) {
    return (
      <div className="app">
        <ShareView
          contentType={shareView.contentType}
          contentId={shareView.contentId}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {/* Floating background shapes */}
      <div className="floating-shapes">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-shape"
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="app-container">
        {/* Header */}
        <motion.header
          className="app-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-content">
            <motion.div
              className="logo-container"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="logo-icon" size={48} />
            </motion.div>
            <div className="title-section">
              <h1 className="app-title">Love's Legacy</h1>
              <p className="app-subtitle">Create, Preserve & Share Your Love</p>
            </div>
          </div>
        </motion.header>

        {/* Main Content - Single Page Layout */}
        <motion.main
          className="main-content compact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="features-grid">
            {/* Love Letters Section */}
            <motion.div
              className="feature-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="section-header">
                <MessageCircle size={24} />
                <h3>Love Letters</h3>
              </div>
              <div className="section-content compact">
                <MessageComposer
                  messages={messages}
                  onAddMessage={(message) => setMessages(prev => [...prev, message])}
                  onUpdateMessage={(message) => setMessages(prev => prev.map(msg => msg.id === message.id ? message : msg))}
                  onDeleteMessage={(id) => setMessages(prev => prev.filter(msg => msg.id !== id))}
                />
              </div>
            </motion.div>

            {/* Cherished Moments Section */}
            <motion.div
              className="feature-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="section-header">
                <Camera size={24} />
                <h3>Cherished Moments</h3>
              </div>
              <div className="section-content compact">
                <PhotoManager
                  photos={photos}
                  onAddPhoto={(photo) => setPhotos(prev => [...prev, photo])}
                  onUpdatePhoto={(photo) => setPhotos(prev => prev.map(p => p.id === photo.id ? photo : p))}
                  onDeletePhoto={(id) => setPhotos(prev => prev.filter(p => p.id !== id))}
                />
              </div>
            </motion.div>

            {/* Heartfelt Voice Section */}
            <motion.div
              className="feature-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="section-header">
                <Heart size={24} />
                <h3>Heartfelt Voice</h3>
              </div>
              <div className="section-content compact">
                <VoiceRecorder
                  voiceRecordings={voiceRecordings}
                  onAddVoiceRecording={(recording) => setVoiceRecordings(prev => [...prev, recording])}
                  onUpdateVoiceRecording={(recording) => setVoiceRecordings(prev => prev.map(r => r.id === recording.id ? recording : r))}
                  onDeleteVoiceRecording={(id) => setVoiceRecordings(prev => prev.filter(r => r.id !== id))}
                />
              </div>
            </motion.div>

            {/* Legacy Delivery Section */}
            <motion.div
              className="feature-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="section-header">
                <Calendar size={24} />
                <h3>Legacy Delivery</h3>
              </div>
              <div className="section-content compact">
                <ScheduleManager
                  messages={messages}
                  photos={photos}
                  voiceRecordings={voiceRecordings}
                  scheduledItems={scheduledItems}
                  onAddScheduledItem={handleAddScheduledItem}
                  onUpdateScheduledItem={handleUpdateScheduledItem}
                  onDeleteScheduledItem={handleDeleteScheduledItem}
                />
              </div>
            </motion.div>
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer
          className="app-footer"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="footer-content">
            <p>
              Created with <Heart className="inline-heart" size={16} /> for those who wish to leave
              a legacy of love, cherished memories, and heartfelt messages for generations to come.
            </p>
            <div className="footer-links">
              <Users size={16} />
              <span>Preserving love's legacy, one message at a time</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
