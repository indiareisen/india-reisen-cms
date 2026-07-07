import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function JourneyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journey, setJourney] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)

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

      // Check if wishlisted
      const wishlisted = localStorage.getItem(`wishlist-${id}`)
      setIsWishlisted(!!wishlisted)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = () => {
    if (isWishlisted) {
      localStorage.removeItem(`wishlist-${id}`)
    } else {
      localStorage.setItem(`wishlist-${id}`, JSON.stringify(journey))
    }
    setIsWishlisted(!isWishlisted)
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

      {/* Hero Section with Image Placeholder */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>{journey.title}</h1>
        <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 0 30px 0' }}>
          {journey.description}
        </p>
        <div style={{ fontSize: '24px' }}>🌍 {journey.destination}</div>
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
                onClick={toggleWishlist}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: isWishlisted ? primaryColor : 'white',
                  color: isWishlisted ? 'white' : primaryColor,
                  border: `2px solid ${primaryColor}`,
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
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
