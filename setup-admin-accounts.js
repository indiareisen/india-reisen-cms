import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// You'll need to add your Firebase service account key
// For now, we'll use the web SDK instead

import { initializeApp as initializeWebApp } from 'firebase/app';
import { getFirestore as getFirestoreWeb } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeWebApp(firebaseConfig);
const db = getFirestoreWeb(app);

const admins = [
  {
    email: 'ambuj@indiareisen.com',
    name: 'Ambuj',
    role: 'full'
  },
  {
    email: 'team@indiareisen.com',
    name: 'Team',
    role: 'limited'
  },
  {
    email: 'pulkit@indiareisen.com',
    name: 'Pulkit',
    role: 'limited'
  },
  {
    email: 'Gunjan@indiareisen.com',
    name: 'Gunjan',
    role: 'limited'
  }
];

async function setupAdminAccounts() {
  console.log('Setting up admin accounts in Firestore...');
  
  try {
    for (const admin of admins) {
      await setDoc(doc(db, 'admins', admin.email), {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Created admin: ${admin.email} (${admin.role})`);
    }
    
    console.log('\n🎉 All admin accounts created successfully!');
    console.log('\nNext step: Create Firebase Authentication users in Console');
  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error);
  }
}

setupAdminAccounts();
