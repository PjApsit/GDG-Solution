/**
 * Firestore Service — Client-side CRUD operations
 * WHY: Direct Firestore access for real-time data. Components use hooks
 * built on top of these functions.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ── Events ──

export const subscribeToEvents = (callback) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, 'events'),
    where('is_active', '==', true),
    orderBy('priority_score', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
};

export const getEventsOnce = async () => {
  if (!db) return [];
  const q = query(
    collection(db, 'events'),
    where('is_active', '==', true),
    orderBy('priority_score', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEventToFirestore = async (event, userId) => {
  if (!db) throw new Error('Firestore not configured.');
  const docRef = await addDoc(collection(db, 'events'), {
    ...event,
    created_by: userId || null,
    is_active: true,
    schema_version: 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
};

// ── Tasks ──

export const subscribeToTasks = (callback, filters = {}) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  let q = query(collection(db, 'tasks'), where('is_active', '==', true));

  // Note: Firestore doesn't support dynamic query building easily,
  // so we filter client-side for optional filters
  return onSnapshot(q, (snapshot) => {
    let tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.volunteer_id) {
      tasks = tasks.filter(t => t.volunteer_id === filters.volunteer_id);
    }
    if (filters.ngo_id) {
      tasks = tasks.filter(t => t.ngo_id === filters.ngo_id);
    }

    callback(tasks);
  });
};

export const getTasksOnce = async () => {
  if (!db) return [];
  const q = query(collection(db, 'tasks'), where('is_active', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ── Posts ──

export const subscribeToPosts = (callback) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, 'posts'),
    where('is_active', '==', true),
    orderBy('created_at', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};

export const addPostToFirestore = async (post, userId) => {
  if (!db) throw new Error('Firestore not configured.');
  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    created_by: userId,
    likes: 0,
    comments: 0,
    volunteers_joined: 0,
    is_active: true,
    schema_version: 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
};

// ── Users ──

export const subscribeToVolunteers = (callback) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, 'users'),
    where('role', '==', 'volunteer'),
    where('is_active', '==', true)
  );
  return onSnapshot(q, (snapshot) => {
    const volunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(volunteers);
  });
};

export const getUserProfile = async (uid) => {
  if (!db) return null;
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};
