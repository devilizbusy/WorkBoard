import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API calls for WorkBoards
export const getWorkBoards = () => api.get('/workboards/');
export const getWorkBoard = (id) => api.get(`/workboards/${id}/`);
export const createWorkBoard = (data) => api.post('/workboards/', data);
export const updateWorkBoard = (id, data) => api.put(`/workboards/${id}/`, data);
export const deleteWorkBoard = (id) => api.delete(`/workboards/${id}/`);

// API calls for Tasks
export const getTasks = (workboardId) => api.get(`/workboards/${workboardId}/tasks/`);
export const createTask = (workboardId, data) => api.post(`/workboards/${workboardId}/tasks/`, data);
export const updateTask = (workboardId, taskId, data) => api.put(`/workboards/${workboardId}/tasks/${taskId}/`, data);
export const deleteTask = (workboardId, taskId) => api.delete(`/workboards/${workboardId}/tasks/${taskId}/`);

// Authentication
export const login = (credentials) => api.post('/auth/login/', credentials);
export const logout = () => api.post('/auth/logout/');
export const register = (userData) => api.post('/auth/register/', userData);

export default api;