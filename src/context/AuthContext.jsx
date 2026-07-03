import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [adminRole, setAdminRole] = useState(null)
  const [loading, setLoading] = useState(false)

  // Bypass login - no Firebase needed
  const handleLogin = async (email, password) => {
    setLoading(true)
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Define admin users
      const admins = {
        'ambuj@indiareisen.com': { email: 'ambuj@indiareisen.com', role: 'full' },
        'team@indiareisen.com': { email: 'team@indiareisen.com', role: 'limited' },
        'pulkit@indiareisen.com': { email: 'pulkit@indiareisen.com', role: 'limited' },
        'gunjan@indiareisen.com': { email: 'gunjan@indiareisen.com', role: 'limited' }
      }

      // Check if user exists
      if (admins[email]) {
        const admin = admins[email]
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(admin))
        setUser(admin)
        setAdminRole(admin.role)
      } else {
        throw new Error('User not found. Use a demo admin account.')
      }
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('user')
    setUser(null)
    setAdminRole(null)
  }

  const handlePasswordReset = async (email) => {
    console.log('Password reset requested for:', email)
    // Mock implementation
  }

  const hasPermission = (requiredRole) => {
    if (!user) return false
    if (requiredRole === 'full') return adminRole === 'full'
    if (requiredRole === 'limited') return adminRole === 'limited' || adminRole === 'full'
    return true
  }

  const isAdmin = () => !!user

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUser(user)
      setAdminRole(user.role)
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      adminRole,
      loading,
      handleLogin,
      handleLogout,
      handlePasswordReset,
      hasPermission,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
