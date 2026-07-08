import { useState } from 'react'
import { createAdminUsers } from '../../utils/setupAdminUsers'

export default function AdminSetup() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    setStatus('Setting up admin users...')
    
    try {
      await createAdminUsers()
      setStatus('✅ Admin users created successfully! Check console for credentials.')
    } catch (err) {
      setStatus(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f0f0'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '500px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#d1356f' }}>🔐 Admin Setup</h1>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This will create the following admin users in Firebase:
        </p>

        <ul style={{ color: '#666', marginBottom: '30px' }}>
          <li>ambuj@indiareisen.com</li>
          <li>team@indiareisen.com</li>
          <li>pulkit@indiareisen.com</li>
          <li>gunjan@indiareisen.com</li>
        </ul>

        <button
          onClick={handleSetup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            background: '#d1356f',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          {loading ? '⏳ Setting up...' : '🚀 Create Admin Users'}
        </button>

        {status && (
          <div style={{
            padding: '15px',
            background: status.includes('✅') ? '#e7ffe7' : '#fee',
            color: status.includes('✅') ? '#2D6A4F' : '#c33',
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            {status}
          </div>
        )}

        <p style={{ color: '#999', fontSize: '12px', marginTop: '20px' }}>
          📝 Passwords will be shown in the browser console. Save them securely.
        </p>
      </div>
    </div>
  )
}
