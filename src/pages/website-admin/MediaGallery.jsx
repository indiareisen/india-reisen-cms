import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function MediaGallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: ''
  })

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

  const handleAddMedia = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'media'), {
        ...formData,
        createdAt: Timestamp.now()
      })
      setFormData({ title: '', description: '', url: '' })
      setShowForm(false)
      fetchMedia()
    } catch (error) {
      console.error('Error adding media:', error)
    }
  }

  const handleDeleteMedia = async (id) => {
    if (window.confirm('Delete this image?')) {
      try {
        await deleteDoc(doc(db, 'media', id))
        fetchMedia()
      } catch (error) {
        console.error('Error deleting media:', error)
      }
    }
  }

  if (loading) return <div>Loading media...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Media Gallery</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Image'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddMedia} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '15px', boxSizing: 'border-box' }} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '15px', minHeight: '80px', boxSizing: 'border-box' }} />
          <input type="url" placeholder="Image URL (paste Cloudinary or image URL)" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '15px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add to Gallery
          </button>
        </form>
      )}

      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Gallery ({media.length})</h2>
        {media.length === 0 ? (
          <p>No images in gallery yet. Add one to get started!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {media.map(item => (
              <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', background: '#f9f9f9' }}>
                {item.url && <img src={item.url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '10px' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>{item.description}</p>
                  <button 
                    onClick={() => handleDeleteMedia(item.id)}
                    style={{ width: '100%', padding: '8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
