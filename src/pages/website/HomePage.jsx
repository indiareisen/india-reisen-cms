import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function HomePage() {
  const [journeys, setJourneys] = useState([])
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
      const q = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'), limit(3))
      const snap = await getDocs(q)
      setJourneys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const brandColors = settings ? { primary: settings.primaryColor, secondary: settings.secondaryColor } : { primary: '#d1356f', secondary: '#D4A574' }

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        marginBottom: '50px'
      }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 10px 0' }}>Welcome to India Reisen</h1>
        <p style={{ fontSize: '24px', margin: '0 0 20px 0' }}>{settings?.tagline || 'Explore • Experience • Enchant'}</p>
        <p style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>{settings?.description || 'Discover luxury bespoke journeys into authentic India'}</p>
      </div>

      {/* About Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px', color: brandColors.primary }}>About India Reisen</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666', maxWidth: '800px' }}>
          Every journey is more than just a trip—it's an immersive experience into the rich heritage and timeless charm of India. We curate personalized itineraries that connect you with authentic cultures, breathtaking landscapes, and unforgettable moments.
        </p>
      </div>

      {/* Featured Journeys */}
      <div style={{ background: '#f9f9f9', padding: '50px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px', color: brandColors.primary }}>Featured Journeys</h2>
          {loading ? (
            <div>Loading journeys...</div>
          ) : journeys.length === 0 ? (
            <div>No journeys available yet.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
              {journeys.map(journey => (
                <div key={journey.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.secondary})`,
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    Journey Image
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: brandColors.primary }}>{journey.title}</h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{journey.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px', fontSize: '14px' }}>
                      <div><strong>Duration:</strong> {journey.duration} days</div>
                      <div><strong>Difficulty:</strong> {journey.difficulty}</div>
                      <div><strong>Price:</strong> ${journey.price}</div>
                      <div><strong>Destination:</strong> {journey.destination}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: brandColors.primary,
        color: 'white',
        padding: '50px 20px',
        textAlign: 'center',
        margin: '50px 0 0 0'
      }}>
        <h2 style={{ fontSize: '32px', margin: '0 0 20px 0' }}>Ready to Explore India?</h2>
        <a href="/journeys" style={{
          background: 'white',
          color: brandColors.primary,
          padding: '12px 30px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          display: 'inline-block'
        }}>
          Browse All Journeys
        </a>
      </div>
    </div>
  )
}
