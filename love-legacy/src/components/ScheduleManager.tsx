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
  emailId?: string; // ID of the sent email (for tracking)
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
  const [selectedContents, setSelectedContents] = useState<Array<{
    id: string;
    type: 'message' | 'photo' | 'voice';
    title: string;
  }>>([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
    emailId?: string;
  } | null>(null);

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

  // Handle content selection toggle
  const toggleContentSelection = (content: { id: string; type: 'message' | 'photo' | 'voice'; title: string }) => {
    setSelectedContents(prev => {
      const isSelected = prev.some(item => item.id === content.id);
      if (isSelected) {
        return prev.filter(item => item.id !== content.id);
      } else if (prev.length < 3) { // Limit to 3 items
        return [...prev, content];
      } else {
        alert('You can select up to 3 items for delivery.');
        return prev;
      }
    });
  };


  const handleScheduleItem = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    console.log('Schedule button clicked', { selectedContents, recipientEmail, scheduledDate, scheduledTime });

    if (selectedContents.length === 0) {
      alert('Please select at least one content to send.');
      return;
    }

    if (selectedContents.length > 3) {
      alert('You can select up to 3 items for delivery.');
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

    setIsSending(true);
    setSendResult(null);

    try {
      // Generate share links for selected content
      const contentLinks = selectedContents.map(content => {
        const shareUrl = `${window.location.origin}/share/${content.type}/${content.id}`;
        return {
          type: content.type,
          title: content.title,
          url: shareUrl
        };
      });

      // Send email via backend API
      const response = await fetch('http://localhost:3000/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipientEmail,
          subject: `Love's Legacy: ${selectedContents.length} precious message${selectedContents.length > 1 ? 's' : ''} from your loved one`,
          contentLinks: contentLinks,
          scheduledDate: scheduledDateTime.toISOString()
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send email');
      }

      // Create scheduled items for each selected content
      selectedContents.forEach((content, index) => {
        const newScheduledItem: ScheduledItem = {
          id: `${result.email.id}-${index}`,
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          recipientEmail,
          scheduledDate: scheduledDateTime,
          status: 'sent',
          createdAt: new Date(),
          emailId: result.email.id
        };

        console.log('Adding scheduled item:', newScheduledItem);
        onAddScheduledItem(newScheduledItem);
      });

      setSendResult({
        success: true,
        message: `✉️ Email sent successfully! Your loved one will receive ${selectedContents.length} precious message${selectedContents.length > 1 ? 's' : ''} at the scheduled time.`,
        emailId: result.email.id
      });

      // Reset form after successful send
      setTimeout(() => {
        setSelectedContents([]);
        setRecipientEmail('');
        setScheduledDate('');
        setScheduledTime('');
        setShowScheduleForm(false);
        setSendResult(null);
      }, 3000);

    } catch (error) {
      console.error('Email sending failed:', error);
      setSendResult({
        success: false,
        message: `❌ Failed to send email: ${error.message}`
      });

      // Still create the scheduled items but mark as failed
      selectedContents.forEach((content, index) => {
        const newScheduledItem: ScheduledItem = {
          id: `${Date.now()}-failed-${index}`,
          contentId: content.id,
          contentType: content.type,
          title: content.title,
          recipientEmail,
          scheduledDate: scheduledDateTime,
          status: 'failed',
          createdAt: new Date()
        };

        onAddScheduledItem(newScheduledItem);
      });
    } finally {
      setIsSending(false);
    }
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
              <label>Select Content to Send (up to 3 items)</label>
              <div className="content-selector">
                {availableContent.length === 0 ? (
                  <p className="no-content">No content available. Create some messages, photos, or voice recordings first.</p>
                ) : (
                  <div className="content-list">
                    {availableContent.map(content => {
                      const isSelected = selectedContents.some(item => item.id === content.id);
                      return (
                        <div
                          key={content.id}
                          className={`content-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleContentSelection({
                            id: content.id,
                            type: content.type,
                            title: content.title
                          })}
                        >
                          <div className="content-checkbox">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by onClick
                              disabled={!isSelected && selectedContents.length >= 3}
                            />
                          </div>
                          <div className="content-icon">
                            {getContentTypeIcon(content.type)}
                          </div>
                          <div className="content-info">
                            <div className="content-title">{content.title}</div>
                            <div className="content-preview">{content.preview}</div>
                          </div>
                          {isSelected && (
                            <div className="selected-indicator">✓</div>
                          )}
                        </div>
                      );
                    })}
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
              <div className="validation-item" style={{ color: selectedContents.length > 0 ? '#4CAF50' : '#F44336' }}>
                {selectedContents.length > 0 ? '✓' : '✗'} Content selected: {selectedContents.length} item{selectedContents.length !== 1 ? 's' : ''} {selectedContents.length > 0 && `(max 3)`}
              </div>
              <div className="validation-item" style={{ color: recipientEmail ? '#4CAF50' : '#F44336' }}>
                {recipientEmail ? '✓' : '✗'} Email: {recipientEmail || 'Not entered'}
              </div>
              <div className="validation-item" style={{ color: (scheduledDate && scheduledTime) ? '#4CAF50' : '#F44336' }}>
                {(scheduledDate && scheduledTime) ? '✓' : '✗'} Date/Time: {scheduledDate && scheduledTime ? `${scheduledDate} ${scheduledTime}` : 'Not set'}
              </div>
            </div>

            {/* Send Status */}
            {isSending && (
              <div className="send-status sending">
                <div className="status-icon">⏳</div>
                <div className="status-text">Sending email...</div>
              </div>
            )}

            {sendResult && (
              <div className={`send-status ${sendResult.success ? 'success' : 'error'}`}>
                <div className="status-icon">{sendResult.success ? '✅' : '❌'}</div>
                <div className="status-text">{sendResult.message}</div>
                {sendResult.emailId && (
                  <div className="email-id">Email ID: {sendResult.emailId}</div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="schedule-submit-btn"
                disabled={selectedContents.length === 0 || !recipientEmail || !scheduledDate || !scheduledTime || isSending}
                title={selectedContents.length === 0 || !recipientEmail || !scheduledDate || !scheduledTime ?
                  "Please fill in all required fields: select content, enter email, and choose date/time" :
                  "Schedule delivery of selected content"}
              >
                <Send size={18} />
                {isSending ? 'Sending...' : 'Schedule Delivery'}
              </button>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="cancel-btn"
                disabled={isSending}
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

// Add styles for the multi-select content items
const styles = `
.content-item {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.content-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0,123,255,0.1);
}

.content-item.selected {
  border-color: #28a745;
  background: #f8fff9;
}

.content-checkbox {
  margin-right: 0.8rem;
}

.content-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #28a745;
}

.content-checkbox input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.content-icon {
  margin-right: 0.8rem;
  color: #666;
}

.content-info {
  flex: 1;
}

.content-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.2rem;
}

.content-preview {
  font-size: 0.85rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-indicator {
  color: #28a745;
  font-weight: bold;
  font-size: 1.2rem;
}

.no-content {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.send-status {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
}

.send-status.sending {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.send-status.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.send-status.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.status-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.status-text {
  flex: 1;
  line-height: 1.4;
}

.email-id {
  font-size: 0.85rem;
  color: inherit;
  opacity: 0.8;
  font-family: monospace;
  margin-top: 0.5rem;
}
`;

// Inject styles into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
