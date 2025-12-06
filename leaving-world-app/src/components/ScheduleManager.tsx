import React, { useState } from 'react'
import { Calendar, Clock, Send, Heart, MessageCircle, Image, Mic } from 'lucide-react'
import { motion } from 'framer-motion'

interface ScheduledItem {
  id: string
  type: 'message' | 'photo' | 'voice'
  title: string
  scheduledFor: Date
  recipient: string
  status: 'pending' | 'sent' | 'failed'
  createdAt: Date
}

const ScheduleManager: React.FC = () => {
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    {
      id: '1',
      type: 'message',
      title: 'A Letter to My Family',
      scheduledFor: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      recipient: 'My Family',
      status: 'pending',
      createdAt: new Date(),
    },
    {
      id: '2',
      type: 'photo',
      title: 'Our Wedding Day',
      scheduledFor: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      recipient: 'Sarah',
      status: 'pending',
      createdAt: new Date(),
    }
  ])

  const [newSchedule, setNewSchedule] = useState({
    type: 'message' as 'message' | 'photo' | 'voice',
    title: '',
    recipient: '',
    scheduledDate: '',
    scheduledTime: '',
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle size={20} />
      case 'photo': return <Image size={20} />
      case 'voice': return <Mic size={20} />
      default: return <Heart size={20} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'message': return 'from-pink-400 to-rose-400'
      case 'photo': return 'from-purple-400 to-pink-400'
      case 'voice': return 'from-blue-400 to-purple-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'sent': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleSchedule = () => {
    if (!newSchedule.title || !newSchedule.recipient || !newSchedule.scheduledDate || !newSchedule.scheduledTime) {
      alert('Please fill in all fields')
      return
    }

    const scheduledDateTime = new Date(`${newSchedule.scheduledDate}T${newSchedule.scheduledTime}`)

    if (scheduledDateTime <= new Date()) {
      alert('Please select a future date and time')
      return
    }

    const scheduledItem: ScheduledItem = {
      id: Date.now().toString(),
      type: newSchedule.type,
      title: newSchedule.title,
      scheduledFor: scheduledDateTime,
      recipient: newSchedule.recipient,
      status: 'pending',
      createdAt: new Date(),
    }

    setScheduledItems(prev => [...prev, scheduledItem])

    // Reset form
    setNewSchedule({
      type: 'message',
      title: '',
      recipient: '',
      scheduledDate: '',
      scheduledTime: '',
    })

    alert('Message scheduled successfully! It will be delivered at the specified time.')
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeUntilDelivery = (scheduledFor: Date) => {
    const now = new Date()
    const diff = scheduledFor.getTime() - now.getTime()

    if (diff <= 0) return 'Ready to deliver'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days} days, ${hours} hours`
    if (hours > 0) return `${hours} hours, ${minutes} minutes`
    return `${minutes} minutes`
  }

  return (
    <div className="schedule-manager">
      <div className="manager-header">
        <h2>Future Delivery</h2>
        <p>Schedule when your messages, photos, and voice recordings will be delivered to your loved ones</p>
      </div>

      {/* Schedule New Item */}
      <motion.div
        className="schedule-form card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Schedule New Delivery</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Content Type</label>
            <select
              className="input"
              value={newSchedule.type}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="message">📝 Message</option>
              <option value="photo">📸 Photo</option>
              <option value="voice">🎤 Voice Message</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., Birthday Message for Sarah"
              value={newSchedule.title}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Recipient</label>
            <input
              type="text"
              className="input"
              placeholder="e.g., My Daughter, Family Group"
              value={newSchedule.recipient}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, recipient: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              className="input"
              value={newSchedule.scheduledDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledDate: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label>Delivery Time</label>
            <input
              type="time"
              className="input"
              value={newSchedule.scheduledTime}
              onChange={(e) => setNewSchedule(prev => ({ ...prev, scheduledTime: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-actions">
          <motion.button
            className="btn btn-primary schedule-btn"
            onClick={handleSchedule}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={20} />
            Schedule Delivery
          </motion.button>
        </div>
      </motion.div>

      {/* Scheduled Items */}
      <div className="scheduled-items">
        <h3>Scheduled Deliveries ({scheduledItems.length})</h3>

        {scheduledItems.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>No Scheduled Deliveries</h3>
            <p>Schedule messages, photos, and voice recordings to be delivered at future dates.</p>
          </div>
        ) : (
          <div className="items-grid">
            {scheduledItems.map((item) => (
              <motion.div
                key={item.id}
                className="scheduled-item card"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="item-header">
                  <div className={`item-type bg-gradient-to-r ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="item-info">
                    <h4>{item.title}</h4>
                    <p className="recipient">To: {item.recipient}</p>
                  </div>
                  <div className={`status-badge ${getStatusColor(item.status)}`}>
                    {item.status}
                  </div>
                </div>

                <div className="item-schedule">
                  <div className="schedule-time">
                    <Clock size={16} />
                    <span>{formatDateTime(item.scheduledFor)}</span>
                  </div>
                  <div className="time-remaining">
                    <span className="label">Delivers in:</span>
                    <span className="value">{getTimeUntilDelivery(item.scheduledFor)}</span>
                  </div>
                </div>

                <div className="item-actions">
                  <button className="btn-icon edit-btn">
                    ✏️ Edit
                  </button>
                  <button className="btn-icon preview-btn">
                    👁️ Preview
                  </button>
                  <button className="btn-icon delete-btn">
                    🗑️ Delete
                  </button>
                </div>

                <div className="item-meta">
                  Scheduled: {item.createdAt.toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .schedule-manager {
          max-width: 1000px;
          margin: 0 auto;
        }

        .manager-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .manager-header h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .manager-header p {
          color: #666;
        }

        .schedule-form {
          margin-bottom: 2rem;
        }

        .schedule-form h3 {
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }

        .form-actions {
          text-align: center;
        }

        .schedule-btn {
          font-size: 1.1rem;
          padding: 1rem 2rem;
        }

        .scheduled-items h3 {
          color: #333;
          margin-bottom: 1rem;
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

        .items-grid {
          display: grid;
          gap: 1rem;
        }

        .scheduled-item {
          transition: all 0.3s ease;
        }

        .item-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .item-type {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          margin: 0 0 0.25rem 0;
          color: #333;
          font-size: 1.1rem;
        }

        .recipient {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .item-schedule {
          background: rgba(102, 126, 234, 0.05);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .schedule-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }

        .time-remaining {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .time-remaining .label {
          color: #666;
        }

        .time-remaining .value {
          color: #667eea;
          font-weight: 600;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .btn-icon {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .btn-icon:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .delete-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
        }

        .item-meta {
          font-size: 0.75rem;
          color: #888;
          text-align: right;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .item-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .item-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default ScheduleManager
