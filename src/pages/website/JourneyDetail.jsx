import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import useWishlist from '../../hooks/useWishlist'

const INK = '#2b2320'
const BORDER = '#e8dfd7'
const CANVAS = '#faf6f2'

const DEFAULT_INCLUSIONS = [
  'Professional local guides',
  'Accommodation in luxury hotels',
  'All meals and refreshments',
  'Transportation and transfers',
  'Entry to all attractions',
  'Travel insurance included'
]

export default function JourneyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journey, setJourney] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImg, setLightboxImg] = useState(null)
  const { toggleWishlist, isWishlisted: checkWishlisted } = useWishlist()

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    try {
      const journeyDoc = await getDoc(doc(db, 'journeys', id))
      if (journeyDoc.exists()) {
        setJourney({ id: journeyDoc.id, ...journeyDoc.data() })
      }
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) setSettings(settingsDoc.data())
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
  const days = journey.itineraryDays || []
  const gallery = journey.gallery || []
  const highlights = journey.highlights || []
  const inclusions = journey.inclusions?.length ? journey.inclusions : DEFAULT_INCLUSIONS
  const exclusions = journey.exclusions || []

  return (
    <div>
      {/* Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/journeys')}
          style={{ background: primaryColor, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Journeys
        </button>
      </div>

      {/* Hero Section */}
      <section style={{ position: 'relative', color: 'white', padding: '80px 20px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="journey-hero-bg" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: journey.featuredImage ? `url('${journey.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
        }}></div>
        {journey.featuredImage && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg, rgba(209,53,111,0.55), rgba(212,165,116,0.55))`, zIndex: 2 }}></div>
        )}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}>{journey.title}</h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 30px auto', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>{journey.description}</p>
          <div style={{ fontSize: '24px', textShadow: '1px 1px 4px rgba(0,0,0,0.4)' }}>🌍 {journey.destination}</div>
        </div>
      </section>

      {/* Quick Facts */}
      <section style={{ maxWidth: '1200px', margin: '-40px auto 60px auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
          {[
            [`⏱️ ${journey.duration}`, 'Days'],
            [`📈 ${journey.difficulty}`, 'Level'],
            [`💰 ${journey.currency || '$'} ${journey.price}`, 'Per Person'],
            [`📍 ${journey.destination}`, 'Destination']
          ].map(([big, small], i) => (
            <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '26px', fontWeight: 'bold', color: primaryColor }}>{big}</p>
              <p style={{ margin: 0, color: '#666' }}>{small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights strip */}
      {highlights.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto 20px auto', padding: '0 20px' }}>
          <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '22px 26px' }}>
            <h3 style={{ margin: '0 0 14px 0', color: primaryColor, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>✨ Highlights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: INK, fontSize: '14.5px', lineHeight: '1.5' }}>
                  <span style={{ color: secondaryColor, fontWeight: 'bold' }}>✦</span>{h}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Left Column */}
          <div>
            <h2 style={{ color: primaryColor, marginBottom: '20px' }}>About This Journey</h2>
            <p style={{ lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>{journey.description}</p>

            {/* Gallery */}
            {gallery.length > 0 && (
              <>
                <h2 style={{ color: primaryColor, marginBottom: '16px' }}>Gallery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '30px' }}>
                  {gallery.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxImg(url)}
                      style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${BORDER}` }}
                    >
                      <img src={url} alt={`${journey.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 style={{ color: primaryColor, marginBottom: '20px' }}>What's Included</h2>
            <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px', marginBottom: exclusions.length ? '20px' : '30px' }}>
              {inclusions.map((item, i) => <li key={i}>✓ {item}</li>)}
            </ul>

            {exclusions.length > 0 && (
              <>
                <h3 style={{ color: primaryColor, marginBottom: '14px', fontSize: '18px' }}>Not Included</h3>
                <ul style={{ color: '#666', lineHeight: '2', paddingLeft: '20px', marginBottom: '30px' }}>
                  {exclusions.map((item, i) => <li key={i}>✕ {item}</li>)}
                </ul>
              </>
            )}

            <h2 style={{ color: primaryColor, marginBottom: '20px', marginTop: '10px' }}>Itinerary</h2>
            {days.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {days.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: '18px', paddingBottom: i === days.length - 1 ? 0 : '22px', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <span style={{
                        width: '36px', height: '36px', borderRadius: '50%', background: primaryColor, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', zIndex: 1
                      }}>{d.day}</span>
                      {i !== days.length - 1 && <div style={{ flex: 1, width: '2px', background: BORDER, marginTop: '4px' }}></div>}
                    </div>
                    <div style={{ paddingBottom: '4px' }}>
                      <h4 style={{ margin: '4px 0 6px 0', color: INK }}>{d.title || `Day ${d.day}`}</h4>
                      <p style={{ margin: 0, color: '#666', lineHeight: '1.7', fontSize: '14.5px' }}>{d.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                <p style={{ color: '#666', lineHeight: '1.8', margin: 0 }}>
                  Day 1: Arrival & city orientation<br />
                  Day 2-{Math.max(journey.duration - 2, 2)}: Explore major attractions & local experiences<br />
                  Day {journey.duration}: Departure
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', position: 'sticky', top: '20px' }}>
              <h3 style={{ color: primaryColor, marginTop: 0 }}>Book This Journey</h3>
              <div style={{ background: 'white', padding: '15px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px 0', color: '#999', fontSize: '12px' }}>Starting from</p>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: primaryColor }}>{journey.currency || '$'} {journey.price}</p>
              </div>
              <button
                onClick={() => alert('Booking system coming soon!')}
                style={{ width: '100%', padding: '15px', background: primaryColor, color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', transition: 'background 0.3s' }}
                onMouseOver={e => e.target.style.background = secondaryColor}
                onMouseOut={e => e.target.style.background = primaryColor}
              >
                🛫 Book Now
              </button>
              <button
                onClick={() => toggleWishlist(journey.id, journey)}
                style={{
                  width: '100%', padding: '15px', background: checkWishlisted(journey.id) ? primaryColor : 'white',
                  color: checkWishlisted(journey.id) ? 'white' : primaryColor, border: `2px solid ${primaryColor}`,
                  borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {checkWishlisted(journey.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <h4 style={{ color: primaryColor, marginBottom: '15px' }}>Need Help?</h4>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>📞 Call us: {settings?.phone}</p>
                <p style={{ color: '#666', fontSize: '14px' }}>📧 Email: {settings?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '32px' }}>Ready for Your Adventure?</h2>
        <p style={{ margin: '0 0 30px 0', fontSize: '16px' }}>Don't miss out on this incredible journey. Limited spots available!</p>
        <button
          onClick={() => alert('Booking system coming soon!')}
          style={{ background: 'white', color: primaryColor, padding: '15px 40px', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
        >
          Book This Journey Now →
        </button>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '30px' }}
        >
          <img src={lightboxImg} alt="Gallery enlarged" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .journey-hero-bg {
            background-attachment: scroll !important;
            background-size: cover !important;
            background-position: center !important;
          }
        }
      `}</style>
    </div>
  )
}
