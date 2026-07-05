import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/firebaseService'

export default function MediaCarousel() {
  const [media, setMedia] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

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
    <>
      {/* Small Carousel Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          maxHeight: '280px',
          background: '#f0f0f0',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
        }}
      >
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
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            color: 'white',
            padding: '20px 15px 15px 15px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {current.title}
            </h4>
          </div>

          {/* Navigation Dots */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px',
            zIndex: 10
          }}>
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: '1px solid white',
                  background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
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
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: 'white',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              zIndex: 10
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
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.4)',
              color: 'white',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              zIndex: 10
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
          >
            ❯
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '15px',
            fontSize: '11px',
            fontWeight: 'bold',
            zIndex: 10
          }}>
            {currentIndex + 1} / {media.length}
          </div>

          {/* Hover Indicator */}
          {!isHovered && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              animation: 'pulse 1.5s ease-in-out infinite',
              zIndex: 10
            }}>
              🔍 Hover to enlarge
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Modal */}
      {isHovered && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Close Button */}
          <button
            onClick={() => setIsHovered(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '28px',
              fontWeight: 'bold',
              zIndex: 1001,
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            ✕
          </button>

          {/* Enlarged Media Container */}
          <div style={{
            position: 'relative',
            width: '90%',
            maxWidth: '1000px',
            aspectRatio: '16/9',
            background: '#f0f0f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
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

            {/* Large Title */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              color: 'white',
              padding: '40px 30px 30px 30px',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>
                {current.title}
              </h2>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                {current.type === 'video' ? '🎬 Video' : '🖼️ Image'}
              </p>
            </div>

            {/* Previous Button - Large */}
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
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.8)'
                e.target.style.transform = 'translateY(-50%) scale(1.15)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)'
                e.target.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              ❮
            </button>

            {/* Next Button - Large */}
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
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.8)'
                e.target.style.transform = 'translateY(-50%) scale(1.15)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.5)'
                e.target.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              ❯
            </button>

            {/* Navigation Dots - Large */}
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
                    transition: 'all 0.2s',
                    padding: 0
                  }}
                />
              ))}
            </div>

            {/* Counter - Large */}
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
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
