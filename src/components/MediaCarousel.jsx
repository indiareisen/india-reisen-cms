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
      paddingBottom: '56.25%', // 16:9 aspect ratio
      maxHeight: '600px',
      background: '#f0f0f0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      marginBottom: '20px'
    }}>
      {/* Media Container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
          color: 'white',
          padding: '40px 30px 30px 30px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{current.title}</h3>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
            {current.type === 'video' ? '🎬 Video' : '🖼️ Image'}
          </p>
        </div>

        {/* Navigation Dots */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
          {media.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid white',
                background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
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
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.8)'
            e.target.style.transform = 'translateY(-50%) scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.5)'
            e.target.style.transform = 'translateY(-50%) scale(1)'
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
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.8)'
            e.target.style.transform = 'translateY(-50%) scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.5)'
            e.target.style.transform = 'translateY(-50%) scale(1)'
          }}
        >
          ❯
        </button>

        {/* Counter */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          zIndex: 10
        }}>
          {currentIndex + 1} / {media.length}
        </div>
      </div>
    </div>
  )
}
