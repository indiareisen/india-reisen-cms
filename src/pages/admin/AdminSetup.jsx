import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../services/firebaseService'

const ADMIN_USERS = [
  { email: 'ambuj@indiareisen.com', password: 'Ambuj@2024!' },
  { email: 'team@indiareisen.com', password: 'Team@2024!' },
  { email: 'pulkit@indiareisen.com', password: 'Pulkit@2024!' },
  { email: 'gunjan@indiareisen.com', password: 'Gunjan@2024!' }
]

export default function AdminSetup() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleSetup = async () => {
    setLoading(true)
    setStatus('Setting up admin users...')
    setResults([])

    const createdUsers = []

    for (const user of ADMIN_USERS) {
      try {
        console.log(`📧 Creating: ${user.email}`)
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
        console.log(`✅ Created: ${user.email}`)
        createdUsers.push({
          email: user.email,
          password: user.password,
          status: 'Created ✅'
        })
        setResults([...createdUsers])
      } catch (error) {
        console.error(`❌ Error for ${user.email}:`, error.message)
        
        let message = error.message
        if (error.code === 'auth/email-already-in-use') {
          message = 'Already exists ⚠️'
        }
        
        createdUsers.push({
          email: user.email,
          password: user.password,
          status: message
        })
        setResults([...createdUsers])
      }
    }

    setStatus('✅ Admin users setup complete!')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #d1356f, #D4A574)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#d1356f', textAlign: 'center' }}>🔐 Admin Setup</h1>
        
        <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
          Create admin user accounts for Firebase Authentication
        </p>

        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', color: '#333' }}>Admin Users to Create:</p>
          <ul style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {ADMIN_USERS.map(user => (
              <li key={user.email} style={{ marginBottom: '8px' }}>
                <code style={{ background: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                  {user.email}
                </code>
              </li>
            ))}
          </ul>
        </div>

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
            marginBottom: '20px',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Creating users...' : '🚀 Create Admin Users'}
        </button>

        {status && (
          <div style={{
            padding: '15px',
            background: status.includes('complete') ? '#e7ffe7' : '#fff3e0',
            color: status.includes('complete') ? '#2D6A4F' : '#F57C00',
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {status}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Results:</p>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {results.map(result => (
                <div key={result.email} style={{
                  background: '#f9f9f9',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  border: '1px solid #ddd'
                }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <strong>{result.email}</strong><br/>
                    Password: <code style={{ background: 'white', padding: '2px 4px' }}>{result.password}</code><br/>
                    Status: {result.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '6px', fontSize: '12px', color: '#0d47a1' }}>
          💡 <strong>Next Steps:</strong><br/>
          1. Click "Create Admin Users" button<br/>
          2. Wait for all users to be created<br/>
          3. Copy the passwords and save securely<br/>
          4. Go to <a href="/admin/login" style={{ color: '#d1356f' }}>/admin/login</a> to test
        </div>
      </div>
    </div>
  )
}
