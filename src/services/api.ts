import axios from 'axios';

const api = axios.create({
  baseURL: 'https://devies-reads-be.onrender.com',
});

// Läs JWT från localStorage på varje request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    // Sätt headern på det befintliga headers-objektet
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
