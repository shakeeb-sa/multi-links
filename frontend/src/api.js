import axios from 'axios';

const API = axios.create({
  // This looks for VITE_API_URL, if missing it uses your Vercel URL, if that's missing it uses localhost
  baseURL: import.meta.env.VITE_API_URL || 'https://multi-links-nine.vercel.app/api' || 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;