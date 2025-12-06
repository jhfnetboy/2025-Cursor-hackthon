import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, Send, Trash2, Eye, Heart, MessageCircle, Mic, Image } from 'lucide-react';

interface ScheduledItem {
  id: string;
  contentId: string; // ID of the original content
  contentType: 'message' | 'photo' | 'voice';
  title: string;
  recipientEmail: string;
  scheduledDate: Date;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
}

interface MessageItem {
  id: string;
  title: string;
  content: string;
  recipient?: string;
  createdAt: string;
  updatedAt: string;
}

interface PhotoItem {
  id: string;
  title: string;
  description?: string;
  url: string; // Base64 encoded image
  fileSize: number;
  createdAt: string;
}

interface VoiceRecording {
  id: string;
  title: string;
  audioUrl: string; // Blob URL or base64
  transcription: string;
  transcriptionError?: boolean;
  apiUsed?: string;
  createdAt: string;
}

interface ScheduleManagerProps {
  messages: MessageItem[];
  photos: PhotoItem[];
  voiceRecordings: VoiceRecording[];
  scheduledItems: ScheduledItem[];
  onAddScheduledItem: (item: ScheduledItem) => void;
  onUpdateScheduledItem: (item: ScheduledItem) => void;
  onDeleteScheduledItem: (id: string) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  messages,
  photos,
  voiceRecordings,
  scheduledItems,
  onAddScheduledItem,
  onUpdateScheduledItem,
  onDeleteScheduledItem,
}) => {
  const [selectedContent, setSelectedContent] = useState<{
    id: string;
    type: 'message' | 'photo' | 'voice';
    title: string;
  } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Generate available content from props
  const availableContent = React.useMemo(() => [
    ...messages.map(msg => ({
      id: msg.id,
      type: 'message' as const,
      title: msg.title,
      preview: msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '')
    })),
    ...photos.map(photo => ({
      id: photo.id,
      type: 'photo' as const,
      title: photo.title,
      preview: photo.description || 'Photo'
    })),
    ...voiceRecordings.map(voice => ({
      id: voice.id,
      type: 'voice' as const,
      title: voice.title,
      preview: voice.transcription.substring(0, 100) + (voice.transcription.length > 100 ? '...' : '')
    }))
  ], [messages, photos, voiceRecordings]);

  const handleScheduleItem = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    console.log('Schedule button clicked', { selectedContent, recipientEmail, scheduledDate, scheduledTime });

    if (!selectedContent) {
      alert('Please select content to send.');
      return;
    }

    if (!recipientEmail) {
      alert('Please enter recipient email address.');
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      alert('Please select delivery date and time.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Create scheduled date/time
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

    if (scheduledDateTime <= new Date()) {
      alert('Please select a future date and time.');
      return;
    }

    const newScheduledItem: ScheduledItem = {
      id: Date.now().toString(),
      contentId: selectedContent.id,
      contentType: selectedContent.type,
      title: selectedContent.title,
      recipientEmail,
      scheduledDate: scheduledDateTime,
      status: 'pending',
      createdAt: new Date()
    };

    console.log('Creating scheduled item:', newScheduledItem);

    setScheduledItems(prev => [...prev, newScheduledItem]);

    // Reset form
    setSelectedContent(null);
    setRecipientEmail('');
    setScheduledDate('');
    setScheduledTime('');
    setShowScheduleForm(false);

    alert('Content scheduled successfully! It will be sent at the specified time.');
  };

  const handleDeleteScheduled = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled delivery?')) {
      setScheduledItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle size={16} />;
      case 'photo': return <Image size={16} />;
      case 'voice': return <Mic size={16} />;
      default: return <Heart size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'rgba(248, 181, 0, 0.8)'; // Orange
      case 'sent': return 'rgba(76, 175, 80, 0.8)'; // Green
      case 'failed': return 'rgba(244, 67, 54, 0.8)'; // Red
      default: return 'rgba(255, 255, 255, 0.6)';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="schedule-manager">
      <div className="schedule-header">
        <div className="header-icon">
          <Calendar size={24} />
        </div>
        <div className="header-text">
          <h2>Legacy Delivery</h2>
          <p>Schedule your messages to be delivered at the perfect moment</p>
        </div>
      </div>

      <div className="schedule-content">
        {/* Schedule New Item Button */}
        <div className="schedule-actions">
          <button
            className="schedule-btn"
            onClick={() => setShowScheduleForm(!showScheduleForm)}
          >
            <Send size={18} />
            Schedule New Delivery
          </button>
        </div>

        {/* Schedule Form */}
        {showScheduleForm && (
          <form className="schedule-form" onSubmit={handleScheduleItem}>
            <h3>Schedule Content Delivery</h3>

            {/* Content Selection */}
            <div className="form-group">
              <label>Select Content to Send</label>
              <div className="content-selector">
                {availableContent.length === 0 ? (
                  <p className="no-content">No content available. Create some messages, photos, or voice recordings first.</p>
                ) : (
                  <div className="content-list">
                    {availableContent.map(content => (
                      <div
                        key={content.id}
                        className={`content-item ${selectedContent?.id === content.id ? 'selected' : ''}`}
                        onClick={() => setSelectedContent({
                          id: content.id,
                          type: content.type,
                          title: content.title
                        })}
                      >
                        <div className="content-icon">
                          {getContentTypeIcon(content.type)}
                        </div>
                        <div className="content-info">
                          <div className="content-title">{content.title}</div>
                          <div className="content-preview">{content.preview}</div>
                        </div>
                        {selectedContent?.id === content.id && (
                          <div className="selected-indicator">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recipient Email */}
            <div className="form-group">
              <label htmlFor="recipient-email">Recipient Email *</label>
              <input
                id="recipient-email"
                type="email"
                placeholder="lovedone@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="email-input"
              />
            </div>

            {/* Date and Time */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="schedule-date">Delivery Date *</label>
                <input
                  id="schedule-date"
                  type="date"
                  min={minDate}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="date-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="schedule-time">Delivery Time *</label>
                <input
                  id="schedule-time"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="time-input"
                />
              </div>
            </div>

            {/* Form Validation Summary */}
            <div className="form-validation">
              <div className="validation-item" style={{ color: selectedContent ? '#4CAF50' : '#F44336' }}>
                {selectedContent ? '✓' : '✗'} Content selected: {selectedContent?.title || 'None'}
              </div>
              <div className="validation-item" style={{ color: recipientEmail ? '#4CAF50' : '#F44336' }}>
                {recipientEmail ? '✓' : '✗'} Email: {recipientEmail || 'Not entered'}
              </div>
              <div className="validation-item" style={{ color: (scheduledDate && scheduledTime) ? '#4CAF50' : '#F44336' }}>
                {(scheduledDate && scheduledTime) ? '✓' : '✗'} Date/Time: {scheduledDate && scheduledTime ? `${scheduledDate} ${scheduledTime}` : 'Not set'}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="schedule-submit-btn"
                disabled={!selectedContent || !recipientEmail || !scheduledDate || !scheduledTime}
                title={!selectedContent || !recipientEmail || !scheduledDate || !scheduledTime ?
                  "Please fill in all required fields: select content, enter email, and choose date/time" :
                  "Schedule delivery of this content"}
              >
                <Send size={18} />
                Schedule Delivery
              </button>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Scheduled Items List */}
        {scheduledItems.length > 0 && (
          <div className="scheduled-items">
            <h3>Scheduled Deliveries ({scheduledItems.length})</h3>
            <div className="items-list">
              {scheduledItems.map(item => (
                <div key={item.id} className="scheduled-item">
                  <div className="item-header">
                    <div className="item-icon">
                      {getContentTypeIcon(item.contentType)}
                    </div>
                    <div className="item-info">
                      <div className="item-title">{item.title}</div>
                      <div className="item-meta">
                        To: {item.recipientEmail} • {formatDateTime(item.scheduledDate)}
                      </div>
                    </div>
                    <div className="item-status">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>
                    <button
                      className="delete-scheduled-btn"
                      onClick={() => handleDeleteScheduled(item.id)}
                      title="Delete scheduled delivery"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="item-actions">
                    <button className="view-link-btn">
                      <Eye size={14} />
                      View Delivery Link
                    </button>
                    <div className="delivery-link">
                      {`http://localhost:5173/share/${item.contentType}/${item.contentId}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {scheduledItems.length === 0 && !showScheduleForm && (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No Scheduled Deliveries</h3>
            <p>Schedule your messages, photos, and voice recordings to be delivered at the perfect moment.</p>
            <Heart size={24} className="heart-icon" />
          </div>
        )}

        {/* Info Section */}
        <div className="schedule-info">
          <div className="info-box">
            <h4>📧 How It Works</h4>
            <ul>
              <li>Select content you've created (messages, photos, or voice recordings)</li>
              <li>Enter the recipient's email address</li>
              <li>Choose the date and time for delivery</li>
              <li>The system will send an email with a direct link to your content</li>
              <li>The recipient can view your message without needing an account</li>
            </ul>
          </div>

          <div className="info-box">
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>This is a demo implementation - emails are not actually sent</li>
              <li>In a production app, this would integrate with an email service</li>
              <li>Scheduled deliveries are stored locally in your browser</li>
              <li>Links are shareable and can be accessed by anyone with the URL</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
