import React, { useState, useRef } from 'react'
import { Camera, Upload, Heart, X, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Photo {
  id: string
  file: File
  preview: string
  title: string
  description: string
  uploadedAt: Date
}

const PhotoManager: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const photo: Photo = {
            id: Date.now().toString() + Math.random(),
            file,
            preview: e.target?.result as string,
            title: '',
            description: '',
            uploadedAt: new Date(),
          }
          setPhotos(prev => [...prev, photo])
        }
        reader.readAsDataURL(file)
      }
    })

    setIsUploading(false)
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId))
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(null)
    }
  }

  const handleUpdatePhoto = (photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => prev.map(p =>
      p.id === photoId ? { ...p, ...updates } : p
    ))
  }

  return (
    <div className="photo-manager">
      <div className="manager-header">
        <h2>Precious Memories</h2>
        <p>Upload and organize photos that capture your most cherished moments</p>
      </div>

      {/* Upload Section */}
      <motion.div
        className="upload-section card"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="upload-content">
            {isUploading ? (
              <div className="uploading">
                <div className="spinner"></div>
                <p>Uploading photos...</p>
              </div>
            ) : (
              <>
                <Camera size={48} className="upload-icon" />
                <h3>Share Your Memories</h3>
                <p>Click to upload photos or drag and drop</p>
                <button className="btn btn-primary">
                  <Upload size={20} />
                  Choose Photos
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Photos Grid */}
      {photos.length > 0 && (
        <div className="photos-section">
          <h3>Your Photo Collection ({photos.length})</h3>
          <div className="photos-grid">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="photo-item"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.preview} alt={photo.title || 'Memory'} />
                <div className="photo-overlay">
                  <Heart size={20} />
                  <span>{photo.title || 'Untitled'}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePhoto(photo.id)
                  }}
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="photo-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-image">
                <img src={selectedPhoto.preview} alt={selectedPhoto.title || 'Memory'} />
              </div>

              <div className="modal-details">
                <div className="detail-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Give this memory a title"
                      value={selectedPhoto.title}
                      onChange={(e) => handleUpdatePhoto(selectedPhoto.id, { title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      className="input"
                      placeholder="Share the story behind this memory..."
                      value={selectedPhoto.description}
                      onChange={(e) => handleUpdatePhoto(selectedPhoto.id, { description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="photo-meta">
                    <span>Uploaded: {selectedPhoto.uploadedAt.toLocaleDateString()}</span>
                    <span>File: {selectedPhoto.file.name}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      // Here you would implement scheduling
                      alert('Photo scheduled for future delivery! (Feature coming soon)')
                    }}
                  >
                    Schedule Delivery
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {photos.length === 0 && !isUploading && (
        <div className="empty-state">
          <ImageIcon size={64} />
          <h3>No Photos Yet</h3>
          <p>Upload photos that capture your precious memories and the moments that matter most to you.</p>
        </div>
      )}

      <style jsx>{`
        .photo-manager {
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

        .upload-section {
          margin-bottom: 2rem;
        }

        .upload-area {
          border: 2px dashed rgba(102, 126, 234, 0.3);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-icon {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .upload-content h3 {
          color: #333;
          margin: 0;
        }

        .upload-content p {
          color: #666;
          margin: 0;
        }

        .uploading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .photos-section h3 {
          color: #333;
          margin-bottom: 1rem;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .photo-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          padding: 1rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .photo-overlay span {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .delete-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 107, 107, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .photo-item:hover .delete-btn {
          opacity: 1;
        }

        .photo-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
        }

        .modal-image {
          flex: 1;
          background: #000;
        }

        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .modal-details {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .detail-form {
          flex: 1;
        }

        .photo-meta {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
          font-size: 0.875rem;
          color: #666;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
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

        @media (max-width: 768px) {
          .photos-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .modal-content {
            flex-direction: column;
            max-height: 90vh;
          }

          .modal-image {
            height: 300px;
          }
        }
      `}</style>
    </div>
  )
}

export default PhotoManager
