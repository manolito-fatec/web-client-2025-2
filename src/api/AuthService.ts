import api from './axios/AxiosConfig.ts'
import type { LoginData } from '@/types/LoginData.ts'
import { useAuthStore } from '@/api/session/auth.ts'
import router from '@/router'

export const authService = {
  verifyEmail(token:string) {
    return api.post('/auth/verify', token)
  },

  login(loginData:LoginData) {
    return api.post('/auth/login', loginData)
  },

  logout() {
    useAuthStore().logout().then(() => {
      router.push('/')
    })
  }
}
