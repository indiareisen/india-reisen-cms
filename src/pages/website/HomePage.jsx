import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import MediaCarousel from '../../components/MediaCarousel'

export default function HomePage() {
  const [journeys, setJourneys] = useState([])
  const [reviews, setReviews] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

      const journeysQuery = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'), limit(3))
      const journeysSnap = await getDocs(journeysQuery)
      setJourneys(journeysSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(3))
      const reviewsSnap = await getDocs(reviewsQuery)
      setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const hp = settings?.homePage || {}
  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'
  const heroImage = hp.heroImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        color: 'white',
        padding: '140px 20px',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(209, 53, 111, ${settings?.homePage?.heroOverlayOpacity || 0.4}), rgba(212, 165, 116, ${settings?.homePage?.heroOverlayOpacity || 0.4}))`,
          zIndex: 2
        }}></div>

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 3 }}>
          <h1 style={{ 
            fontSize: '56px', 
            margin: '0 0 10px 0', 
            fontWeight: 'bold', 
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)' 
          }}>
            {hp.heroTitle}
          </h1>
          <p style={{ 
            fontSize: '28px', 
            margin: '0 0 20px 0', 
            textShadow: '2px 2px 6px rgba(0,0,0,0.5)' 
          }}>
            {hp.heroSubtitle}
          </p>
          <p style={{ 
            fontSize: '18px', 
            margin: '0 0 30px 0', 
            maxWidth: '600px', 
            marginLeft: 'auto', 
            marginRight: 'auto', 
            lineHeight: '1.6',
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
          }}>
            {hp.heroDescription}
          </p>
          <a href="/journeys" style={{
            background: 'white',
            color: primaryColor,
            padding: '15px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {hp.heroCTA || 'Explore Journeys'} →
          </a>
        </div>
      </section>

      {/* About Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px', color: primaryColor, textAlign: 'center' }}>
          {hp.aboutHeading || 'Why Choose India Reisen?'}
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', maxWidth: '800px', margin: '0 auto 40px auto', textAlign: 'center' }}>
          {hp.aboutContent || settings?.aboutText}
        </p>

        {hp.showStats && hp.stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', marginTop: '50px' }}>
            {hp.stats.map((stat, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '30px',
                background: '#f9f9f9',
                borderRadius: '8px',
                border: `3px solid ${primaryColor}`,
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{ fontSize: '32px', color: primaryColor, margin: '0 0 10px 0', fontWeight: 'bold' }}>
                  {stat.value}
                </h3>
                <p style={{ fontSize: '16px', color: '#666', margin: 0, fontWeight: 'bold' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Media Carousel Section - INCREASED SIZE */}
      <section style={{ background: 'white', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '36px', 
            marginBottom: '40px', 
            color: primaryColor, 
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            ✨ Gallery Showcase
          </h2>
          <MediaCarousel />
        </div>
      </section>

      {/* Featured Journeys */}
      <section style={{ background: '#f9f9f9', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
            Featured Journeys
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : journeys.length === 0 ? (
            <p>No journeys yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {journeys.map(journey => (
                <div key={journey.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    height: '220px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    Journey Image
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '20px' }}>
                      {journey.title}
                    </h3>
                    <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {journey.description}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '20px' }}>
                      <div>📍 {journey.destination}</div>
                      <div>⏱️ {journey.duration} days</div>
                      <div>📈 {journey.difficulty}</div>
                      <div>💰 ${journey.price}</div>
                    </div>
                    <a href="/journeys" style={{
                      width: '100%',
                      padding: '10px',
                      background: primaryColor,
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center'
                    }}>
                      Learn More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
            What Our Travelers Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} style={{
                background: '#f9f9f9',
                padding: '30px',
                borderRadius: '12px',
                border: `2px solid ${primaryColor}`,
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ color: primaryColor, fontSize: '20px', marginBottom: '10px' }}>
                  {'⭐'.repeat(review.rating)}
                </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  {review.title}
                </p>
                <p style={{ color: '#666', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                  "{review.content}"
                </p>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                  {review.name}
                </p>
                <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>
                  {review.country} • {review.journey}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 20px 0' }}>
            {hp.ctaHeading || 'Ready to Explore India?'}
          </h2>
          <p style={{ fontSize: '16px', margin: '0 0 30px 0', lineHeight: '1.6' }}>
            {hp.ctaText || 'Start your journey with us today.'}
          </p>
          <a href="/journeys" style={{
            background: 'white',
            color: primaryColor,
            padding: '15px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}>
            {hp.ctaButtonText || 'Browse All Journeys'}
          </a>
        </div>
      </section>
    </div>
  )
}
