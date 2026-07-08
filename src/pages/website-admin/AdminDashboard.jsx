import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    journeys: 0,
    messages: 0,
    reviews: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const journeysSnap = await getDocs(collection(db, 'journeys'))
      const messagesSnap = await getDocs(collection(db, 'contactMessages'))
      const reviewsSnap = await getDocs(collection(db, 'reviews'))

      setStats({
        journeys: journeysSnap.size,
        messages: messagesSnap.size,
        reviews: reviewsSnap.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div>
      <h1>📊 Dashboard</h1>
      <p>Welcome to your admin panel!</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ background: '#e7f3ff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#0077BE', fontSize: '28px' }}>{stats.journeys}</h3>
          <p style={{ margin: '10px 0 0 0', color: '#666' }}>Journeys</p>
        </div>
        <div style={{ background: '#fff0e7', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#FF6B35', fontSize: '28px' }}>{stats.messages}</h3>
          <p style={{ margin: '10px 0 0 0', color: '#666' }}>Messages</p>
        </div>
        <div style={{ background: '#e7ffe7', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: '#2D6A4F', fontSize: '28px' }}>{stats.reviews}</h3>
          <p style={{ margin: '10px 0 0 0', color: '#666' }}>Reviews</p>
        </div>
      </div>
    </div>
  )
}
