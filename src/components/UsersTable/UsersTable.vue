<template>
  <div class="users-table">
    <div class="search-container" style="margin-bottom: 1rem;">
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText
          v-model="searchEmail"
          placeholder="Pesquisar por e-mail"
          style="width: 100%; max-width: 400px;"
        />
      </IconField>
    </div>

    <DataTable
      :value="filteredUsers"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      tableStyle="min-width: 50rem"
    >
      <Column field="email" header="E-mail"></Column>
      <Column field="role" header="Papel">
        <template #body="slotProps">
          <Select
            v-model="slotProps.data.role"
            :options="roleOptions"
            placeholder="Selecione um papel"
            @change="onRoleChange(slotProps.data)"
          />
        </template>
      </Column>
      <Column header="Ações">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            @click="deleteUser(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'

import type { AppUserTable } from '@/types/ObjectTypes/AppUserTable.ts'
import api from '@/api/axios/AxiosConfig.ts'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, computed, type Ref } from 'vue'
import { getUserTableData } from '@/components/UsersTable/UserTableUtils.ts'

const toast = useToast()
const props = defineProps<{
  appUsers: AppUserTable[]
}>()

const appUsersInTable: Ref<AppUserTable[]> = ref<AppUserTable[]>([])
const searchEmail = ref('')

const roleOptions = ['Admin', 'Operator', 'Manager']

// Computed property para filtrar usuários
const filteredUsers = computed(() => {
  if (!searchEmail.value) {
    return appUsersInTable.value
  }
  return appUsersInTable.value.filter(user =>
    user.email.toLowerCase().includes(searchEmail.value.toLowerCase())
  )
})

function updateUsers () {
  appUsersInTable.value = getUserTableData()
}

const deleteUser = (user: AppUserTable) => {
  api
    .delete('user?id=' + user.id)
    .then((response) => {
      switch (response.status) {
        case 200:
          toast.add({ severity: 'success', summary: 'Usuário deletado!', life: 3000 })
          updateUsers()
          break
        case 408:
          toast.add({ severity: 'error', summary: 'Tempo de resposta excedido.', life: 3000 })
          break
        case 500:
          toast.add({ severity: 'error', summary: 'Erro interno.', life: 3000 })
          break
      }
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: 'Erro ao deletar usuário.', life: 3000 })
    })
}

const onRoleChange = (user: AppUserTable) => {
  api
    .put('user/role', { id: user.id, role: user.role })
    .then((response) => {
      switch (response.status) {
        case 200:
          toast.add({ severity: 'success', summary: 'Papel alterado com sucesso!', life: 3000 })
          updateUsers()
          break
        case 408:
          toast.add({ severity: 'error', summary: 'Tempo de resposta excedido.', life: 3000 })
          break
        case 500:
          toast.add({ severity: 'error', summary: 'Erro interno.', life: 3000 })
          break
      }
    })
    .catch(() => {
      toast.add({ severity: 'error', summary: 'Erro ao alterar papel.', life: 3000 })
    })
}

onMounted(() => {
  updateUsers()
})

</script>

<style scoped></style>
