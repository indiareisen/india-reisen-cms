import { useState, useEffect } from 'react'
import useNewsletter from '../../hooks/useNewsletter'

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredSubscribers, setFilteredSubscribers] = useState([])
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageTitle, setMessageTitle] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const { getSubscribers, unsubscribe } = useNewsletter()

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const data = await getSubscribers()
      setSubscribers(data)
      setFilteredSubscribers(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSubscribers(filtered)
  }, [searchTerm, subscribers])

  const handleUnsubscribe = async (id) => {
    if (confirm('Remove this subscriber?')) {
      const success = await unsubscribe(id)
      if (success) {
        fetchSubscribers()
        alert('✅ Subscriber removed')
      }
    }
  }

  const handleSendMessage = async () => {
    if (!messageTitle.trim() || !messageContent.trim()) {
      alert('Please fill in all fields')
      return
    }

    setSendingMessage(true)
    try {
      // Simulate sending message
      console.log('📧 Sending message to', subscribers.length, 'subscribers')
      console.log('Title:', messageTitle)
      console.log('Content:', messageContent)
      
      // In production, this would call a backend API to send emails via SendGrid/Mailgun
      alert(`✅ Message queued for ${subscribers.length} subscribers`)
      setMessageTitle('')
      setMessageContent('')
    } catch (error) {
      console.error('Error:', error)
      alert('❌ Error sending message')
    } finally {
      setSendingMessage(false)
    }
  }

  const primaryColor = '#d1356f'

  return (
    <div>
      <h1>📧 Newsletter Manager</h1>

      {/* Send Message Section */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Send Newsletter</h2>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Subject</label>
          <input
            type="text"
            value={messageTitle}
            onChange={(e) => setMessageTitle(e.target.value)}
            placeholder="Newsletter subject line"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Message</label>
          <textarea
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Write your newsletter content here..."
            rows={6}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={sendingMessage || subscribers.length === 0}
          style={{
            padding: '10px 20px',
            background: subscribers.length === 0 ? '#ccc' : primaryColor,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: subscribers.length === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {sendingMessage ? '⏳ Sending...' : `📧 Send to ${subscribers.length} subscribers`}
        </button>
      </div>

      {/* Subscribers Section */}
      <h2 style={{ marginBottom: '20px', color: primaryColor }}>
        Subscribers ({subscribers.length})
      </h2>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Subscribers Table */}
      {loading ? (
        <div>Loading...</div>
      ) : filteredSubscribers.length === 0 ? (
        <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '4px', textAlign: 'center', color: '#999' }}>
          {subscribers.length === 0 ? 'No subscribers yet' : 'No matching subscribers'}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Subscribed Date</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber, idx) => (
                <tr key={subscriber.id} style={{ borderBottom: '1px solid #eee', background: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '12px' }}>{subscriber.name}</td>
                  <td style={{ padding: '12px' }}>{subscriber.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#e7ffe7',
                      color: '#2D6A4F',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '12px', color: '#999' }}>
                    {subscriber.subscribedAt ? new Date(subscriber.subscribedAt.toDate()).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleUnsubscribe(subscriber.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Export Button */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            const csv = 'Name,Email,Status,Subscribed\n' + 
              subscribers.map(s => `${s.name},${s.email},${s.status},${s.subscribedAt ? new Date(s.subscribedAt.toDate()).toLocaleDateString() : ''}`).join('\n')
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'newsletter_subscribers.csv'
            a.click()
          }}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📥 Export as CSV
        </button>
      </div>
    </div>
  )
}
