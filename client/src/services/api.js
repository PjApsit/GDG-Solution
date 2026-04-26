/**
 * API Service Layer
 * WHY: Centralizes all backend communication. Components never call fetch() directly.
 * When Supabase/backend is ready, swap mock returns for real API calls here.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const res = await fetch(url, config);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  return res.json();
}

// ── Events ──
export const eventsApi = {
  getAll: () => request('/events'),
  getById: (id) => request(`/events/${id}`),
  create: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
};

// ── Priority Scoring ──
export const priorityApi = {
  calculate: (eventData) => request('/priority/calculate', { method: 'POST', body: JSON.stringify(eventData) }),
  recalculateAll: () => request('/priority/recalculate', { method: 'POST' }),
};

// ── Tasks ──
export const tasksApi = {
  getAll: () => request('/tasks'),
  getById: (id) => request(`/tasks/${id}`),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  assign: (taskId, volunteerId) => request(`/tasks/${taskId}/assign`, { method: 'POST', body: JSON.stringify({ volunteerId }) }),
  updateStatus: (taskId, status) => request(`/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Social Posts ──
export const socialApi = {
  getPosts: () => request('/social/posts'),
  createPost: (data) => request('/social/posts', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id) => request(`/social/posts/${id}/like`, { method: 'POST' }),
  joinInitiative: (postId) => request(`/social/posts/${postId}/join`, { method: 'POST' }),
};

// ── Volunteers ──
export const volunteersApi = {
  getAll: () => request('/volunteers'),
  getById: (id) => request(`/volunteers/${id}`),
  getSuggested: (taskId) => request(`/volunteers/suggested/${taskId}`),
};
