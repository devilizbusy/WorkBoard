import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Utility function to get the value of the CSRF token from cookies
export function getCSRFToken() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith('csrftoken=')) {
      return cookie.split('=')[1];
    }
  }
  return null;
}

api.interceptors.request.use(
  async (config) => {
    console.log('Sending request:', config.method.toUpperCase(), config.url);
    
    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await api.post('/login/', { username, password });
    console.log('Login response:', response);
    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Login error in api.js:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout/');
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getBoards = () => api.get('/boards/');
export const createBoard = (boardData) => api.post('/boards/', boardData);
export const getBoard = (id) => api.get(`/boards/${id}/`);
export const updateBoard = (id, boardData) => api.put(`/boards/${id}/`, boardData);
export const deleteBoard = (id) => api.delete(`/boards/${id}/`);
export const getCurrentUser = () => api.get('/users/me/');
export const createTask = (taskData) => api.post('/tasks/', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}/`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);

export default api;