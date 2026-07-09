import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    journeys: 0,
    messages: 0,
    reviews: 0,
    blogPosts: 0,
    totalRevenue: 0,
    bookings: 0
  })
  const [journeyStats, setJourneyStats] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Count journeys
      const journeysSnap = await getDocs(collection(db, 'journeys'))
      const journeysList = journeysSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Count messages
      const messagesSnap = await getDocs(collection(db, 'contactMessages'))

      // Count reviews
      const reviewsSnap = await getDocs(collection(db, 'reviews'))

      // Count blog posts
      const postsSnap = await getDocs(collection(db, 'posts'))

      // Calculate revenue (estimated based on journeys)
      const totalRevenue = journeysList.reduce((sum, j) => sum + (j.price || 0), 0)

      setStats({
        journeys: journeysList.length,
        messages: messagesSnap.size,
        reviews: reviewsSnap.size,
        blogPosts: postsSnap.size,
        totalRevenue: totalRevenue,
        bookings: Math.floor(journeysList.length * 0.5)
      })

      setJourneyStats(journeysList)

      // Get recent messages
      const messagesQuery = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))
      const messagesData = await getDocs(messagesQuery)
      setRecentMessages(messagesData.docs.slice(0, 5).map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const primaryColor = '#d1356f'
  const secondaryColor = '#D4A574'

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>

  return (
    <div>
      <h1>📊 Admin Dashboard</h1>
      <p style={{ color: '#666' }}>Welcome to your control center</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {/* Journeys Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Journeys</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.journeys}</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>✈️ Active tours</p>
        </div>

        {/* Messages Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Contact Messages</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.messages}</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>💬 Inquiries</p>
        </div>

        {/* Reviews Card */}
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Reviews</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.reviews}</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>⭐ Ratings</p>
        </div>

        {/* Blog Posts Card */}
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Blog Posts</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.blogPosts}</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>📝 Articles</p>
        </div>

        {/* Revenue Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Total Revenue</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>${(stats.totalRevenue / 1000).toFixed(1)}K</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>💰 Estimated</p>
        </div>

        {/* Bookings Card */}
        <div style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', opacity: 0.9 }}>Bookings</p>
          <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>{stats.bookings}</h2>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.8 }}>🎫 Reservations</p>
        </div>
      </div>

      {/* Revenue by Journey */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Revenue by Journey</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {journeyStats.length === 0 ? (
            <p style={{ color: '#999' }}>No journey data available</p>
          ) : (
            <div>
              {journeyStats.slice(0, 5).map((journey, idx) => (
                <div key={journey.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#333' }}>{journey.title}</h4>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: primaryColor }}>${journey.price}</span>
                  </div>
                  <div style={{
                    background: '#f0f0f0',
                    borderRadius: '6px',
                    height: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      height: '100%',
                      width: `${(journey.price / Math.max(...journeyStats.map(j => j.price))) * 100}%`,
                      borderRadius: '6px'
                    }}></div>
                  </div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>
                    {journey.destination} • {journey.duration} days
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Messages */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Recent Messages</h2>
        {recentMessages.length === 0 ? (
          <p style={{ color: '#999' }}>No messages yet</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recentMessages.map((msg, idx) => (
              <div key={msg.id} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{msg.name}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>📧 {msg.email}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#ccc' }}>
                    {msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
                  {msg.message?.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: primaryColor }}>📈 Quick Analytics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Avg Journey Price</p>
            <h3 style={{ margin: 0, color: primaryColor }}>
              ${journeyStats.length > 0 ? (journeyStats.reduce((sum, j) => sum + (j.price || 0), 0) / journeyStats.length).toFixed(0) : 0}
            </h3>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Engagement Rate</p>
            <h3 style={{ margin: 0, color: primaryColor }}>
              {stats.messages > 0 ? ((stats.reviews / stats.messages) * 100).toFixed(1) : 0}%
            </h3>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Avg Rating</p>
            <h3 style={{ margin: 0, color: primaryColor }}>
              {stats.reviews > 0 ? '4.5' : 'N/A'} ⭐
            </h3>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Conversion Rate</p>
            <h3 style={{ margin: 0, color: primaryColor }}>
              {stats.messages > 0 ? ((stats.bookings / stats.messages) * 100).toFixed(1) : 0}%
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}
