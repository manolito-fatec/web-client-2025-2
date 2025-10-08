<template>
  <div class="signup-form">
    <p class="info-text">
      Digite seu e-mail corporativo com domínio <strong>@pardal</strong> para receber o link de
      confirmação.
    </p>
    <div class="field">
      <label>E-mail</label>
      <input placeholder="seunome@pardal.com" v-model="email"/>
      <span class="error-text" v-if="!isPardalEmailValid">{{errorMsg}}</span>
    </div>
    <button class="btn primary" :disabled="!isPardalEmailValid" @click="handleSignIn">
      Enviar Link
    </button>
    <button class="btn secondary" @click="emit('toggleSign')">Cancelar</button>
    <p class="hint">Um e-mail será enviado com link válido por 24h.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'

const emit = defineEmits(['toggleSign'])

const email: Ref<string> = ref<string>('')

const pardalRegex = /^[a-zA-Z0-9._-]+@pardal\.com$/

const errorMsg = computed(() => {
  if (email.value === '') {
    return 'O e-mail é obrigatório.'
  }

  if (!pardalRegex.test(email.value)) {
    return 'O e-mail deve ter o domínio @pardal.com.'
  }

  return ''
})

const isPardalEmailValid = computed(() => {
  return errorMsg.value === ''
})

function handleSignIn() {
  if (isPardalEmailValid.value) {
    console.log('E-mail válido e é @pardal.com. Prosseguir com o cadastro.')
  } else {
    console.log('E-mail inválido ou não pertence ao domínio @pardal.com.')
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

.btn {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  font-family: Arial, sans-serif;
  transition: filter 0.2s;
}

.btn.primary {
  background: #1e3a8a;
  color: white;
  border: none;
  margin-top: 0.25rem;
}

.btn.primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  filter: none;
}

.btn.primary:hover {
  filter: brightness(1.1);
}

.btn.secondary {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #1e3a8a;
  margin-top: 0.75rem;
}

.btn.secondary:hover {
  background: #f3f4f6;
}

.hint {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: #6b7280;
  margin-top: 0.75rem;
}

.info-text {
  font-size: 14px;
  color: #374151;
  font-family: Arial, sans-serif;
  margin-bottom: 0.75rem;
}

.error-text {
  font-size: 12px;
  font-family: Arial, sans-serif;
  color: #dc2626;
}
</style>
