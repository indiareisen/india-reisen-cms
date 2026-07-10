import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function FAQManager() {
  const [faqs, setFaqs] = useState([])
  const [formData, setFormData] = useState({ question: '', answer: '', order: 0 })
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const q = query(collection(db, 'faqs'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...formData, order: Number(formData.order) || 0 }
      if (editing) {
        await updateDoc(doc(db, 'faqs', editing), payload)
        setEditing(null)
      } else {
        await addDoc(collection(db, 'faqs'), payload)
      }
      setFormData({ question: '', answer: '', order: faqs.length })
      fetchFaqs()
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving FAQ')
    }
  }

  const handleEdit = (faq) => {
    setEditing(faq.id)
    setFormData({ question: faq.question, answer: faq.answer, order: faq.order || 0 })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this FAQ?')) {
      await deleteDoc(doc(db, 'faqs', id))
      fetchFaqs()
    }
  }

  const primaryColor = '#d1356f'
  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }

  return (
    <div>
      <h1>❓ FAQ Manager</h1>
      <p style={{ color: '#666' }}>Manage frequently asked questions shown on the homepage</p>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>{editing ? 'Edit FAQ' : 'Add New FAQ'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. What's included in the price?"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Write the answer..."
              required
              rows={4}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '15px', maxWidth: '150px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button type="submit" style={{ padding: '10px 20px', background: primaryColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editing ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => { setEditing(null); setFormData({ question: '', answer: '', order: faqs.length }) }}
              style={{ marginLeft: '10px', padding: '10px 20px', background: '#999', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <h2>All FAQs ({faqs.length})</h2>
      {loading ? (
        <div>Loading...</div>
      ) : faqs.length === 0 ? (
        <p>No FAQs yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {faqs.map(faq => (
            <div key={faq.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>#{faq.order} — {faq.question}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>{faq.answer?.substring(0, 120)}...</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <button onClick={() => handleEdit(faq)} style={{ padding: '8px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                <button onClick={() => handleDelete(faq.id)} style={{ padding: '8px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
