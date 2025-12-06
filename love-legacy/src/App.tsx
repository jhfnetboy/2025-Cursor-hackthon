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

function App() {
  const [shareView, setShareView] = useState<{
    contentType: 'message' | 'photo' | 'voice';
    contentId: string;
  } | null>(null);

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
                <MessageComposer />
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
                <PhotoManager />
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
                <VoiceRecorder />
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
                <ScheduleManager />
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
