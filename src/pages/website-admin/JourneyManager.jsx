import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function JourneyManager() {
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: 5,
    difficulty: 'Easy',
    price: 0,
    currency: 'USD'
  })

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

  const handleAddJourney = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'journeys'), {
        ...formData,
        createdAt: Timestamp.now()
      })
      setFormData({ title: '', description: '', destination: '', duration: 5, difficulty: 'Easy', price: 0, currency: 'USD' })
      setShowForm(false)
      fetchJourneys()
    } catch (error) {
      console.error('Error adding journey:', error)
    }
  }

  const handleDeleteJourney = async (id) => {
    if (window.confirm('Are you sure you want to delete this journey?')) {
      try {
        await deleteDoc(doc(db, 'journeys', id))
        fetchJourneys()
      } catch (error) {
        console.error('Error deleting journey:', error)
      }
    }
  }

  if (loading) return <div>Loading journeys...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Journey Management</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Journey'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddJourney} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <input type="text" placeholder="Destination" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }} />
            <input type="number" placeholder="Duration (days)" value={formData.duration} onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option>Easy</option>
              <option>Moderate</option>
              <option>Challenging</option>
            </select>
            <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save Journey
          </button>
        </form>
      )}

      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Active Journeys ({journeys.length})</h2>
        {journeys.length === 0 ? (
          <p>No journeys yet. Add one to get started!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {journeys.map(journey => (
              <div key={journey.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#f9f9f9' }}>
                <h3>{journey.title}</h3>
                <p>{journey.description}</p>
                <p><strong>📍 Destination:</strong> {journey.destination}</p>
                <p><strong>⏱️ Duration:</strong> {journey.duration} days</p>
                <p><strong>📈 Difficulty:</strong> {journey.difficulty}</p>
                <p><strong>💰 Price:</strong> ${journey.price}</p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteJourney(journey.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
