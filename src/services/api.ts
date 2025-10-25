import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Methods
export const authAPI = {
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

export const communitiesAPI = {
  getAll: (params?: any) => api.get('/communities', { params }),
  getById: (id: string) => api.get(`/communities/${id}`),
  create: (data: any) => api.post('/communities', data),
  join: (id: string) => api.post(`/communities/${id}/join`),
  leave: (id: string) => api.post(`/communities/${id}/leave`),
  getMembers: (id: string) => api.get(`/communities/${id}/members`),
};

export const eventsAPI = {
  getAll: (params?: any) => api.get('/events', { params }),
  getById: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  register: (id: string) => api.post(`/events/${id}/register`),
  cancel: (id: string) => api.post(`/events/${id}/unregister`), // Fixed: backend uses /unregister
  getAttendees: (id: string) => api.get(`/events/${id}/attendees`),
};

export const postsAPI = {
  getAll: (params?: any) => api.get('/posts', { params }),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: any) => api.post('/posts', data),
  like: (id: string) => api.post(`/posts/${id}/like`),
  comment: (id: string, data: { content: string }) => api.post(`/posts/${id}/comment`, data),
  deleteComment: (postId: string, commentId: string) => api.delete(`/posts/${postId}/comment/${commentId}`),
};

export const usersAPI = {
  getProfile: (id: string) => api.get(`/users/profile/${id}`),
  follow: (id: string) => api.post(`/users/follow/${id}`),
  unfollow: (id: string) => api.post(`/users/unfollow/${id}`),
};

