import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate verification token
export const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Store OTP in Firebase
export const storeOTP = async (phone, otp) => {
  try {
    await addDoc(collection(db, 'phoneOTPs'), {
      phone: phone.replace(/\D/g, ''),
      otp,
      verified: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
    return true;
  } catch (error) {
    console.error('Error storing OTP:', error);
    return false;
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  try {
    const q = query(
      collection(db, 'phoneOTPs'),
      where('phone', '==', phone.replace(/\D/g, ''))
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    
    const otpDoc = snapshot.docs[0];
    const data = otpDoc.data();
    
    // Check if OTP matches and not expired
    if (data.otp === otp && data.expiresAt.toDate() > new Date()) {
      await updateDoc(otpDoc.ref, { verified: true });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};

// Store email verification token
export const storeEmailToken = async (email, token) => {
  try {
    await addDoc(collection(db, 'emailVerifications'), {
      email: email.toLowerCase(),
      token,
      verified: false,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });
    return true;
  } catch (error) {
    console.error('Error storing email token:', error);
    return false;
  }
};

// Verify email token
export const verifyEmailToken = async (token) => {
  try {
    const q = query(
      collection(db, 'emailVerifications'),
      where('token', '==', token)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return { verified: false, email: null };
    
    const emailDoc = snapshot.docs[0];
    const data = emailDoc.data();
    
    if (data.expiresAt.toDate() > new Date()) {
      await updateDoc(emailDoc.ref, { verified: true });
      return { verified: true, email: data.email };
    }
    return { verified: false, email: null };
  } catch (error) {
    console.error('Error verifying email token:', error);
    return { verified: false, email: null };
  }
};
