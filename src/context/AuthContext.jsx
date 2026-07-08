import { createContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebaseService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Monitor Firebase auth state
  useEffect(() => {
    console.log('🔐 Setting up Firebase auth listener...')
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('✅ Firebase user found:', currentUser.email)
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          loginTime: new Date().toISOString()
        })
      } else {
        console.log('❌ No Firebase user, logging out')
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login successful:', userCredential.user.email)
      
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        loginTime: new Date().toISOString()
      })
      return userCredential.user
    } catch (err) {
      console.error('❌ Login error:', err.code, err.message)
      
      let errorMessage = 'Login failed'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Create account on /admin/setup first.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase API key is invalid. Check your configuration.'
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
