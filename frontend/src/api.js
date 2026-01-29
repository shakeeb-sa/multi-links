import axios from 'axios';

const API = axios.create({
  // Use the environment variable for production, fallback to local for testing
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Interceptor to automatically add the JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;