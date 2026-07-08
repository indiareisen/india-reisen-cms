import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import useWishlist from '../../hooks/useWishlist'
import useScrollAnimation from '../../hooks/useScrollAnimation'

export default function WishlistPage() {
  const navigate = useNavigate()
  const { getWishlistJourneys, toggleWishlist, isWishlisted } = useWishlist()
  const [settings, setSettings] = useState(null)
  const [wishlistJourneys, setWishlistJourneys] = useState([])
  const headerSection = useScrollAnimation()

  useEffect(() => {
    fetchSettings()
    setWishlistJourneys(getWishlistJourneys())
  }, [])

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  return (
    <div>
      {/* Header */}
      <section 
        ref={headerSection.ref}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          opacity: headerSection.isVisible ? 1 : 0,
          transform: headerSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <h1 style={{ fontSize: '42px', margin: '0 0 20px 0' }}>❤️ My Wishlist</h1>
        <p style={{ fontSize: '16px', margin: 0 }}>Your favorite journeys saved for later</p>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <button
          onClick={() => navigate('/journeys')}
          style={{
            marginBottom: '30px',
            padding: '10px 20px',
            background: primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to All Journeys
        </button>

        {wishlistJourneys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ color: '#999' }}>Your wishlist is empty</h2>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              Start adding your favorite journeys to your wishlist!
            </p>
            <button
              onClick={() => navigate('/journeys')}
              style={{
                padding: '12px 30px',
                background: primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Explore Journeys
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              {wishlistJourneys.length} journey{wishlistJourneys.length !== 1 ? 's' : ''} in your wishlist
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {wishlistJourneys.map((journey, idx) => (
                <div
                  key={journey.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s',
                    animation: `fadeInUp 0.8s ease ${idx * 0.1}s backwards`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative'
                  }}>
                    Journey Image

                    <button
                      onClick={() => toggleWishlist(journey.id, journey)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255,0,0,0.8)',
                        color: 'white',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(255,0,0,1)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(255,0,0,0.8)'}
                    >
                      ❤️
                    </button>
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '20px' }}>
                      {journey.title}
                    </h3>
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {journey.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '20px', color: '#666' }}>
                      <div>📍 {journey.destination}</div>
                      <div>⏱️ {journey.duration} days</div>
                      <div>📈 {journey.difficulty}</div>
                      <div>💰 ${journey.price}</div>
                    </div>
                    <button
                      onClick={() => navigate(`/journey/${journey.id}`)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: primaryColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
