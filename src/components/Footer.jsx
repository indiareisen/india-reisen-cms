import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebaseService'

export default function Footer() {
  const [settings, setSettings] = useState({
    siteName: 'India Reisen',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    primaryColor: '#d1356f',
    socialMedia: {}
  })

  useEffect(() => {
    loadSettings()
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
                  <a 
                    key={platform}
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
