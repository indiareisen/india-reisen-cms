import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function MediaGallery() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      // Try to fetch from media collection
      const snap = await getDocs(collection(db, 'media'))
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading media...</div>

  return (
    <div>
      <h1>Media Gallery</h1>
      <p>Upload and manage images and videos</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Gallery ({media.length})</h2>
        {media.length === 0 ? (
          <p>No media yet. Start uploading images!</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {media.map(item => (
              <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                {item.url && <img src={item.url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                <div style={{ padding: '10px' }}>
                  <p><strong>{item.title}</strong></p>
                  <p style={{ fontSize: '12px', color: '#999' }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
