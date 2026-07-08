import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin/website')
    } catch (err) {
      // Error is displayed via AuthContext error state
      console.error('Login error:', err)
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
      background: 'linear-gradient(135deg, #d1356f, #D4A574)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" style={{ height: '60px', marginBottom: '20px' }} />
          <h1 style={{ margin: 0, color: '#d1356f', fontSize: '28px' }}>Admin Login</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ambuj@indiareisen.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#d1356f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1
            }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔓 Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Test Credentials:</p>
          <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
            📧 Email: <code>ambuj@indiareisen.com</code><br/>
            🔑 Password: Check your email setup
          </p>
        </div>
      </div>
    </div>
  )
}
