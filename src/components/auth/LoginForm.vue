<template>
  <div class="login-form">
    <div class="field">
      <label>
        E-mail
        <input placeholder="seunome@pardal.com" v-model="email" :disabled="isLoading" />
      </label>
    </div>
    <div class="field">
      <label>
        Senha
        <input type="password" placeholder="********" v-model="password" @keydown.enter="handleLogin" :disabled="isLoading" />
      </label>
    </div>
    <button class="btn primary" @click="handleLogin" :disabled="isLoading">
      <span v-if="!isLoading">Entrar</span>
      <span v-else class="loading-container">
        <span class="spinner"></span>
        Entrando...
      </span>
    </button>
    <button class="btn secondary" @click="emit('toggleSign')" :disabled="isLoading">Cadastrar</button>

    <ContractComponent
      v-if="showTermsModal"
      v-model:visible="showTermsModal"
      :actualTerm="pendingTermData"
    />
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/api/session/auth.ts'
import { useToast } from 'primevue/usetoast'
import { getSessionItem } from '@/api/session/SessionManagement.ts'
import ContractComponent from '@/components/contract/ContractComponent.vue'

const toast = useToast()
const emit = defineEmits(['toggleSign'])

const email: Ref<string> = ref<string>('')
const password: Ref<string> = ref<string>('')
const isLoading: Ref<boolean> = ref<boolean>(false)

const showTermsModal: Ref<boolean> = ref(false);
const pendingTermData: Ref<any> = ref(null);

const showError = (errorSum: string, errorMsg: string) => {
  toast.add({ severity: 'error', summary: errorSum, detail: errorMsg, life: 6000 });
};

async function checkPendingTerms(userId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/term/user/pending/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Falha ao verificar termos pendentes');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function handleLogin() {
  isLoading.value = true;

  try {
    const returnStatus = await useAuthStore().loginAndStore({
      email: email.value,
      password: password.value
    });

    switch (returnStatus) {
      case 200:
        const userId = getSessionItem('userId');

        if (userId) {
          const termStatus = await checkPendingTerms(userId as string);

          if (termStatus && termStatus.isActive === true) {

            pendingTermData.value = {
              termsId: termStatus.term.termsId,
              title: termStatus.term.title,
              content: termStatus.term.content,
              checkList: termStatus.checkList
            };


            showTermsModal.value = true;

            toast.add({
              severity: "warn",
              summary: "Termos Pendentes",
              detail: "Há novos termos que precisam ser aceitos antes de continuar.",
              life: 5000
            });

          } else {
            toast.add({
              severity: "success",
              summary: "Login realizado!",
              life: 3000
            });
            router.push("/home");
          }
        } else {
          router.push("/home");
        }
        break;

      case 400:
        showError("Dados inválidos", "Verifique o e-mail e a senha e tente novamente.");
        break;

      case 401:
      case 403:
        showError("Credenciais incorretas", "E-mail ou senha inválidos.");
        break;

      case 404:
        showError("Usuário não encontrado", "Não foi possível localizar sua conta.");
        break;

      case 500:
        showError("Erro no servidor", "Ocorreu um problema interno.");
        break;

      default:
        showError("Erro no servidor", "Não foi possível conectar ao servidor.");
        break;
    }
  } catch (error) {
    showError("Erro inesperado", "Houve um problema ao tentar realizar o login.");
    console.error("Erro inesperado no login:", error);
  } finally {
    isLoading.value = false;
  }
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
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field input {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  padding: 0 0.75rem;
  outline: none;
  transition: box-shadow 0.2s;
  font-size: 14px;
  color: #000;
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
