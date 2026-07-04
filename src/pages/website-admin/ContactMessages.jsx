import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading messages...</div>

  return (
    <div>
      <h1>Contact Messages</h1>
      <p>View and respond to customer inquiries</p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Inquiries ({messages.length})</h2>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3>{msg.name}</h3>
                    <p style={{ margin: '5px 0' }}><strong>Email:</strong> {msg.email}</p>
                    <p style={{ margin: '5px 0' }}><strong>Phone:</strong> {msg.phone}</p>
                    <p style={{ margin: '5px 0' }}><strong>Message:</strong></p>
                    <p style={{ padding: '10px', background: 'white', borderRadius: '4px', marginTop: '5px' }}>{msg.message}</p>
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
