// frontend/src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header automatically if token present
instance.interceptors.request.use((config) => {
  const raw = localStorage.getItem('token');
  if (raw) {
    // ensure it is in "Bearer <token>" form
    const token = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
    config.headers = config.headers || {};
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
