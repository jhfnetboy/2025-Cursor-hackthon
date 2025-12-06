import React, { useState } from 'react'
import { Heart, Save, Send, Edit3 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Message {
  id: string
  title: string
  content: string
  recipient: string
  createdAt: Date
  scheduledFor?: Date
}

const MessageComposer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      title: 'A Letter to My Family',
      content: 'My dearest family,\n\nAs I write this, I want you to know how much I love each and every one of you. The memories we\'ve created together are the most precious treasures of my life...',
      recipient: 'My Family',
      createdAt: new Date(),
    }
  ])

  const [currentMessage, setCurrentMessage] = useState({
    title: '',
    content: '',
    recipient: ''
  })

  const [isComposing, setIsComposing] = useState(false)

  const handleSaveMessage = () => {
    if (!currentMessage.title.trim() || !currentMessage.content.trim()) {
      alert('Please fill in both title and message content')
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      title: currentMessage.title,
      content: currentMessage.content,
      recipient: currentMessage.recipient || 'My Loved Ones',
      createdAt: new Date(),
    }

    setMessages(prev => [newMessage, ...prev])
    setCurrentMessage({ title: '', content: '', recipient: '' })
    setIsComposing(false)
  }

  const placeholderMessages = [
    "My dearest [name], as I look back on our life together...",
    "To my wonderful family, the greatest gift I've ever received...",
    "My precious children, you've brought so much joy to my life...",
    "To my loving partner, our journey together has been beautiful...",
    "Dear friends, you've been the light in my darkest moments..."
  ]

  return (
    <div className="message-composer">
      <div className="composer-header">
        <h2>Messages of Love</h2>
        <p>Create heartfelt messages that will be delivered to your loved ones</p>

        {!isComposing && (
          <motion.button
            className="btn btn-primary compose-btn"
            onClick={() => setIsComposing(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 size={20} />
            Write New Message
          </motion.button>
        )}
      </div>

      {isComposing && (
        <motion.div
          className="compose-form card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="form-group">
            <label htmlFor="title">Message Title</label>
            <input
              id="title"
              type="text"
              className="input"
              placeholder="e.g., A Letter to My Children"
              value={currentMessage.title}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient">Intended Recipient</label>
            <input
              id="recipient"
              type="text"
              className="input"
              placeholder="e.g., My Family, Sarah, Children"
              value={currentMessage.recipient}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, recipient: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Your Message</label>
            <textarea
              id="content"
              className="input message-textarea"
              placeholder={placeholderMessages[Math.floor(Math.random() * placeholderMessages.length)]}
              value={currentMessage.content}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, content: e.target.value }))}
              rows={8}
            />
            <div className="char-count">
              {currentMessage.content.length} characters
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setIsComposing(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveMessage}
            >
              <Save size={20} />
              Save Message
            </button>
          </div>
        </motion.div>
      )}

      {!isComposing && (
        <div className="messages-list">
          <h3>Your Messages ({messages.length})</h3>
          {messages.length === 0 ? (
            <div className="empty-state">
              <Heart size={48} />
              <p>No messages yet. Start by writing your first message of love.</p>
            </div>
          ) : (
            <div className="messages-grid">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className="message-card card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="message-header">
                    <h4>{message.title}</h4>
                    <span className="recipient-badge">To: {message.recipient}</span>
                  </div>
                  <div className="message-preview">
                    {message.content.substring(0, 150)}...
                  </div>
                  <div className="message-meta">
                    <span>Created: {message.createdAt.toLocaleDateString()}</span>
                    <div className="message-actions">
                      <button className="btn-icon">
                        <Edit3 size={16} />
                      </button>
                      <button className="btn-icon">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .message-composer {
          max-width: 800px;
          margin: 0 auto;
        }

        .composer-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .composer-header h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .composer-header p {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .compose-btn {
          margin-top: 1rem;
        }

        .compose-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .message-textarea {
          resize: vertical;
          min-height: 200px;
          font-family: inherit;
        }

        .char-count {
          text-align: right;
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .messages-list h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .empty-state svg {
          color: #ddd;
          margin-bottom: 1rem;
        }

        .messages-grid {
          display: grid;
          gap: 1rem;
        }

        .message-card {
          transition: all 0.3s ease;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .message-header h4 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }

        .recipient-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .message-preview {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .message-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #888;
        }

        .message-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .btn-icon:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        @media (max-width: 768px) {
          .composer-header h2 {
            font-size: 1.5rem;
          }

          .message-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .message-meta {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

export default MessageComposer
