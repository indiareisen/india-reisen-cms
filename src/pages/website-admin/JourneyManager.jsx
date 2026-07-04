import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function JourneyManager() {
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJourneys()
  }, [])

  const fetchJourneys = async () => {
    try {
      const q = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setJourneys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching journeys:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading journeys...</div>

  return (
    <div>
      <h1>Journey Management</h1>
      <p>Create, edit, and manage travel journeys</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Active Journeys ({journeys.length})</h2>
        {journeys.length === 0 ? (
          <p>No journeys yet. Start adding content!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {journeys.map(journey => (
              <div key={journey.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
                <h3>{journey.title}</h3>
                <p>{journey.description}</p>
                <p><strong>Duration:</strong> {journey.duration} days</p>
                <p><strong>Price:</strong> ${journey.price}</p>
                <p><strong>Difficulty:</strong> {journey.difficulty}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
