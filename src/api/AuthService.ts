import api from './axios/AxiosConfig.ts'
import type { LoginData } from '@/types/LoginData.ts'

export const authService = {
  verifyEmail(token:string) {
    return api.post('/auth/verify', token)
  },

  login(loginData:LoginData) {
    return api.post('/auth/login', loginData)
  },

  logout() {
    return api.post('/auth/logout')
  }
}
