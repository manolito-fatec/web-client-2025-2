import api from './axios/AxiosConfig.ts'
import type { NewUser } from '@/types/NewUser.ts'

export const signApi = async (newUser: NewUser) => {
  const response = await api.post('/auth/signup', newUser)
  return response.data
}
