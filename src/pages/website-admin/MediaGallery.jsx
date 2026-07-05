import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function MediaGallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const snap = await getDocs(collection(db, 'media'))
      const mediaList = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setMedia(mediaList.sort((a, b) => new Date(b.createdAt?.toDate() || 0) - new Date(a.createdAt?.toDate() || 0)))
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files) return

    for (let file of files) {
      await uploadSingleFile(file)
    }
  }

  const uploadSingleFile = async (file) => {
    setUploading(true)
    setUploadMessage('Uploading: ' + file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'india_reisen')

      const response = await fetch('https://api.cloudinary.com/v1_1/dl1q4dw72/image/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      
      await addDoc(collection(db, 'media'), {
        title: file.name.split('.')[0],
        url: data.secure_url,
        type: file.type.startsWith('video') ? 'video' : 'image',
        size: file.size,
        createdAt: Timestamp.now()
      })
      
      fetchMedia()
      setUploadMessage('✓ ' + file.name + ' uploaded successfully!')
      setTimeout(() => setUploadMessage(''), 2000)
    } catch (error) {
      console.error('Error:', error)
      setUploadMessage('✗ Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Delete this media?')) {
      try {
        await deleteDoc(doc(db, 'media', id))
        fetchMedia()
      } catch (error) {
        console.error('Error deleting media:', error)
      }
    }
  }

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length
  }

  if (loading) return <div>Loading media gallery...</div>

  return (
    <div>
      <h1>📸 Media Gallery</h1>
      <p>Upload images and videos that will rotate on your homepage</p>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#e7f3ff', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#0077BE' }}>{stats.total}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total Files</p>
        </div>
        <div style={{ background: '#e7ffe7', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#2D6A4F' }}>{stats.images}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Images</p>
        </div>
        <div style={{ background: '#fff0e7', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#FF6B35' }}>{stats.videos}</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Videos</p>
        </div>
      </div>

      {/* Upload Section */}
      <div style={{ background: 'white', border: '2px dashed #d1356f', padding: '30px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#d1356f', marginTop: '0' }}>Upload Media</h2>
        
        {uploadMessage && (
          <div style={{
            background: uploadMessage.includes('✓') ? '#d4edda' : '#f8d7da',
            color: uploadMessage.includes('✓') ? '#155724' : '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            {uploadMessage}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="fileInput" style={{
            display: 'inline-block',
            padding: '15px 30px',
            background: '#d1356f',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            📁 Select Files
          </label>
          <input 
            id="fileInput"
            type="file" 
            multiple
            accept="image/*,video/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </div>
        <small style={{ color: '#666' }}>Supported: JPG, PNG, GIF, MP4, WebM</small>
      </div>

      {/* Gallery Grid */}
      {media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No media yet. Upload images and videos to display on homepage!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {media.map(item => (
            <div key={item.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {/* Thumbnail */}
              <div style={{
                width: '100%',
                height: '150px',
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {item.type === 'video' ? (
                  <>
                    <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', fontSize: '30px' }}>▶️</div>
                  </>
                ) : (
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>
                  {item.type === 'video' ? '🎬 Video' : '🖼️ Image'}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
