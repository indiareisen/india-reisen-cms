import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for auth to finish loading
    if (!loading) {
      setIsReady(true)
      console.log('🔐 Auth check complete. User:', user?.email || 'not logged in')
    }
  }, [loading, user])

  // While loading, show nothing
  if (!isReady || loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Checking authentication...</div>
  }

  // If no user, redirect to login
  if (!user) {
    console.log('❌ No user found, redirecting to login')
    return <Navigate to="/admin/login" replace />
  }

  // User is authenticated, show the page
  console.log('✅ User authenticated:', user.email)
  return children
}
