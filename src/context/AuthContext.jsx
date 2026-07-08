import { createContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebaseService'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
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

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        loginTime: new Date().toISOString()
      })
      return userCredential.user
    } catch (err) {
      let errorMessage = 'Login failed'
      
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please check your email.'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.'
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many login attempts. Please try again later.'
      }
      
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
