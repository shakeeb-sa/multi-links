import axios from 'axios';

const API = axios.create({
  // Hardcode the URL with NO extra slashes at the end
  baseURL: 'https://multi-links-nine.vercel.app/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;