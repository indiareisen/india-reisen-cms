import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'
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

  const handleApproveReview = async (id) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { approved: true })
      fetchReviews()
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteDoc(doc(db, 'reviews', id))
        fetchReviews()
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  if (loading) return <div>Loading reviews...</div>

  const approvedReviews = reviews.filter(r => r.approved)
  const pendingReviews = reviews.filter(r => !r.approved)

  return (
    <div>
      <h1>Reviews Management</h1>

      {pendingReviews.length > 0 && (
        <div style={{ marginBottom: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
          <h2>⏳ Pending Approval ({pendingReviews.length})</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {pendingReviews.map(review => (
              <div key={review.id} style={{ background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #ffc107' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{review.name} <span style={{ fontSize: '14px', color: '#999' }}>({review.country})</span></h3>
                    <p style={{ margin: '5px 0' }}>⭐ {review.rating}/5</p>
                    <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{review.title}</p>
                    <p>{review.content}</p>
                    <p style={{ fontSize: '12px', color: '#999' }}>Journey: {review.journey}</p>
                  </div>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleApproveReview(review.id)}
                    style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    🗑️ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>✓ Published Reviews ({approvedReviews.length})</h2>
        {approvedReviews.length === 0 ? (
          <p>No approved reviews yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {approvedReviews.map(review => (
              <div key={review.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '6px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{review.name} <span style={{ fontSize: '14px', color: '#999' }}>({review.country})</span></h3>
                    <p style={{ margin: '5px 0' }}>⭐ {review.rating}/5</p>
                    <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{review.title}</p>
                    <p>{review.content}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteReview(review.id)}
                  style={{ marginTop: '10px', padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
