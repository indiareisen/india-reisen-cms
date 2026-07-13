import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebaseService'
import useNewsletter from '../hooks/useNewsletter'

export default function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'India Reisen',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    primaryColor: '#d1356f',
    socialMedia: {}
  })

  const [email, setEmail] = useState('')
  const [subLoading, setSubLoading] = useState(false)
  const [subMessage, setSubMessage] = useState({ type: '', text: '' })
  const { subscribeToNewsletter } = useNewsletter()

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (document.getElementById('shapo-embed-js')) return
    const script = document.createElement('script')
    script.id = 'shapo-embed-js'
    script.src = 'https://cdn.shapo.io/js/embed.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const loadSettings = async () => {
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
    }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubLoading(true)
    setSubMessage({ type: '', text: '' })
    try {
      await subscribeToNewsletter(email, '')
      setSubMessage({ type: 'success', text: '✅ Subscribed! Welcome aboard.' })
      setEmail('')
    } catch (error) {
      setSubMessage({ type: 'error', text: `❌ ${error.message}` })
    } finally {
      setSubLoading(false)
    }
  }

  const getSocialIcon = (platform) => {
    const icons = {
      facebook: 'f',
      instagram: '📷',
      twitter: '𝕏',
      youtube: '▶',
      linkedin: 'in',
      whatsapp: '💬'
    }
    return icons[platform] || '•'
  }

  const getSocialLink = (platform, data) => {
    if (platform === 'whatsapp') {
      return data.url
    }
    return data.url
  }

  return (
    <footer style={{
      background: settings.primaryColor,
      color: 'white',
      marginTop: '50px'
    }}>
      {/* Google Reviews Widget */}
      <div style={{ background: 'white', padding: '35px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', color: settings.primaryColor, marginBottom: '20px', fontSize: '18px' }}>
            ⭐ What Our Travelers Say on Google
          </h3>
          <div style={{
            position: 'relative',
            border: `6px solid ${settings.primaryColor}`,
            borderRadius: '14px',
            padding: '20px 20px 0 20px',
            overflow: 'hidden'
          }}>
            <div id="shapo-widget-250772ab48798a9fd1ab"></div>

            {/* Branded strip masking the widget's bottom attribution badge */}
            <div style={{
              position: 'relative',
              marginTop: '-92px',
              zIndex: 5,
              background: `linear-gradient(135deg, ${settings.primaryColor}, #D4A574)`,
              padding: '28px 20px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '13px' }}>
                ⭐ Verified reviews from real India Reisen travelers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Bar */}
      <div style={{
        background: 'rgba(0,0,0,0.15)',
        padding: '35px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>📧 Stay Updated</h3>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>
              Travel tips, offers & stories — no spam, unsubscribe anytime.
            </p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '220px'
              }}
            />
            <button
              type="submit"
              disabled={subLoading}
              style={{
                padding: '10px 22px',
                background: 'white',
                color: settings.primaryColor,
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: subLoading ? 'not-allowed' : 'pointer',
                opacity: subLoading ? 0.6 : 1
              }}
            >
              {subLoading ? '⏳' : 'Subscribe'}
            </button>
          </form>
        </div>
        {subMessage.text && (
          <p style={{ maxWidth: '1200px', margin: '10px auto 0 auto', fontSize: '13px', textAlign: 'right' }}>
            {subMessage.text}
          </p>
        )}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>

          {/* About */}
          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>{settings.siteName}</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Crafting unforgettable journeys across India, Nepal, Bhutan, Tibet, and Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>Quick Links</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Home
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/journeys" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Journeys
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Blog
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Contact
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Privacy Policy
                </Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/terms-and-conditions" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>Get in Touch</h3>
            <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
              <strong>Email:</strong> <a href={`mailto:${settings.email}`} style={{ color: 'white' }}>{settings.email}</a>
            </p>
            <p style={{ fontSize: '14px', margin: '0 0 10px 0' }}>
              <strong>Phone:</strong> <a href={`tel:${settings.phone.replace(/\s/g, '')}`} style={{ color: 'white' }}>{settings.phone}</a>
            </p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              <strong>Address:</strong> {settings.address}
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h3 style={{ margin: '0 0 15px 0' }}>Follow Us</h3>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {settings.socialMedia && Object.entries(settings.socialMedia).map(([platform, data]) => (
                data.enabled && (
                  
                    <a key={platform}
                    href={getSocialLink(platform, data)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      borderRadius: '50%',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                      fontSize: '16px'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  >
                    {getSocialIcon(platform)}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '30px 0' }} />

        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <p style={{ margin: 0 }}>
            © 2024 {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
