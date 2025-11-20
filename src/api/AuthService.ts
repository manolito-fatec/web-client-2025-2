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

 async approval(id: number): Promise<void>
  {
    try
    {
      const response = await api.patch(`/auth/approval/${id}`);
      return response.data;
    } catch (error: any) {
        console.error(`Erro ao aprovar o usuário com id: ${id}`, error);
        throw new Error(
            error?.response?.status === 408
                ? 'Tempo de resposta excedido.'
                : error?.response?.status === 500
                ? 'Erro interno.'
                : `Erro ao aprovar o usuário com id: ${id}.`
        );
    }
  },

  logout() {
    useAuthStore().logout().then(() => {
      router.push('/')
    })
  }
}
