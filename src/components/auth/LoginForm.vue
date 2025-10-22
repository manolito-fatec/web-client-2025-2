<template>
  <div class="login-form">
    <div class="field">
      <label>E-mail</label>
      <input placeholder="seunome@pardal.com" v-model="email" :disabled="isLoading" />
    </div>
    <div class="field">
      <label>Senha</label>
      <input type="password" placeholder="********" v-model="password" :disabled="isLoading" />
    </div>
    <button class="btn primary" @click="handleLogin" :disabled="isLoading">
      <span v-if="!isLoading">Entrar</span>
      <span v-else class="loading-container">
        <span class="spinner"></span>
        Entrando...
      </span>
    </button>
    <button class="btn secondary" @click="emit('toggleSign')" :disabled="isLoading">Cadastrar</button>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/api/session/auth.ts'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const emit = defineEmits(['toggleSign'])

const email: Ref<string> = ref<string>('')
const password: Ref<string> = ref<string>('')
const isLoading: Ref<boolean> = ref<boolean>(false)

const showError = (errorSum: string, errorMsg: string) => {
  toast.add({ severity: 'error', summary: errorSum, detail: errorMsg, life: 3000 });
};

function handleLogin() {
  isLoading.value = true
  useAuthStore().loginAndStore({email: email.value, password: password.value}).then( logged => {
    console.log(logged)
    if (logged) {
      router.push('/home')
    } else {
      showError('Erro ao realizar login', 'Houve um erro ao logar. Por favor, revise os dados de acesso')
      isLoading.value = false
    }
  }).catch(() => {
    isLoading.value = false
  })
}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.field label {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: #6b7280;
}

.field input {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  padding: 0 0.75rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.field input:focus {
  box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.4);
}

.field input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  font-family: Arial, sans-serif;
  transition: filter 0.2s;
  cursor: pointer;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.btn.primary {
  background: #1e3a8a;
  color: white;
  border: none;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn.primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn.secondary {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #1e3a8a;
  margin-top: 0.75rem;
}

.btn.secondary:hover:not(:disabled) {
  background: #f3f4f6;
}

.loading-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
