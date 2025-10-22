import axios from 'axios'
import { useAuthStore } from '@/api/session/auth.ts'

const api = axios.create({
  baseURL: 'http://localhost:8080/',
})

api.interceptors.request.use(config => {
  if (useAuthStore().token !== null) {
    config.headers.Authorization = `Bearer ${useAuthStore().token}`;
    return config;
  }
  return config;
})

export default api
