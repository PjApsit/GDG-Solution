/**
 * API Service Layer
 * WHY: Centralizes all backend communication. Components never call fetch() directly.
 * Includes auth token attachment for authenticated requests.
 */

import { auth } from '../config/firebase';

const API_BASE = '/api';

/**
 * Get Firebase ID token for authenticated requests
 */
const getAuthToken = async () => {
  try {
    if (!auth) return null;
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
  } catch {
    // Silently fail — unauthenticated requests are fine
  }
  return null;
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = await getAuthToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.error || 'API request failed');
  }
  return res.json();
}

function uploadFiles(endpoint, files) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  return request(endpoint, {
    method: 'POST',
    body: formData,
  });
}

// ── Events ──
export const eventsApi = {
  getAll: () => request('/events'),
  getById: (id) => request(`/events/${id}`),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  checkDuplicate: (lat, lng) => request('/events/check-duplicate', { method: 'POST', body: JSON.stringify({ latitude: lat, longitude: lng }) }),
};

// ── Tasks ──
export const tasksApi = {
  getAll: (filters) => request(`/tasks${filters ? '?' + new URLSearchParams(filters) : ''}`),
  getById: (id) => request(`/tasks/${id}`),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  assign: (taskId, volunteerId) => request(`/tasks/${taskId}/assign`, { method: 'POST', body: JSON.stringify({ volunteerId }) }),
  complete: (taskId) => request(`/tasks/${taskId}/complete`, { method: 'POST' }),
  cleanup: () => request('/tasks/cleanup', { method: 'POST' }),
};

// ── Scan ──
export const scanApi = {
  survey: (image, mimeType) => request('/scan/survey', { method: 'POST', body: JSON.stringify({ image, mimeType }) }),
  batch: (images) => request('/scan/batch', { method: 'POST', body: JSON.stringify({ images }) }),
};

// ── Matching ──
export const matchingApi = {
  forTask: (taskId) => request(`/matching/task/${taskId}`),
  forVolunteer: (volunteerId) => request(`/matching/volunteer/${volunteerId}`),
};

// ── Volunteers ──
export const volunteersApi = {
  getAll: () => request('/volunteers'),
  getById: (id) => request(`/volunteers/${id}`),
  getSuggested: (taskId) => request(`/volunteers/suggested/${taskId}`),
};

// ── Social Posts ──
export const socialApi = {
  getPosts: () => request('/social/posts'),
  createPost: (data) => request('/social/posts', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id) => request(`/social/posts/${id}/like`, { method: 'POST' }),
  joinInitiative: (postId) => request(`/social/posts/${postId}/join`, { method: 'POST' }),
};

// ── Predictions ──
export const predictApi = {
  needs: (events) => request('/predict/needs', { method: 'POST', body: JSON.stringify({ events }) }),
};

// ── Export ──
export const exportApi = {
  events: () => `${API_BASE}/export/events`,
  tasks: () => `${API_BASE}/export/tasks`,
};

// ── Health ──
export const healthApi = {
  check: () => request('/health'),
};

// ── Social Posts ──
// Data Ingestion
export const ingestionApi = {
  upload: (files) => uploadFiles('/ingestion/upload', files),
};

export const socialApi = {
  getPosts: () => request('/social/posts'),
  createPost: (data) => request('/social/posts', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id) => request(`/social/posts/${id}/like`, { method: 'POST' }),
  joinInitiative: (postId) => request(`/social/posts/${postId}/join`, { method: 'POST' }),
};

// ── Predictions ──
export const predictApi = {
  needs: (events) => request('/predict/needs', { method: 'POST', body: JSON.stringify({ events }) }),
};

// ── Export ──
export const exportApi = {
  events: () => `${API_BASE}/export/events`,
  tasks: () => `${API_BASE}/export/tasks`,
};

// ── Health ──
export const healthApi = {
  check: () => request('/health'),
};
