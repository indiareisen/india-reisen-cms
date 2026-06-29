import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8s6UzPqT_BpuKa8eU5jg6",
  authDomain: "india-reisen-cms.firebaseapp.com",
  projectId: "india-reisen-cms",
  storageBucket: "india-reisen-cms.appspot.com",
  messagingSenderId: "862055227943",
  appId: "1:862055227943:web:a4b82cf5df5e9f4e526ab4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const admins = [
  { email: 'ambuj@indiareisen.com', name: 'Ambuj', role: 'full' },
  { email: 'team@indiareisen.com', name: 'Team', role: 'limited' },
  { email: 'pulkit@indiareisen.com', name: 'Pulkit', role: 'limited' },
  { email: 'Gunjan@indiareisen.com', name: 'Gunjan', role: 'limited' }
];

async function createAdminAccounts() {
  console.log('🔄 Setting up admin accounts in Firestore...\n');
  
  try {
    for (const adminUser of admins) {
      await setDoc(doc(db, 'admins', adminUser.email), {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        createdAt: new Date()
      });
      console.log(`✅ ${adminUser.email} → role: ${adminUser.role}`);
    }
    
    console.log('\n🎉 All admin accounts created!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminAccounts();
