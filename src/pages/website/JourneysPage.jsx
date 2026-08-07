import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import { useNavigate } from 'react-router-dom'
import useWishlist from '../../hooks/useWishlist'
import useScrollAnimation from '../../hooks/useScrollAnimation'

export default function JourneysPage() {
  const [journeys, setJourneys] = useState([])
  const [filteredJourneys, setFilteredJourneys] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [priceRange, setPriceRange] = useState('All')
  const [compareIds, setCompareIds] = useState([])
  const [showCompare, setShowCompare] = useState(false)
  const navigate = useNavigate()
  const { toggleWishlist, isWishlisted, getWishlistCount } = useWishlist()
  const headerSection = useScrollAnimation()

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

    if (searchTerm) {
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.destination.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(j => j.difficulty === difficultyFilter)
    }

    if (priceRange === 'Budget') {
      filtered = filtered.filter(j => j.price < 1500)
    } else if (priceRange === 'Mid-Range') {
      filtered = filtered.filter(j => j.price >= 1500 && j.price < 2500)
    } else if (priceRange === 'Luxury') {
      filtered = filtered.filter(j => j.price >= 2500)
    }

    setFilteredJourneys(filtered)
  }, [searchTerm, difficultyFilter, priceRange, journeys])

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'
  const wishlistCount = getWishlistCount()
  const compareJourneys = journeys.filter(j => compareIds.includes(j.id))

  return (
    <div>
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
        <h1 style={{ fontSize: '42px', margin: '0 0 20px 0' }}>Explore Our Journeys</h1>
        <p style={{ fontSize: '16px', margin: '0 0 25px 0' }}>Discover unforgettable experiences across India and beyond</p>
        <button
          onClick={() => navigate('/journey-finder')}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1.5px solid rgba(255,255,255,0.6)',
            color: 'white',
            padding: '12px 26px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ✨ Not sure where to start? Take our 1-minute quiz →
        </button>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ color: primaryColor, margin: 0 }}>Find Your Perfect Journey</h2>
          {wishlistCount > 0 && (
            <button
              onClick={() => navigate('/wishlist')}
              style={{
                padding: '10px 20px',
                background: primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              ❤️ Wishlist ({wishlistCount})
            </button>
          )}
        </div>

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
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
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              <option>All</option>
              <option>Budget (under $1500)</option>
              <option>Mid-Range ($1500-$2500)</option>
              <option>Luxury ($2500+)</option>
            </select>
          </div>
        </div>

        <p style={{ color: '#666', marginBottom: '20px' }}>
          Found {filteredJourneys.length} journey{filteredJourneys.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div>Loading journeys...</div>
        ) : filteredJourneys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#666' }}>No journeys found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredJourneys.map((journey, idx) => (
              <div
                key={journey.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
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
                <div
                  onClick={() => navigate(`/journey/${journey.id}`)}
                  style={{
                    backgroundImage: journey.featuredImage ? `url('${journey.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative'
                  }}>
                  {!journey.featuredImage && 'Journey Image'}

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWishlist(journey.id, journey)
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '20px',
                      transition: 'all 0.3s',
                      backdropFilter: 'blur(5px)'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.4)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    {isWishlisted(journey.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3
                    onClick={() => navigate(`/journey/${journey.id}`)}
                    style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '20px' }}
                  >
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => navigate(`/journey/${journey.id}`)}
                      style={{
                        flex: 1,
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
                    <button
                      onClick={() => toggleCompare(journey.id)}
                      title={compareIds.length >= 3 && !compareIds.includes(journey.id) ? 'You can compare up to 3 journeys' : 'Add to comparison'}
                      style={{
                        padding: '12px 14px',
                        background: compareIds.includes(journey.id) ? primaryColor : 'white',
                        color: compareIds.includes(journey.id) ? 'white' : primaryColor,
                        border: `2px solid ${primaryColor}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {compareIds.includes(journey.id) ? '✓ Comparing' : '+ Compare'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {compareIds.length > 0 && !showCompare && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 997,
          background: primaryColor, color: 'white', borderRadius: '999px', padding: '14px 24px',
          display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
        }}>
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{compareIds.length} journey{compareIds.length !== 1 ? 's' : ''} selected</span>
          <button
            onClick={() => setShowCompare(true)}
            style={{ background: 'white', color: primaryColor, border: 'none', borderRadius: '999px', padding: '8px 18px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
          >
            Compare →
          </button>
          <button
            onClick={() => setCompareIds([])}
            style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
          >×</button>
        </div>
      )}

      {showCompare && (
        <div
          onClick={() => setShowCompare(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '14px', maxWidth: '1000px', width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '30px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: primaryColor }}>Compare Journeys</h2>
              <button onClick={() => setShowCompare(false)} style={{ border: 'none', background: 'none', fontSize: '22px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${compareJourneys.length}, 1fr)`, gap: '20px' }}>
              {compareJourneys.map(j => (
                <div key={j.id} style={{ border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '140px',
                    backgroundImage: j.featuredImage ? `url('${j.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}></div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: primaryColor }}>{j.title}</h3>
                    <table style={{ width: '100%', fontSize: '13px', color: '#444', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr><td style={{ padding: '4px 0', color: '#999' }}>Destination</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{j.destination}</td></tr>
                        <tr><td style={{ padding: '4px 0', color: '#999' }}>Duration</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{j.duration} days</td></tr>
                        <tr><td style={{ padding: '4px 0', color: '#999' }}>Difficulty</td><td style={{ padding: '4px 0', textAlign: 'right' }}>{j.difficulty}</td></tr>
                        <tr><td style={{ padding: '4px 0', color: '#999' }}>Price</td><td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 'bold', color: primaryColor }}>{j.currency || '$'} {j.price}</td></tr>
                      </tbody>
                    </table>
                    {j.highlights?.length > 0 && (
                      <ul style={{ margin: '10px 0 0 0', paddingLeft: '16px', fontSize: '12px', color: '#666' }}>
                        {j.highlights.slice(0, 3).map((h, i) => <li key={i} style={{ marginBottom: '4px' }}>{h}</li>)}
                      </ul>
                    )}
                    <button
                      onClick={() => navigate(`/journey/${j.id}`)}
                      style={{ width: '100%', marginTop: '14px', padding: '10px', background: primaryColor, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      View Journey
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
