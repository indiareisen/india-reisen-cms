import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

const emptyForm = {
  title: '',
  description: '',
  destination: '',
  duration: 5,
  difficulty: 'Easy',
  price: 0,
  currency: 'USD',
  featuredImage: ''
}

export default function JourneyManager() {
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const cloudForm = new FormData()
      cloudForm.append('file', file)
      cloudForm.append('upload_preset', 'india_reisen')

      const response = await fetch('https://api.cloudinary.com/v1_1/dl1q4dw72/image/upload', {
        method: 'POST',
        body: cloudForm
      })
      const data = await response.json()

      if (data.secure_url) {
        setFormData(prev => ({ ...prev, featuredImage: data.secure_url }))
      } else {
        alert('Image upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateDoc(doc(db, 'journeys', editingId), {
          ...formData,
          updatedAt: Timestamp.now()
        })
      } else {
        await addDoc(collection(db, 'journeys'), {
          ...formData,
          createdAt: Timestamp.now()
        })
      }
      resetForm()
      fetchJourneys()
    } catch (error) {
      console.error('Error saving journey:', error)
      alert('Error saving journey.')
    }
  }

  const handleEdit = (journey) => {
    setFormData({ ...emptyForm, ...journey })
    setEditingId(journey.id)
    setShowForm(true)
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

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div>Loading journeys...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Journey Management</h1>
        <button
          onClick={() => { if (showForm) { resetForm() } else { setShowForm(true) } }}
          style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Journey'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Journey' : 'Add New Journey'}</h2>
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

          <div style={{ marginBottom: '15px', border: '2px solid #d1356f', borderRadius: '6px', padding: '15px', background: '#fff5f9' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>📸 Featured Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
            {uploading && <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>⏳ Uploading...</p>}
            {formData.featuredImage && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ color: '#666', fontSize: '12px', margin: '0 0 8px 0' }}>✅ Current image:</p>
                <img src={formData.featuredImage} alt="Preview" style={{ maxWidth: '250px', borderRadius: '6px', display: 'block' }} />
              </div>
            )}
          </div>

          <button type="submit" disabled={uploading} style={{ padding: '10px 20px', background: uploading ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: uploading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
            {editingId ? 'Update Journey' : 'Save Journey'}
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
              <div key={journey.id} style={{ border: '1px solid #ddd', borderRadius: '6px', background: '#f9f9f9', overflow: 'hidden' }}>
                {journey.featuredImage ? (
                  <img src={journey.featuredImage} alt={journey.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '160px', background: 'linear-gradient(135deg, #d1356f, #D4A574)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px' }}>
                    No Image Yet
                  </div>
                )}
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{journey.title}</h3>
                  <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>{journey.description}</p>
                  <p style={{ margin: '4px 0' }}><strong>📍 Destination:</strong> {journey.destination}</p>
                  <p style={{ margin: '4px 0' }}><strong>⏱️ Duration:</strong> {journey.duration} days</p>
                  <p style={{ margin: '4px 0' }}><strong>📈 Difficulty:</strong> {journey.difficulty}</p>
                  <p style={{ margin: '4px 0' }}><strong>💰 Price:</strong> ${journey.price}</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '8px 12px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleEdit(journey)}>
                      ✏️ Edit
                    </button>
                    <button style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleDeleteJourney(journey.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
