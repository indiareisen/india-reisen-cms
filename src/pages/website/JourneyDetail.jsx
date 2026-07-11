import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import useWishlist from '../../hooks/useWishlist'

export default function JourneyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journey, setJourney] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toggleWishlist, isWishlisted: checkWishlisted } = useWishlist()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const journeyDoc = await getDoc(doc(db, 'journeys', id))
      if (journeyDoc.exists()) {
        setJourney({ id: journeyDoc.id, ...journeyDoc.data() })
      }

      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  if (!journey) return <div style={{ padding: '40px', textAlign: 'center' }}>Journey not found</div>

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  return (
    <div>
      {/* Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/journeys')}
          style={{
            background: primaryColor,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ← Back to Journeys
        </button>
      </div>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: journey.featuredImage ? `url('${journey.featuredImage}')` : 'none',
          background: journey.featuredImage ? undefined : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1
        }}></div>
        {journey.featuredImage && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(135deg, rgba(209,53,111,0.55), rgba(212,165,116,0.55))`,
            zIndex: 2
          }}></div>
        )}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>{journey.title}</h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px auto', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>
            {journey.description}
          </p>
          <div style={{ fontSize: '24px', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>🌍 {journey.destination}</div>
        </div>
      </section>

      {/* Quick Facts */}
      <section style={{ maxWidth: '1200px', margin: '-40px auto 60px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', color: primaryColor }}>
              ⏱️ {journey.duration}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Days</p>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', color: primaryColor }}>
              📈 {journey.difficulty}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Level</p>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', color: primaryColor }}>
              💰 ${journey.price}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Per Person</p>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold', color: primaryColor }}>
              📍 {journey.destination}
            </p>
            <p style={{ margin: 0, color: '#666' }}>Destination</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Left Column */}
          <div>
            <h2 style={{ color: primaryColor, marginBottom: '20px' }}>About This Journey</h2>
            <p style={{ lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
              {journey.description}
            </p>

            <h2 style={{ color: primaryColor, marginBottom: '20px', marginTop: '40px' }}>What's Included</h2>
            <ul style={{ color: '#666', lineHeight: '2' }}>
              <li>✓ Professional local guides</li>
              <li>✓ Accommodation in luxury hotels</li>
              <li>✓ All meals and refreshments</li>
              <li>✓ Transportation and transfers</li>
              <li>✓ Entry to all attractions</li>
              <li>✓ Travel insurance included</li>
            </ul>

            <h2 style={{ color: primaryColor, marginBottom: '20px', marginTop: '40px' }}>Itinerary</h2>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
              <p style={{ color: '#666', lineHeight: '1.8' }}>
                Day 1: Arrival & city orientation<br/>
                Day 2-{journey.duration-2}: Explore major attractions & local experiences<br/>
                Day {journey.duration}: Departure
              </p>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Booking Card */}
            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
              <h3 style={{ color: primaryColor, marginTop: 0 }}>Book This Journey</h3>
              
              <div style={{ background: 'white', padding: '15px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px 0', color: '#999', fontSize: '12px' }}>Starting from</p>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: primaryColor }}>
                  ${journey.price}
                </p>
              </div>

              <button
                onClick={() => alert('Booking system coming soon!')}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '15px',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = secondaryColor}
                onMouseOut={(e) => e.target.style.background = primaryColor}
              >
                🛫 Book Now
              </button>

              <button
                onClick={() => toggleWishlist(journey.id, journey)}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: checkWishlisted(journey.id) ? primaryColor : 'white',
                  color: checkWishlisted(journey.id) ? 'white' : primaryColor,
                  border: `2px solid ${primaryColor}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {checkWishlisted(journey.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>

              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <h4 style={{ color: primaryColor, marginBottom: '15px' }}>Need Help?</h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                  📞 Call us: {settings?.phone}
                </p>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  📧 Email: {settings?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '32px' }}>Ready for Your Adventure?</h2>
        <p style={{ margin: '0 0 30px 0', fontSize: '16px' }}>
          Don't miss out on this incredible journey. Limited spots available!
        </p>
        <button
          onClick={() => alert('Booking system coming soon!')}
          style={{
            background: 'white',
            color: primaryColor,
            padding: '15px 40px',
            borderRadius: '50px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          Book This Journey Now →
        </button>
      </section>
    </div>
  )
}
