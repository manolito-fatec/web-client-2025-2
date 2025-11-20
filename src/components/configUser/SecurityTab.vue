<template>
  <Card class="security-card">
    <template #header>
      <div class="section-header">
        <div class="header-icon">
          <i class="pi pi-lock"></i>
        </div>
        <div class="header-content">
          <h3 class="header-title">Segurança da Conta</h3>
          <p class="header-subtitle">LGPD: medidas técnicas e administrativas (art. 46).</p>
        </div>
      </div>
    </template>

    <template #content>
      <div class="security-content">
        <div class="password-section">
          <div class="password-field">
            <label for="password">Senha</label>
            <div class="password-input-group">
              <InputText id="password" type="password" value="********" readonly class="password-input" />
              <Button label="Redefinir Senha" icon="pi pi-key" @click="openDialog" class="btn-reset-password" />
            </div>
            <p class="password-hint">
              Política: comprimento mínimo, histórico, bloqueio progressivo.
            </p>
          </div>
        </div>

        <div class="password-rules">
          <h4 class="rules-title">Regras de senha</h4>
          <ul class="rules-list">
            <li>Mínimo 6 caracteres;</li>
            <li>As senhas devem coincidir.</li>
          </ul>
        </div>
      </div>

      <Dialog v-model:visible="dialogVisible" header="Alterar Senha" modal :style="{ width: '400px' }">
        <div class="flex flex-column gap-3" style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="field">
            <label for="newPass" style="font-weight: bold; display: block; margin-bottom: 0.5rem;">Nova Senha</label>
            <InputText id="newPass" v-model="newPassword" type="password" style="width: 100%;" toggleMask />
          </div>
          <div class="field">
            <label for="confPass" style="font-weight: bold; display: block; margin-bottom: 0.5rem;">Confirmar
              Senha</label>
            <InputText id="confPass" v-model="confirmPassword" type="password" style="width: 100%;" toggleMask />
            <small v-if="errorMsg" style="color: red; display: block; margin-top: 0.5rem;">{{ errorMsg }}</small>
          </div>
        </div>
        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text class="btn-dialog-cancel" @click="dialogVisible = false" />
          <Button label="Salvar" icon="pi pi-check" class="btn-dialog-save" @click="handleUpdatePassword"
            :loading="loading" />
        </template>
      </Dialog>

    </template>
  </Card>
</template>

<script setup lang="ts">
import './SecurityTab.css'
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { userService } from '@/api/UserService'
import type { UserProfile } from '@/types/ConfigUser/UserTypes'
import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  profile: UserProfile
}>()

const toast = useToast()
const dialogVisible = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const loading = ref(false)

function openDialog() {
  newPassword.value = ''
  confirmPassword.value = ''
  errorMsg.value = ''
  dialogVisible.value = true
}

async function handleUpdatePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    errorMsg.value = 'Preencha os dois campos.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'As senhas não coincidem.'
    return
  }
  if (newPassword.value.length < 6) {
    errorMsg.value = 'A senha deve ter no mínimo 6 caracteres.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    const userToUpdate: UserProfile = {
      ...props.profile,
      password: newPassword.value
    }

    console.log('Payload enviado:', userToUpdate);

    await userService.updateUser(userToUpdate)

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Senha alterada com sucesso!',
      life: 3000
    })

    dialogVisible.value = false

  } catch (error) {
    console.error(error)
    errorMsg.value = 'Erro ao atualizar senha. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
