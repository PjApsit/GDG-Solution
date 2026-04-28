/**
 * Firestore Model Layer — Replaces dummy.js with real Firestore CRUD
 * WHY: Production data layer using Firebase Firestore.
 * Every document gets schema_version, is_active, created_at, updated_at.
 * 
 * Collections: users, events, tasks, posts
 */

import { adminDb } from '../config/firebase-admin.js';
import admin from 'firebase-admin';

const FieldValue = admin.firestore.FieldValue;

// ── Events ──

export const getEvents = async (filters = {}) => {
  let query = adminDb.collection('events').where('is_active', '==', true);

  if (filters.ngo_id) {
    query = query.where('created_by', '==', filters.ngo_id);
  }

  const snapshot = await query.orderBy('priority_score', 'desc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEvent = async (id) => {
  const doc = await adminDb.collection('events').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const addEvent = async (event, userId) => {
  const docRef = await adminDb.collection('events').add({
    ...event,
    created_by: userId || null,
    is_active: true,
    schema_version: 1,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const updateEvent = async (id, updates) => {
  const ref = adminDb.collection('events').doc(id);
  await ref.update({
    ...updates,
    updated_at: FieldValue.serverTimestamp(),
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
};

export const softDeleteEvent = async (id) => {
  await adminDb.collection('events').doc(id).update({
    is_active: false,
    updated_at: FieldValue.serverTimestamp(),
  });
};

// ── Tasks ──

export const getTasks = async (filters = {}) => {
  let query = adminDb.collection('tasks').where('is_active', '==', true);

  if (filters.ngo_id) {
    query = query.where('ngo_id', '==', filters.ngo_id);
  }
  if (filters.volunteer_id) {
    query = query.where('volunteer_id', '==', filters.volunteer_id);
  }
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getTask = async (id) => {
  const doc = await adminDb.collection('tasks').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const addTask = async (task, userId) => {
  const docRef = await adminDb.collection('tasks').add({
    ...task,
    ngo_id: userId || task.ngo_id,
    volunteer_id: null,
    status: 'open',
    is_active: true,
    schema_version: 1,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const updateTask = async (id, updates) => {
  const ref = adminDb.collection('tasks').doc(id);
  await ref.update({
    ...updates,
    updated_at: FieldValue.serverTimestamp(),
  });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
};

/**
 * Assign task to volunteer using Firestore transaction (Q12 — race conditions)
 */
export const assignTaskTransaction = async (taskId, volunteerId) => {
  const taskRef = adminDb.collection('tasks').doc(taskId);

  return adminDb.runTransaction(async (transaction) => {
    const taskDoc = await transaction.get(taskRef);

    if (!taskDoc.exists) throw new Error('Task not found');
    if (taskDoc.data().volunteer_id) throw new Error('Task already assigned');
    if (taskDoc.data().status !== 'open') throw new Error('Task is not open');

    transaction.update(taskRef, {
      volunteer_id: volunteerId,
      status: 'in_progress',
      assigned_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    // Update volunteer stats
    const volunteerRef = adminDb.collection('users').doc(volunteerId);
    transaction.update(volunteerRef, {
      tasks_active: admin.firestore.FieldValue.increment(1),
      updated_at: FieldValue.serverTimestamp(),
    });

    return { id: taskDoc.id, ...taskDoc.data(), volunteer_id: volunteerId, status: 'in_progress' };
  });
};

/**
 * Complete a task — update task status + volunteer stats
 */
export const completeTask = async (taskId, volunteerId) => {
  const taskRef = adminDb.collection('tasks').doc(taskId);
  const volunteerRef = adminDb.collection('users').doc(volunteerId);

  return adminDb.runTransaction(async (transaction) => {
    const taskDoc = await transaction.get(taskRef);
    if (!taskDoc.exists) throw new Error('Task not found');

    transaction.update(taskRef, {
      status: 'completed',
      completed_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    transaction.update(volunteerRef, {
      tasks_completed: admin.firestore.FieldValue.increment(1),
      tasks_active: admin.firestore.FieldValue.increment(-1),
      impact_points: admin.firestore.FieldValue.increment(50),
      last_task_completed_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return { id: taskDoc.id, status: 'completed' };
  });
};

// ── Posts ──

export const getPosts = async () => {
  const snapshot = await adminDb.collection('posts')
    .where('is_active', '==', true)
    .orderBy('created_at', 'desc')
    .limit(20)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addPost = async (post, userId) => {
  const docRef = await adminDb.collection('posts').add({
    ...post,
    created_by: userId,
    likes: 0,
    comments: 0,
    volunteers_joined: 0,
    is_active: true,
    schema_version: 1,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

// ── Users / Volunteers ──

export const getVolunteers = async (filters = {}) => {
  let query = adminDb.collection('users')
    .where('role', '==', 'volunteer')
    .where('is_active', '==', true);

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUser = async (uid) => {
  const doc = await adminDb.collection('users').doc(uid).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// ── Cleanup Cron (Q30) ──

/**
 * Reset tasks stuck in "in_progress" for >24 hours back to "open"
 */
export const cleanupAbandonedTasks = async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const snapshot = await adminDb.collection('tasks')
    .where('status', '==', 'in_progress')
    .where('assigned_at', '<', cutoff)
    .get();

  const batch = adminDb.batch();
  let count = 0;

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      status: 'open',
      volunteer_id: null,
      assigned_at: null,
      updated_at: FieldValue.serverTimestamp(),
    });
    count++;
  });

  if (count > 0) await batch.commit();
  return { reset: count };
};
