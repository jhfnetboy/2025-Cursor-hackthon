import React, { useState, useRef, useEffect } from 'react';
import { Save, Heart, Edit3, Trash2, Send, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  title: string;
  content: string;
  recipient: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageComposer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Partial<Message>>({
    title: '',
    content: '',
    recipient: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSavedMessages, setShowSavedMessages] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('loves-legacy-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
          updatedAt: new Date(msg.updatedAt)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('loves-legacy-messages', JSON.stringify(messages));
  }, [messages]);

  const handleSaveMessage = () => {
    if (!currentMessage.title?.trim() || !currentMessage.content?.trim()) {
      alert('Please fill in both title and message content.');
      return;
    }

    const now = new Date();

    if (isEditing && editingId) {
      // Update existing message
      setMessages(prev => prev.map(msg =>
        msg.id === editingId
          ? { ...msg, ...currentMessage, updatedAt: now }
          : msg
      ));
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Create new message
      const newMessage: Message = {
        id: Date.now().toString(),
        title: currentMessage.title,
        content: currentMessage.content,
        recipient: currentMessage.recipient || '',
        createdAt: now,
        updatedAt: now
      };
      setMessages(prev => [...prev, newMessage]);
    }

    // Reset form
    setCurrentMessage({ title: '', content: '', recipient: '' });
  };

  const handleEditMessage = (message: Message) => {
    setCurrentMessage({
      title: message.title,
      content: message.content,
      recipient: message.recipient
    });
    setIsEditing(true);
    setEditingId(message.id);
    setShowSavedMessages(false);

    // Focus on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }, 100);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      setMessages(prev => prev.filter(msg => msg.id !== id));

      // If we're editing this message, reset the form
      if (editingId === id) {
        setIsEditing(false);
        setEditingId(null);
        setCurrentMessage({ title: '', content: '', recipient: '' });
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setCurrentMessage({ title: '', content: '', recipient: '' });
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
    <div className="message-composer">
      <div className="composer-header">
        <div className="header-icon">
          <MessageSquare size={24} />
        </div>
        <div className="header-text">
          <h2>Love Letters</h2>
          <p>Write heartfelt messages that will touch hearts for generations</p>
        </div>
      </div>

      <div className="composer-content">
        {/* Message Form */}
        <div className="message-form">
          <div className="form-group">
            <label htmlFor="message-title">Message Title *</label>
            <input
              id="message-title"
              type="text"
              placeholder="e.g., A Letter to My Future Grandchildren"
              value={currentMessage.title || ''}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, title: e.target.value }))}
              className="title-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipient">To Whom (Optional)</label>
            <input
              id="recipient"
              type="text"
              placeholder="e.g., My beloved family, Future generations..."
              value={currentMessage.recipient || ''}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, recipient: e.target.value }))}
              className="recipient-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message-content">Your Message *</label>
            <textarea
              id="message-content"
              ref={textareaRef}
              placeholder="Pour your heart out here... Share your love, wisdom, dreams, and everything you want your loved ones to know..."
              value={currentMessage.content || ''}
              onChange={(e) => setCurrentMessage(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              className="content-textarea"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={handleSaveMessage}
              className="save-btn"
              disabled={!currentMessage.title?.trim() || !currentMessage.content?.trim()}
            >
              <Save size={18} />
              {isEditing ? 'Update Message' : 'Save Message'}
            </button>

            {isEditing && (
              <button onClick={handleCancelEdit} className="cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Saved Messages Toggle */}
        <div className="messages-toggle">
          <button
            onClick={() => setShowSavedMessages(!showSavedMessages)}
            className="toggle-btn"
          >
            <Heart size={18} />
            {showSavedMessages ? 'Hide' : 'View'} Saved Messages ({messages.length})
          </button>
        </div>

        {/* Saved Messages List */}
        {showSavedMessages && (
          <div className="saved-messages">
            <h3>Your Love Letters</h3>
            {messages.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} />
                <p>No messages saved yet. Start writing your first love letter above.</p>
              </div>
            ) : (
              <div className="messages-grid">
                {messages.map(message => (
                  <div key={message.id} className="message-card">
                    <div className="message-header">
                      <h4>{message.title}</h4>
                      {message.recipient && (
                        <span className="recipient-tag">To: {message.recipient}</span>
                      )}
                    </div>

                    <div className="message-content">
                      {message.content.length > 200
                        ? `${message.content.substring(0, 200)}...`
                        : message.content
                      }
                    </div>

                    <div className="message-meta">
                      <span className="date">
                        {formatDate(message.updatedAt)}
                      </span>
                      <div className="message-actions">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="edit-btn"
                          title="Edit message"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="delete-btn"
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComposer;
