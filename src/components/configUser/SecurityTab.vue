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
              Política: Mínimo 8 chars, letras, números e especial (@$!%*#?&).
            </p>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="dialogVisible" header="Alterar Senha" modal :style="{ width: '450px' }">
        <div class="flex flex-column gap-3" style="display: flex; flex-direction: column; gap: 1rem;">

          <div class="field">
            <label for="newPass" style="font-weight: bold; display: block; margin-bottom: 0.5rem;">Nova Senha</label>
            <InputText id="newPass" v-model="newPassword" type="password" style="width: 100%;" toggleMask
              :class="{ 'p-invalid': passwordError }" />
            <small v-if="passwordError" class="p-error" style="display: block; margin-top: 0.2rem;">
              {{ passwordError }}
            </small>
          </div>

          <div class="field">
            <label for="confPass" style="font-weight: bold; display: block; margin-bottom: 0.5rem;">Confirmar
              Senha</label>
            <InputText id="confPass" v-model="confirmPassword" type="password" style="width: 100%;" toggleMask
              :class="{ 'p-invalid': confirmError }" />
            <small v-if="confirmError" class="p-error" style="display: block; margin-top: 0.2rem;">
              {{ confirmError }}
            </small>
          </div>

        </div>

        <template #footer>
          <Button label="Cancelar" icon="pi pi-times" text class="btn-dialog-cancel" @click="dialogVisible = false" />
          <Button label="Salvar" icon="pi pi-check" class="btn-dialog-save" @click="handleUpdatePassword"
            :loading="loading" :disabled="!isFormValid" />
        </template>
      </Dialog>

    </template>
  </Card>
</template>

<script setup lang="ts">
import './SecurityTab.css'
import { ref, computed } from 'vue'
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
const loading = ref(false)

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

const passwordError = computed(() => {
  if (newPassword.value.length === 0) return ''
  if (!passwordRegex.test(newPassword.value)) {
    return 'A senha deve ter 8+ caracteres, letras, números e símbolo (@$!%*#?&)'
  }
  return ''
})

const confirmError = computed(() => {
  if (confirmPassword.value.length === 0) return ''
  if (newPassword.value !== confirmPassword.value) {
    return 'As senhas não coincidem'
  }
  return ''
})

const isFormValid = computed(() => {
  return newPassword.value.length > 0 &&
    confirmPassword.value.length > 0 &&
    passwordError.value === '' &&
    confirmError.value === ''
})

function openDialog() {
  newPassword.value = ''
  confirmPassword.value = ''
  dialogVisible.value = true
}

async function handleUpdatePassword() {
  if (!isFormValid.value) return

  loading.value = true

  try {
    const userToUpdate: UserProfile = {
      ...props.profile,
      password: newPassword.value
    }

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
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao atualizar senha. Tente novamente.',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>
