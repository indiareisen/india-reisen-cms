import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ITINERARIES
export const createItinerary = async (data) => {
  const docRef = await addDoc(collection(db, 'itineraries'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getItineraries = async () => {
  const q = query(collection(db, 'itineraries'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getItinerary = async (id) => {
  const docSnap = await getDoc(doc(db, 'itineraries', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateItinerary = async (id, data) => {
  await updateDoc(doc(db, 'itineraries', id), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteItinerary = async (id) => {
  await deleteDoc(doc(db, 'itineraries', id));
};

export const addItinerary = createItinerary;

// BLOGS
export const createBlog = async (data) => {
  const docRef = await addDoc(collection(db, 'blogs'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getBlogs = async () => {
  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getBlog = async (id) => {
  const docSnap = await getDoc(doc(db, 'blogs', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateBlog = async (id, data) => {
  await updateDoc(doc(db, 'blogs', id), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteBlog = async (id) => {
  await deleteDoc(doc(db, 'blogs', id));
};

export const addBlog = createBlog;

// TEAM MEMBERS
export const createTeamMember = async (data) => {
  const docRef = await addDoc(collection(db, 'teamMembers'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getTeamMembers = async () => {
  const q = query(collection(db, 'teamMembers'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getTeamMember = async (id) => {
  const docSnap = await getDoc(doc(db, 'teamMembers', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateTeamMember = async (id, data) => {
  await updateDoc(doc(db, 'teamMembers', id), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteTeamMember = async (id) => {
  await deleteDoc(doc(db, 'teamMembers', id));
};

export const addTeamMember = createTeamMember;

// REVIEWS
export const createReview = async (data) => {
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getReviews = async () => {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getReview = async (id) => {
  const docSnap = await getDoc(doc(db, 'reviews', id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateReview = async (id, data) => {
  await updateDoc(doc(db, 'reviews', id), {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteReview = async (id) => {
  await deleteDoc(doc(db, 'reviews', id));
};

export const addReview = createReview;

// MEDIA
export const createMedia = async (data) => {
  const docRef = await addDoc(collection(db, 'media'), {
    ...data,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getMedia = async () => {
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getMediaByType = async (type) => {
  const q = query(
    collection(db, 'media'),
    where('type', '==', type),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteMedia = async (id) => {
  await deleteDoc(doc(db, 'media', id));
};

export const addMedia = createMedia;

// SETTINGS
export const getSetting = async (key) => {
  const docSnap = await getDoc(doc(db, 'settings', key));
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateSetting = async (key, data) => {
  await updateDoc(doc(db, 'settings', key), {
    ...data,
    updatedAt: Timestamp.now()
  });
};
