import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebaseService'

export default function MediaCarousel() {
  const [media, setMedia] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isEnlarged, setIsEnlarged] = useState(false)

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
    if (media.length === 0 || isEnlarged) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % media.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [media, isEnlarged])

  if (loading || media.length === 0) return null

  const current = media[currentIndex]

  return (
    <div
      onMouseEnter={() => setIsEnlarged(true)}
      onMouseLeave={() => setIsEnlarged(false)}
      style={{ position: 'relative' }}
    >
      {/* Small Carousel */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%',
        maxHeight: '280px',
        background: '#f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
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
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: isEnlarged ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.4s ease'
              }}
              controls
              autoPlay
              muted
            />
          ) : (
            <img 
              src={current.url} 
              alt={current.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: isEnlarged ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 0.4s ease'
              }}
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
            padding: '15px 10px 10px 10px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            opacity: isEnlarged ? 0.7 : 1
          }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold' }}>
              {current.title}
            </p>
          </div>

          {/* Navigation Dots */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px',
            zIndex: 10
          }}>
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  border: '1px solid white',
                  background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
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
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              zIndex: 10,
              opacity: isEnlarged ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
          >
            ❮
          </button>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % media.length)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: 'white',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              zIndex: 10,
              opacity: isEnlarged ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
          >
            ❯
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            {currentIndex + 1} / {media.length}
          </div>

          {/* Hover Text */}
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: isEnlarged ? 0 : 1,
            transition: 'opacity 0.3s'
          }}>
            🔍 Hover to zoom
          </div>
        </div>
      </div>

      {/* Enlarged Full Screen Modal */}
      {isEnlarged && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsEnlarged(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.3)',
              color: 'white',
              border: 'none',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '24px',
              fontWeight: 'bold',
              zIndex: 10001,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.5)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          >
            ✕
          </button>

          {/* Enlarged Media Container */}
          <div style={{
            position: 'relative',
            width: '95%',
            maxWidth: '1200px',
            aspectRatio: '16/9',
            background: '#000',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            {/* Media Display - ZOOMED */}
            {current.type === 'video' ? (
              <video 
                src={current.url} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: 'scale(1.2)',
                  animation: 'zoomIn 0.4s ease'
                }}
                controls
                autoPlay
                muted
              />
            ) : (
              <img 
                src={current.url} 
                alt={current.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transform: 'scale(1.2)',
                  animation: 'zoomIn 0.4s ease'
                }}
              />
            )}

            {/* Title */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent)',
              color: 'white',
              padding: '60px 30px 30px 30px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                {current.title}
              </h2>
              <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                {current.type === 'video' ? '🎬 Video' : '🖼️ Image'}
              </p>
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
                fontSize: '22px',
                fontWeight: 'bold',
                zIndex: 10,
                transition: 'all 0.2s'
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
                fontSize: '22px',
                fontWeight: 'bold',
                zIndex: 10,
                transition: 'all 0.2s'
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

            {/* Navigation Dots */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
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
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>

            {/* Counter */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 'bold',
              zIndex: 10
            }}>
              {currentIndex + 1} / {media.length}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { 
            transform: scale(1);
            opacity: 0;
          }
          to { 
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
