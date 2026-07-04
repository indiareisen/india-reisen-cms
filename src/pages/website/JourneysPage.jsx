import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function JourneysPage() {
  const [journeys, setJourneys] = useState([])
  const [filteredJourneys, setFilteredJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [difficultyFilter, setDifficultyFilter] = useState('All')

  useEffect(() => {
    fetchJourneys()
  }, [])

  useEffect(() => {
    if (difficultyFilter === 'All') {
      setFilteredJourneys(journeys)
    } else {
      setFilteredJourneys(journeys.filter(j => j.difficulty === difficultyFilter))
    }
  }, [difficultyFilter, journeys])

  const fetchJourneys = async () => {
    try {
      const q = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setJourneys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', color: '#d1356f' }}>Our Journeys</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Discover our curated collection of unforgettable Indian experiences</p>

      {/* Filters */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {['All', 'Easy', 'Moderate', 'Challenging'].map(diff => (
          <button
            key={diff}
            onClick={() => setDifficultyFilter(diff)}
            style={{
              padding: '8px 15px',
              background: difficultyFilter === diff ? '#d1356f' : 'white',
              color: difficultyFilter === diff ? 'white' : '#333',
              border: `2px solid #d1356f`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {diff}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading journeys...</div>
      ) : filteredJourneys.length === 0 ? (
        <div>No journeys found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredJourneys.map(journey => (
            <div key={journey.id} style={{
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                background: 'linear-gradient(135deg, #d1356f, #D4A574)',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                Journey Image
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#d1356f' }}>{journey.title}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{journey.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '15px' }}>
                  <div>📍 {journey.destination}</div>
                  <div>⏱️ {journey.duration} days</div>
                  <div>📈 {journey.difficulty}</div>
                  <div>💰 ${journey.price}</div>
                </div>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  background: '#d1356f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
