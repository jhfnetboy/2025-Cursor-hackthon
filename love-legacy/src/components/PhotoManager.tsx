import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image, X, Heart, Camera, Trash2, Eye } from 'lucide-react';

interface Photo {
  id: string;
  file: File;
  url: string;
  title: string;
  description: string;
  uploadedAt: Date;
}

const PhotoManager: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photos from localStorage on component mount
  React.useEffect(() => {
    const savedPhotos = localStorage.getItem('loves-legacy-photos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        // Convert back to Photo objects with File objects (this will fail, so we'll just show empty for now)
        // In a real app, you'd need to store the actual files or use a proper storage solution
        setPhotos([]);
      } catch (error) {
        console.error('Failed to load saved photos:', error);
      }
    }
  }, []);

  // Save photos to localStorage whenever photos change
  React.useEffect(() => {
    // We can't actually save File objects to localStorage
    // In a real implementation, you'd upload to a server or use IndexedDB
    // For now, we'll just keep them in memory
  }, [photos]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            url,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            description: '',
            uploadedAt: new Date()
          };
          setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  const handleDeletePhoto = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this photo? This action cannot be undone.')) {
      setPhotos(prev => prev.filter(photo => photo.id !== id));
    }
  }, []);

  const handleViewPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  }, []);

  const updatePhotoDetails = useCallback((id: string, field: 'title' | 'description', value: string) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  }, []);

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
    <div className="photo-manager">
      <div className="photo-header">
        <div className="header-icon">
          <Camera size={24} />
        </div>
        <div className="header-text">
          <h2>Cherished Moments</h2>
          <p>Upload and preserve your most precious memories and photographs</p>
        </div>
      </div>

      <div className="photo-content">
        {/* Upload Area */}
        <div
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <h3>Upload Your Cherished Photos</h3>
            <p>Drag & drop photos here, or click to browse</p>
            <button
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Photos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <p className="upload-note">Supports JPG, PNG, GIF, and other image formats</p>
          </div>
        </div>

        {/* Photos Grid */}
        {photos.length > 0 && (
          <div className="photos-section">
            <h3>Your Photo Collection ({photos.length})</h3>
            <div className="photos-grid">
              {photos.map(photo => (
                <div key={photo.id} className="photo-card">
                  <div className="photo-image-container">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="photo-image"
                      onClick={() => handleViewPhoto(photo)}
                    />
                    <div className="photo-overlay">
                      <button
                        className="view-btn"
                        onClick={() => handleViewPhoto(photo)}
                        title="View full size"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeletePhoto(photo.id)}
                        title="Delete photo"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="photo-details">
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => updatePhotoDetails(photo.id, 'title', e.target.value)}
                      className="photo-title-input"
                      placeholder="Photo title"
                    />
                    <textarea
                      value={photo.description}
                      onChange={(e) => updatePhotoDetails(photo.id, 'description', e.target.value)}
                      className="photo-description-input"
                      placeholder="Add a description or memory..."
                      rows={2}
                    />
                    <div className="photo-meta">
                      <span className="photo-date">{formatDate(photo.uploadedAt)}</span>
                      <span className="photo-size">
                        {(photo.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="empty-state">
            <Image size={64} />
            <h3>No Photos Yet</h3>
            <p>Start building your collection of cherished memories above.</p>
            <Heart size={24} className="heart-icon" />
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {isModalOpen && selectedPhoto && (
        <div className="photo-modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <X size={24} />
            </button>

            <div className="modal-image-container">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="modal-image"
              />
            </div>

            <div className="modal-details">
              <h3>{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="modal-description">{selectedPhoto.description}</p>
              )}
              <div className="modal-meta">
                <span>Uploaded: {formatDate(selectedPhoto.uploadedAt)}</span>
                <span>Size: {(selectedPhoto.file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoManager;
