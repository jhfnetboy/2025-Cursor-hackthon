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
  const [activeTab, setActiveTab] = useState<'messages' | 'photos' | 'voice' | 'schedule'>('messages');
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

  const tabs = [
    { id: 'messages', label: 'Love Letters', icon: MessageCircle, color: 'from-pink-400 to-rose-500' },
    { id: 'photos', label: 'Cherished Moments', icon: Camera, color: 'from-orange-400 to-yellow-500' },
    { id: 'voice', label: 'Heartfelt Voice', icon: Heart, color: 'from-red-400 to-pink-500' },
    { id: 'schedule', label: 'Legacy Delivery', icon: Calendar, color: 'from-purple-400 to-indigo-500' },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'messages':
        return <MessageComposer />;
      case 'photos':
        return <PhotoManager />;
      case 'voice':
        return <VoiceRecorder />;
      case 'schedule':
        return <ScheduleManager />;
      default:
        return <MessageComposer />;
    }
  };

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
              <p className="app-subtitle">A Legacy of Love and Cherished Memories</p>
            </div>
          </div>
        </motion.header>

        {/* Navigation */}
        <motion.nav
          className="nav-tabs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
              <div className={`tab-indicator bg-gradient-to-r ${tab.color}`} />
            </motion.button>
          ))}
        </motion.nav>

        {/* Main Content */}
        <motion.main
          className="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="content-area"
            >
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
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
