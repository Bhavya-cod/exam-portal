import axios from 'axios';

// In development: uses localhost. In production: uses relative path or VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
