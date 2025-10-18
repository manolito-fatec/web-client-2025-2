<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AxiosError } from 'axios'
import { authService } from '@/api/AuthService.ts'
import { useAuthStore } from '@/api/session/auth.ts'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const success = ref(false)
const error = ref(null)

onMounted(async () => {
  try {
    const token:string = route.params.token.toString()

    const response = await authService.verifyEmail(token)

    success.value = true
    auth.user = response.data.user

    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (err: unknown) {
    const axiosError = err as AxiosError
    if (axiosError.response?.status === 400) {
      error.value = 'Token inválido ou expirado'
    } else if (axiosError.response?.status === 404) {
      error.value = 'Usuário não encontrado'
    } else {
      error.value = axiosError.response?.data?.message || 'Erro ao validar email'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="verify-container">
    <div v-if="loading" class="state loading">
      <div class="spinner"></div>
      <p>Validando seu email...</p>
    </div>

    <div v-else-if="success" class="state success">
      <div class="icon">✓</div>
      <h2>Email validado com sucesso!</h2>
      <p>Sua conta foi ativada. Redirecionando para login...</p>
    </div>

    <div v-else class="state error">
      <div class="icon">✗</div>
      <h2>Algo deu errado</h2>
      <p>{{ error }}</p>
      <router-link to="/login" class="btn">Voltar ao Login</router-link>
    </div>
  </div>
</template>

<style scoped>
.verify-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #eef2ff);
}

.state {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
}

.icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.loading .icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h2 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.success .icon { color: #4caf50; }
.success h2 { color: #4caf50; }

.error .icon { color: #f44336; }
.error h2 { color: #f44336; }

.btn {
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


.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}
</style>
