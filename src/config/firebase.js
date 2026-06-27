import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-2-orXSJg3xdq646v2VWpCyDFy5jkeAg",
  authDomain: "india-reisen-cms.firebaseapp.com",
  projectId: "india-reisen-cms",
  storageBucket: "india-reisen-cms.firebasestorage.app",
  messagingSenderId: "111988014610",
  appId: "1:111988014610:web:8a99ceb6c2d1ef668162cb",
  measurementId: "G-4L1JLYK3DH"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
