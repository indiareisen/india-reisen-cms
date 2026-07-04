import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading reviews...</div>

  return (
    <div>
      <h1>Reviews Management</h1>
      <p>Manage and display customer reviews</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Customer Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>{review.name} <span style={{ fontSize: '14px', color: '#999' }}>({review.country})</span></h3>
                    <p style={{ margin: '5px 0' }}>⭐ {review.rating}/5</p>
                    <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{review.title}</p>
                    <p>{review.content}</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>Journey: {review.journey}</p>
                  </div>
                  {review.image && <img src={review.image} alt={review.name} style={{ width: '60px', height: '60px', borderRadius: '50%', marginLeft: '15px' }} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
