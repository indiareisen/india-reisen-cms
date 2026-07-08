import { auth } from '../services/firebaseService'
import { createUserWithEmailAndPassword } from 'firebase/auth'

// Admin users to create
const ADMIN_USERS = [
  { email: 'ambuj@indiareisen.com', password: 'Ambuj@2024!' },
  { email: 'team@indiareisen.com', password: 'Team@2024!' },
  { email: 'pulkit@indiareisen.com', password: 'Pulkit@2024!' },
  { email: 'gunjan@indiareisen.com', password: 'Gunjan@2024!' }
]

export async function createAdminUsers() {
  console.log('🔐 Creating admin users in Firebase...')
  
  for (const user of ADMIN_USERS) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )
      console.log(`✅ Created: ${user.email}`)
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Already exists: ${user.email}`)
      } else {
        console.error(`❌ Error creating ${user.email}:`, error.message)
      }
    }
  }
  
  console.log('Done! Here are your admin credentials:')
  ADMIN_USERS.forEach(user => {
    console.log(`📧 ${user.email} / 🔑 ${user.password}`)
  })
}
