import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebaseService'

export default function MediaCarousel() {
  const [media, setMedia] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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

  // Auto rotate every 5 seconds
  useEffect(() => {
    if (media.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [media])

  if (loading || media.length === 0) return null

  const current = media[currentIndex]

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      background: '#f0f0f0',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      {/* Media Display */}
      {current.type === 'video' ? (
        <video 
          src={current.url} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          controls
          autoPlay
          muted
        />
      ) : (
        <img 
          src={current.url} 
          alt={current.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Title */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0 }}>{current.title}</h3>
      </div>

      {/* Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px'
      }}>
        {media.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % media.length)}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
      >
        ❯
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute',
        top: '15px',
        right: '15px',
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {currentIndex + 1} / {media.length}
      </div>
    </div>
  )
}
