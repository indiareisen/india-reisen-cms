import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function WebsiteAdminDashboard() {
  const [stats, setStats] = useState({ journeys: 0, blogs: 0, messages: 0, reviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const journeysSnap = await getDocs(collection(db, 'journeys'))
      const blogsSnap = await getDocs(collection(db, 'blogs'))
      const messagesSnap = await getDocs(collection(db, 'contactMessages'))
      const reviewsSnap = await getDocs(collection(db, 'reviews'))

      setStats({
        journeys: journeysSnap.size,
        blogs: blogsSnap.size,
        messages: messagesSnap.size,
        reviews: reviewsSnap.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  const cards = [
    { title: '🛣️ Journeys', count: stats.journeys, color: '#3498db' },
    { title: '📝 Blog Posts', count: stats.blogs, color: '#2ecc71' },
    { title: '💬 Messages', count: stats.messages, color: '#e74c3c' },
    { title: '⭐ Reviews', count: stats.reviews, color: '#f39c12' }
  ]

  return (
    <div>
      <h1>Website Admin Dashboard</h1>
      <p>Manage your website content and interactions</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              border: `4px solid ${card.color}`,
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ margin: '0 0 15px 0', fontSize: '24px' }}>{card.title}</h2>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: card.color }}>
              {card.count}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/admin/website/journeys" style={{
            background: '#3498db',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>+ Add Journey</a>
          <a href="/admin/website/blog" style={{
            background: '#2ecc71',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>+ Write Blog</a>
          <a href="/admin/website/messages" style={{
            background: '#e74c3c',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>View Messages</a>
        </div>
      </div>
    </div>
  )
}
