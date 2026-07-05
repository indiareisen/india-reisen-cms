import { useState, useEffect } from 'react'
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    journey: '',
    message: ''
  })
  const [settings, setSettings] = useState({
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    primaryColor: '#d1356f',
    facebook: 'indiareisenofficial',
    instagram: '@indiareisen',
    youtube: '@indiareisen'
  })
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSettingsFromDB()
  }, [])

  const loadSettingsFromDB = async () => {
    try {
      const docRef = doc(db, 'settings', 'general')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(prev => ({
          ...prev,
          ...docSnap.data()
        }))
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
    } finally {
      setLoadingSettings(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: Timestamp.now(),
        status: 'pending'
      })
      setFormData({ name: '', email: '', phone: '', journey: '', message: '' })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError('Failed to send message. Please try again.')
      console.error('Error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const brandColor = settings?.primaryColor || '#d1356f'

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '10px', color: brandColor }}>Contact Us</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Have questions? We'd love to hear from you. Get in touch with our team.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Contact Form */}
        <div>
          <h2 style={{ color: brandColor, marginBottom: '20px' }}>Send us a Message</h2>
          
          {submitted && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}>
              ✓ Message sent! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Interested Journey</label>
              <input
                type="text"
                name="journey"
                value={formData.journey}
                onChange={handleChange}
                placeholder="e.g., Golden Triangle, Kerala Backwaters"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '120px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '12px',
                background: brandColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Info from Settings */}
        <div>
          <h2 style={{ color: brandColor, marginBottom: '20px' }}>Contact Information</h2>
          
          {loadingSettings ? (
            <p>Loading contact information...</p>
          ) : (
            <>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Email</h3>
                <a href={`mailto:${settings.email}`} style={{ color: brandColor, textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
                  {settings.email}
                </a>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Phone</h3>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} style={{ color: brandColor, textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
                  {settings.phone}
                </a>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Address</h3>
                <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
                  {settings.address}
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Follow Us</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {settings.facebook && (
                    <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noopener noreferrer" title="Facebook" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      background: brandColor,
                      color: 'white',
                      borderRadius: '50%',
                      textDecoration: 'none',
                      fontSize: '18px'
                    }}>
                      f
                    </a>
                  )}
                  {settings.instagram && (
                    <a href={`https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" title="Instagram" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      background: brandColor,
                      color: 'white',
                      borderRadius: '50%',
                      textDecoration: 'none',
                      fontSize: '18px'
                    }}>
                      📷
                    </a>
                  )}
                  {settings.twitter && (
                    <a href={`https://twitter.com/${settings.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" title="Twitter" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      background: brandColor,
                      color: 'white',
                      borderRadius: '50%',
                      textDecoration: 'none',
                      fontSize: '18px'
                    }}>
                      𝕏
                    </a>
                  )}
                  {settings.youtube && (
                    <a href={`https://youtube.com/${settings.youtube.replace('@', '')}`} target="_blank" rel="noopener noreferrer" title="YouTube" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      background: brandColor,
                      color: 'white',
                      borderRadius: '50%',
                      textDecoration: 'none',
                      fontSize: '18px'
                    }}>
                      ▶
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          <div style={{
            background: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: `2px solid ${brandColor}`
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: brandColor }}>Response Time</h3>
            <p style={{ color: '#666', margin: 0 }}>
              We typically respond to inquiries within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
