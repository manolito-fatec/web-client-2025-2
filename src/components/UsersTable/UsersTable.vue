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
      <Column field="status" header="Status">
        <template #body="slotProps">

            <i class="pi pi-circle-fill" :style="{ color: getStatusSeverity(slotProps.data?.state), marginRight: '6px' }"></i>
            <span
                class="p-tag" >
                {{ slotProps.data?.state}}
            </span>
        </template>
      </Column>
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
              icon="pi pi-check"
              severity="secondary"
              style="color: green"
              text
              :hidden="isPending(slotProps.data?.state)"
              rounded
              @click="confirmApproval(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              rounded
              @click="confirmDeletion(slotProps.data)"
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
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import type { AppUserTable } from '@/types/ObjectTypes/AppUserTable.ts'
import { onMounted, ref, computed, type Ref } from 'vue'
import { getUserTableData } from '@/components/UsersTable/UserTableUtils.ts'
import { userService } from '@/api/UserService'
import { authService } from '@/api/AuthService'

const toast = useToast()
const confirm = useConfirm();

const appUsersInTable: Ref<AppUserTable[]> = ref<AppUserTable[]>([])
const searchEmail = ref('')

const roleOptions = ['Admin', 'Operator', 'Manager']

const filteredUsers = computed(() => {
  let users = appUsersInTable.value

  if (searchEmail.value) {
      users = users.filter(user =>
      user.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    )
  }

  return users.slice().sort((a, b) => a.email.localeCompare(b.email))
})

const getStatusSeverity = (state: string) => {
    return state!=='Pendente' ? 'green' : 'orange'
};

const isPending = (state: string) => {
    return state!=='Pendente' ? true : false
};

function updateUsers () {
  appUsersInTable.value = getUserTableData()
}

const deleteUser = async (user: AppUserTable) => {
  try {
      await userService.deleteUser(user.id);

      toast.add({
          severity: 'success',
          summary: 'Usuário deletado!',
          life: 3000
      });

      updateUsers();
  } catch (error: any) {
      toast.add({
          severity: 'error',
          summary: error.message || 'Erro ao deletar usuário.',
          life: 3000
      });
  }
};


const onRoleChange = async (user: AppUserTable)  => {
  try {
    await userService.updateRole(user.id, user.role);

    toast.add({
      severity: 'success',
      summary: 'Papel alterado com sucesso!',
      life: 3000
    });

    updateUsers();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: error.message || 'Erro ao alterar papel.',
      life: 3000
    });
  }
}

const approvalUser = async (user: AppUserTable) => {

   try {
    await authService.approval(user.id);

    toast.add({
      severity: 'success',
      summary: `Usuário ${user.email} alterado com sucesso com sucesso!`,
      life: 3000
    });

    updateUsers();
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: error.message || `Erro ao aprovar o usuário ${user.email}.`,
      life: 3000
    });
  }
}

const confirmDeletion = (user: AppUserTable) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o usuário ${user?.email}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Deletar',
        rejectLabel: 'Cancelar',

        accept: () => {
            deleteUser(user);
        },

        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.', life: 3000 });
        }
    });
};

const confirmApproval = (user: AppUserTable) => {
    confirm.require({
        message: `Tem certeza que deseja aprovar o usuário ${user?.email}?`,
        header: 'Confirmação de Aprovação',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim, Aprovar',
        rejectLabel: 'Cancelar',

        accept: () => {
            approvalUser(user);
        },

        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelado', detail: 'A exclusão foi cancelada.', life: 3000 });
        }
    });
};

onMounted(() => {
  updateUsers()
})

</script>

<style scoped>
</style>
