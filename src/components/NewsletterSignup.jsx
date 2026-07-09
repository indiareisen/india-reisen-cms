import { useState } from 'react'
import useNewsletter from '../hooks/useNewsletter'

export default function NewsletterSignup({ primaryColor, secondaryColor }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { subscribeToNewsletter } = useNewsletter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await subscribeToNewsletter(email, name)
      setMessage({ type: 'success', text: '✅ Welcome to our newsletter!' })
      setEmail('')
      setName('')
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '32px', margin: '0 0 15px 0' }}>📧 Stay Updated</h2>
        <p style={{ fontSize: '16px', margin: '0 0 30px 0', opacity: 0.9 }}>
          Subscribe to our newsletter for exclusive travel tips, special offers, and inspiring stories
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '12px 15px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px 15px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              background: 'white',
              color: primaryColor,
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s'
            }}
          >
            {loading ? '⏳ Subscribing...' : '✉️ Subscribe'}
          </button>
        </form>

        {message.text && (
          <div style={{
            marginTop: '15px',
            padding: '12px',
            background: message.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
            borderRadius: '6px',
            fontSize: '14px',
            color: 'white'
          }}>
            {message.text}
          </div>
        )}

        <p style={{ margin: '20px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
