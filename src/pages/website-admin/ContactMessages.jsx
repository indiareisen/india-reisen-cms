import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [replyText, setReplyText] = useState('')

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

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await deleteDoc(doc(db, 'contactMessages', id))
        fetchMessages()
        setSelectedMsg(null)
      } catch (error) {
        console.error('Error deleting message:', error)
      }
    }
  }

  const handleReply = async (msgId) => {
    // In a real app, this would send an email
    try {
      await updateDoc(doc(db, 'contactMessages', msgId), {
        status: 'replied',
        reply: replyText,
        replyDate: new Date()
      })
      setReplyText('')
      fetchMessages()
      setSelectedMsg(null)
      alert('Reply sent!')
    } catch (error) {
      console.error('Error sending reply:', error)
    }
  }

  if (loading) return <div>Loading messages...</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      {/* Messages List */}
      <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h2>Inquiries ({messages.length})</h2>
        <div style={{ display: 'grid', gap: '10px', maxHeight: '600px', overflow: 'auto' }}>
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                onClick={() => setSelectedMsg(msg)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '6px', 
                  background: selectedMsg?.id === msg.id ? '#d1356f' : '#f9f9f9',
                  color: selectedMsg?.id === msg.id ? 'white' : 'black',
                  cursor: 'pointer',
                  border: '1px solid #ddd'
                }}
              >
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{msg.name}</p>
                <p style={{ margin: '0', fontSize: '12px' }}>{msg.email}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Details & Reply */}
      {selectedMsg && (
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
          <h2>Message Details</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Name:</strong> {selectedMsg.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${selectedMsg.email}`}>{selectedMsg.email}</a></p>
            <p><strong>Phone:</strong> <a href={`tel:${selectedMsg.phone}`}>{selectedMsg.phone}</a></p>
            <p><strong>Journey Interest:</strong> {selectedMsg.journey}</p>
            <p><strong>Message:</strong></p>
            <p style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{selectedMsg.message}</p>
          </div>

          {selectedMsg.status !== 'replied' && (
            <>
              <textarea 
                placeholder="Write your reply..." 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '10px', minHeight: '100px', boxSizing: 'border-box' }}
              />
              <button 
                onClick={() => handleReply(selectedMsg.id)}
                style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
              >
                📧 Send Reply
              </button>
            </>
          )}

          {selectedMsg.status === 'replied' && (
            <div style={{ padding: '10px', background: '#d4edda', borderRadius: '4px', marginBottom: '10px' }}>
              <p><strong>✓ Replied</strong></p>
              <p>{selectedMsg.reply}</p>
            </div>
          )}

          <button 
            onClick={() => handleDeleteMessage(selectedMsg.id)}
            style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            🗑️ Delete Message
          </button>
        </div>
      )}
    </div>
  )
}
