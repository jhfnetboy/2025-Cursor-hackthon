import React, { useState } from 'react'
import { Heart, MessageCircle, Camera, Calendar, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import MessageComposer from './components/MessageComposer'
import PhotoManager from './components/PhotoManager'
import VoiceRecorder from './components/VoiceRecorder'
import ScheduleManager from './components/ScheduleManager'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'messages' | 'photos' | 'voice' | 'schedule'>('messages')

  const tabs = [
    { id: 'messages', label: 'Love Letters', icon: MessageCircle, color: 'from-pink-400 to-rose-500' },
    { id: 'photos', label: 'Cherished Moments', icon: Camera, color: 'from-orange-400 to-yellow-500' },
    { id: 'voice', label: 'Heartfelt Voice', icon: Heart, color: 'from-red-400 to-pink-500' },
    { id: 'schedule', label: 'Legacy Delivery', icon: Calendar, color: 'from-purple-400 to-indigo-500' },
  ]

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <motion.div
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="logo-section">
            <Heart className="logo-heart" size={48} />
            <h1 className="app-title">Love's Legacy</h1>
            <p className="app-subtitle">A Legacy of Love and Cherished Memories</p>
          </div>
          <p className="header-description">
            Create beautiful messages, capture precious memories, and schedule them
            to be delivered to your loved ones at the perfect moment.
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Navigation Tabs */}
          <motion.nav
            className="nav-tabs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon size={20} />
                <span>{tab.label}</span>
                <div className={`tab-indicator bg-gradient-to-r ${tab.color}`} />
              </motion.button>
            ))}
          </motion.nav>

          {/* Content Area */}
          <motion.div
            className="content-area"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'messages' && <MessageComposer />}
            {activeTab === 'photos' && <PhotoManager />}
            {activeTab === 'voice' && <VoiceRecorder />}
            {activeTab === 'schedule' && <ScheduleManager />}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Created with <Heart className="inline-heart" size={16} /> for those who wish to leave
            behind messages of love, hope, and cherished memories.
          </p>
          <div className="footer-links">
            <Users size={16} />
            <span>For loved ones, by loved ones</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
