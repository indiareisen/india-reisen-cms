import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "india-reisen-cms.firebaseapp.com",
  projectId: "india-reisen-cms",
  storageBucket: "india-reisen-cms.appspot.com",
  messagingSenderId: "862055227943",
  appId: "1:862055227943:web:a4b82cf5df5e9f4e526ab4"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
