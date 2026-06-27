import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

const adminsRef = collection(db, 'admins');

export const createAdmin = async (adminData) => {
  try {
    const docRef = await addDoc(adminsRef, {
      ...adminData,
      createdAt: new Date(),
      role: adminData.role || 'viewer',
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getAdmins = async () => {
  try {
    const snapshot = await getDocs(adminsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const updateAdminRole = async (id, role) => {
  try {
    await updateDoc(doc(db, 'admins', id), { role });
  } catch (error) {
    throw error;
  }
};
