import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import { useNavigate } from 'react-router-dom'

export default function JourneysPage() {
  const [journeys, setJourneys] = useState([])
  const [filteredJourneys, setFilteredJourneys] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [priceRange, setPriceRange] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

      const journeysQuery = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'))
      const journeysSnap = await getDocs(journeysQuery)
      const journeysList = journeysSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setJourneys(journeysList)
      setFilteredJourneys(journeysList)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = journeys

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Difficulty filter
    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(j => j.difficulty === difficultyFilter)
    }

    // Price filter
    if (priceRange === 'Budget') {
      filtered = filtered.filter(j => j.price < 1500)
    } else if (priceRange === 'Mid-Range') {
      filtered = filtered.filter(j => j.price >= 1500 && j.price < 2500)
    } else if (priceRange === 'Luxury') {
      filtered = filtered.filter(j => j.price >= 2500)
    }

    setFilteredJourneys(filtered)
  }, [searchTerm, difficultyFilter, priceRange, journeys])

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  return (
    <div>
      {/* Header */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '42px', margin: '0 0 20px 0' }}>Explore Our Journeys</h1>
        <p style={{ fontSize: '16px', margin: 0 }}>Discover unforgettable experiences across India and beyond</p>
      </section>

      {/* Search & Filters */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ color: primaryColor, marginBottom: '20px' }}>Find Your Perfect Journey</h2>

        {/* Search Box */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search by journey name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            >
              <option>All</option>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            >
              <option>All</option>
              <option>Budget (under $1500)</option>
              <option>Mid-Range ($1500-$2500)</option>
              <option>Luxury ($2500+)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Found {filteredJourneys.length} journey{filteredJourneys.length !== 1 ? 's' : ''}
        </p>

        {/* Journeys Grid */}
        {loading ? (
          <div>Loading journeys...</div>
        ) : filteredJourneys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#666' }}>No journeys found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredJourneys.map(journey => (
              <div
                key={journey.id}
                onClick={() => navigate(`/journey/${journey.id}`)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
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
                  fontSize: '16px'
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '20px', color: '#666' }}>
                    <div>📍 {journey.destination}</div>
                    <div>⏱️ {journey.duration} days</div>
                    <div>📈 {journey.difficulty}</div>
                    <div>💰 ${journey.price}</div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    background: primaryColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
