import { createContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebaseService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Monitor auth state changes
  useEffect(() => {
    console.log('🔐 Setting up auth state listener...')
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('👤 Auth state changed:', currentUser?.email || 'logged out')
      
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          loginTime: new Date().toISOString()
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      console.log('🔐 Cleaning up auth listener')
      unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      console.log('🔐 Firebase login attempt:', email)
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      console.log('✅ Firebase login successful:', userCredential.user.email)
      
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        loginTime: new Date().toISOString()
      })
      
      return userCredential.user
    } catch (err) {
      console.error('❌ Firebase error code:', err.code)
      console.error('❌ Firebase error message:', err.message)
      
      let errorMessage = 'Login failed'
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Did you create the account on /admin/setup?'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.'
      }
      
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      console.log('🔐 Logging out...')
      await signOut(auth)
      setUser(null)
      console.log('✅ Logged out')
    } catch (err) {
      console.error('❌ Logout error:', err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
