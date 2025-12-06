import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Mic, Image, ArrowLeft, Clock, Mail } from 'lucide-react';

interface ShareViewProps {
  contentType: 'message' | 'photo' | 'voice';
  contentId: string;
}

const ShareView: React.FC<ShareViewProps> = ({ contentType, contentId }) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [contentType, contentId]);

  const loadContent = () => {
    setLoading(true);
    setError(null);

    try {
      let foundContent = null;

      switch (contentType) {
        case 'message':
          const messages = localStorage.getItem('loves-legacy-messages');
          if (messages) {
            const parsed = JSON.parse(messages);
            foundContent = parsed.find((msg: any) => msg.id === contentId);
          }
          break;

        case 'voice':
          const recordings = localStorage.getItem('loves-legacy-voice-recordings');
          if (recordings) {
            const parsed = JSON.parse(recordings);
            foundContent = parsed.find((rec: any) => rec.id === contentId);
          }
          break;

        case 'photo':
          // For photos, we'd need to implement photo storage
          // For now, this is a placeholder
          setError('Photo sharing is not yet implemented');
          break;
      }

      if (foundContent) {
        setContent(foundContent);
      } else {
        setError('Content not found or no longer available');
      }
    } catch (err) {
      setError('Failed to load content');
    }

    setLoading(false);
  };

  const getContentIcon = () => {
    switch (contentType) {
      case 'message': return <MessageCircle size={48} />;
      case 'photo': return <Image size={48} />;
      case 'voice': return <Mic size={48} />;
      default: return <Heart size={48} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="share-loading">
        <div className="loading-spinner"></div>
        <p>Loading your special message...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="share-error">
        <Heart size={64} />
        <h2>Content Not Found</h2>
        <p>{error || 'This content is no longer available or has been removed.'}</p>
        <button
          onClick={() => window.history.back()}
          className="back-btn"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="share-view">
      <div className="share-header">
        <div className="share-icon">
          {getContentIcon()}
        </div>
        <div className="share-meta">
          <h1>A Special Message for You</h1>
          <div className="share-details">
            <span className="content-type">
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </span>
            <span className="separator">•</span>
            <span className="date">
              <Clock size={14} />
              {formatDate(content.createdAt || content.recordedAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="share-content">
        {contentType === 'message' && (
          <div className="message-content">
            <div className="message-header">
              <h2>{content.title}</h2>
              {content.recipient && (
                <p className="recipient">To: {content.recipient}</p>
              )}
            </div>
            <div className="message-body">
              {content.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {contentType === 'voice' && (
          <div className="voice-content">
            <div className="voice-header">
              <h2>{content.title}</h2>
              <div className="voice-meta">
                <span>Duration: {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {content.transcription && (
              <div className="transcription-section">
                <h3>Transcription:</h3>
                <div className="transcription-text">
                  {content.transcription}
                </div>
                {content.transcriptionError && (
                  <div className="transcription-note">
                    <small>* This transcription was created using demo mode</small>
                  </div>
                )}
              </div>
            )}

            <div className="voice-player">
              <audio controls>
                <source src={content.url} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
              <p className="player-note">
                Click play to hear this special voice message
              </p>
            </div>
          </div>
        )}

        {contentType === 'photo' && (
          <div className="photo-content">
            <h2>Photo: {content.title}</h2>
            <p>Photo sharing is coming soon...</p>
          </div>
        )}
      </div>

      <div className="share-footer">
        <div className="footer-message">
          <Heart className="footer-heart" size={20} />
          <span>This message was shared with love through Love's Legacy</span>
          <Heart className="footer-heart" size={20} />
        </div>
        <button
          onClick={() => window.history.back()}
          className="back-btn"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>
    </div>
  );
};

export default ShareView;
