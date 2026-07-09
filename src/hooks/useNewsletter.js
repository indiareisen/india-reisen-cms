import { collection, addDoc, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebaseService'

export default function useNewsletter() {
  const subscribeToNewsletter = async (email, name) => {
    try {
      console.log('📧 Subscribing to newsletter:', email)
      
      // Check if already subscribed
      const q = query(collection(db, 'newsletterSubscribers'))
      const existing = await getDocs(q)
      const isSubscribed = existing.docs.some(doc => doc.data().email === email)
      
      if (isSubscribed) {
        console.log('⚠️ Already subscribed:', email)
        throw new Error('Email already subscribed')
      }

      const result = await addDoc(collection(db, 'newsletterSubscribers'), {
        email,
        name: name || 'Subscriber',
        subscribedAt: new Date(),
        status: 'active'
      })

      console.log('✅ Newsletter subscription added:', result.id)
      return { success: true, message: 'Successfully subscribed!' }
    } catch (error) {
      console.error('❌ Newsletter subscription error:', error)
      if (error.message === 'Email already subscribed') {
        throw new Error('This email is already subscribed')
      }
      throw error
    }
  }

  const getSubscribers = async () => {
    try {
      const q = query(collection(db, 'newsletterSubscribers'), orderBy('subscribedAt', 'desc'))
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      return []
    }
  }

  const unsubscribe = async (id) => {
    try {
      await deleteDoc(doc(db, 'newsletterSubscribers', id))
      console.log('✅ Unsubscribed:', id)
      return true
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return false
    }
  }

  return {
    subscribeToNewsletter,
    getSubscribers,
    unsubscribe
  }
}
