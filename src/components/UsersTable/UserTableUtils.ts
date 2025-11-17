import type { AppUser } from '@/types/ObjectTypes/AppUser.ts'
import type { AppUserTable } from '@/types/ObjectTypes/AppUserTable.ts'
import { ref, type Ref } from 'vue'
import api from '@/api/axios/AxiosConfig.ts'

export function transformUsers(appUser: AppUser):AppUserTable {
  const readyForTableUser: Ref<AppUserTable> = ref<AppUserTable>({
    id: appUser.id,
    email: appUser.email,
    role: appUser.role.rlName,
    state: appUser.verified ? "Ativo": "Pendente"})
  return readyForTableUser.value
}

export function getUserTableData () {
  const appUsers: Ref<AppUserTable[]> = ref<AppUserTable[]>([])
  api.get('/user/all').then((res) => {
    for (const user of res.data) {
      appUsers.value.push(transformUsers(user))
    }
  })
  return appUsers.value
}
