import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function MediaGallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadMessage, setUploadMessage] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [categories, setCategories] = useState(['General', 'Hero Images', 'Blog Posts', 'Journeys', 'Team', 'Reviews'])

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const snap = await getDocs(collection(db, 'media'))
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
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

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          
          try {
            await addDoc(collection(db, 'media'), {
              title: file.name.split('.')[0],
              url: response.secure_url,
              thumbUrl: response.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
              category: selectedCategory,
              type: file.type.startsWith('video') ? 'video' : 'image',
              size: file.size,
              createdAt: Timestamp.now()
            })
            
            fetchMedia()
            setUploadMessage('✓ ' + file.name + ' uploaded successfully!')
            setUploadProgress(0)
            setTimeout(() => setUploadMessage(''), 2000)
          } catch (err) {
            console.error('Error saving to database:', err)
            setUploadMessage('✗ Error saving file')
          }
        }
      })

      xhr.addEventListener('error', () => {
        setUploadMessage('✗ Upload failed')
      })

      xhr.open('POST', 'https://api.cloudinary.com/v1_1/dl1q4dw72/image/upload')
      xhr.send(formData)
    } catch (error) {
      console.error('Error:', error)
      setUploadMessage('✗ Upload failed')
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

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setSelectedCategory(newCategory)
      setNewCategory('')
    }
  }

  const filteredMedia = filterCategory === 'All' ? media : media.filter(m => m.category === filterCategory)

  const stats = {
    total: media.length,
    images: media.filter(m => m.type === 'image').length,
    videos: media.filter(m => m.type === 'video').length,
    storage: (media.reduce((sum, m) => sum + (m.size || 0), 0) / 1024 / 1024).toFixed(2)
  }

  if (loading) return <div>Loading media gallery...</div>

  return (
    <div>
      <h1>📸 Media Gallery</h1>
      <p>Upload, organize, and manage all your media files</p>

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
        <div style={{ background: '#f0e7ff', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold', color: '#7209B7' }}>{stats.storage} MB</p>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Storage Used</p>
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

        {uploading && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '20px', overflow: 'hidden', marginBottom: '10px' }}>
              <div style={{
                background: '#d1356f',
                height: '100%',
                width: `${uploadProgress}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Uploading... {Math.round(uploadProgress)}%</p>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>Select Category</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Create new category"
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + Add
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            <input 
              type="file" 
              multiple
              accept="image/*,video/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
              id="fileInput"
            />
            <label htmlFor="fileInput" style={{
              display: 'inline-block',
              padding: '15px 30px',
              background: '#d1356f',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              📁 Select Files or Drag & Drop
            </label>
          </label>
        </div>
        <small style={{ color: '#666' }}>Supported: JPG, PNG, GIF, MP4, WebM (Max 10MB per file)</small>
      </div>

      {/* Filter Section */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterCategory('All')}
          style={{
            padding: '8px 15px',
            background: filterCategory === 'All' ? '#d1356f' : 'white',
            color: filterCategory === 'All' ? 'white' : '#333',
            border: `2px solid ${filterCategory === 'All' ? '#d1356f' : '#ddd'}`,
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          All ({media.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '8px 15px',
              background: filterCategory === cat ? '#d1356f' : 'white',
              color: filterCategory === cat ? 'white' : '#333',
              border: `2px solid ${filterCategory === cat ? '#d1356f' : '#ddd'}`,
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cat} ({media.filter(m => m.category === cat).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredMedia.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#666' }}>No media in this category yet. Upload some files to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {filteredMedia.map(item => (
            <div key={item.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
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
                  <img src={item.thumbUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.title}
                </h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#999' }}>
                  {item.category} • {item.type === 'video' ? '🎬 Video' : '🖼️ Image'}
                </p>

                {/* Copy URL Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.url)
                    alert('URL copied to clipboard!')
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: '#0077BE',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}
                >
                  📋 Copy URL
                </button>

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
