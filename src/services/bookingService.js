import { db } from '../config/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const bookingsRef = collection(db, 'bookings');

export const createBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: new Date(),
      status: 'pending',
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const snapshot = await getDocs(bookingsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const getCustomerBookings = async (email) => {
  try {
    const q = query(bookingsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (id, data) => {
  try {
    await updateDoc(doc(db, 'bookings', id), data);
  } catch (error) {
    throw error;
  }
};
