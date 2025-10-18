<template>
  <div class="signup-form">
    <p class="info-text">
      Digite seu e-mail corporativo para receber o link de
      confirmação.
    </p>

    <div class="field">
      <label>E-mail</label>
      <input placeholder="seunome@pardal.com" v-model="email"/>
      <span class="error-text" v-if="!isPardalEmailValid">{{emailErrorMsg}}</span>
    </div>

    <div class="field">
      <label>Nome completo</label>
      <input placeholder="Seu nome completo" v-model="name"/>
      <span class="error-text" v-if="!isNameValid">{{nameErrorMsg}}</span>
    </div>

    <div class="field">
      <label>Telefone</label>
      <input placeholder="(00)00000-0000" v-model="phone" @input="handlePhoneInput"/>
      <span class="error-text" v-if="!isPhoneValid">{{phoneErrorMsg}}</span>
    </div>

    <div class="field">
      <label>Senha</label>
      <input placeholder="*************" type="password" v-model="password"/>
      <span class="error-text" v-if="!isPasswordValid">{{passwordErrorMsg}}</span>
    </div>

    <button class="btn primary" :disabled="!isFormValid" @click="handleSignIn">
      Enviar Link
    </button>
    <button class="btn secondary" @click="emit('toggleSign')">Cancelar</button>
    <p class="hint">Um e-mail será enviado com link válido por 24h.</p>

    <div v-if="created" class="email-sent">
      <h3>Verifique seu e-mail</h3>
      <p>Enviamos um link para concluir seu cadastro. Verifique sua caixa de entrada.</p>
      <ul>
        <li>O link expira em 24 horas.</li>
        <li>Verifique também a pasta de spam.</li>
      </ul>
      <button class="btn secondary" @click="emit('toggleSign')">Voltar ao login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import type { NewUser } from '@/types/NewUser.ts'
import { signApi } from '@/api/SignApi.ts'

const emit = defineEmits(['toggleSign'])
const created = ref<boolean>(false)

const email: Ref<string> = ref<string>('')
const name: Ref<string> = ref<string>('')
const phone: Ref<string> = ref<string>('')
const password: Ref<string> = ref<string>('')

const pardalRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegex = /^[a-záàâãéèêíïóôõöúçñ\s]{3,}$/i
const phoneRegex = /^\(\d{2}\)\d{5}-\d{4}$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

const emailErrorMsg = computed(() => {
  if (email.value === '') {
    return 'O e-mail é obrigatório.'
  }
  if (!pardalRegex.test(email.value)) {
    return 'O e-mail deve ter o formato de um e-mail.'
  }
  return ''
})

const isPardalEmailValid = computed(() => {
  return emailErrorMsg.value === ''
})

const nameErrorMsg = computed(() => {
  if (name.value === '') {
    return 'O nome completo é obrigatório.'
  }
  if (!nameRegex.test(name.value)) {
    return 'Nome deve ter no mínimo 3 caracteres e conter apenas letras.'
  }
  return ''
})

const isNameValid = computed(() => {
  return nameErrorMsg.value === ''
})

const phoneErrorMsg = computed(() => {
  if (phone.value === '') {
    return 'O telefone é obrigatório.'
  }
  if (!phoneRegex.test(phone.value)) {
    return 'Telefone deve estar no formato (00)00000-0000.'
  }
  return ''
})

const isPhoneValid = computed(() => {
  return phoneErrorMsg.value === ''
})

const passwordErrorMsg = computed(() => {
  if (password.value === '') {
    return 'A senha é obrigatória.'
  }
  if (password.value.length < 8) {
    return 'Senha deve ter no mínimo 8 caracteres.'
  }
  if (!passwordRegex.test(password.value)) {
    return 'Senha deve conter letras, números e caracteres especiais (@$!%*#?&).'
  }
  return ''
})

const isPasswordValid = computed(() => {
  return passwordErrorMsg.value === ''
})

const isFormValid = computed(() => {
  return isPardalEmailValid.value && isNameValid.value && isPhoneValid.value && isPasswordValid.value
})

function handlePhoneInput() {
  let value = phone.value.replace(/\D/g, '')

  if (value.length > 11) {
    value = value.slice(0, 11)
  }

  if (value.length <= 2) {
    phone.value = value ? `(${value}` : ''
  } else if (value.length <= 7) {
    phone.value = `(${value.slice(0, 2)})${value.slice(2)}`
  } else {
    phone.value = `(${value.slice(0, 2)})${value.slice(2, 7)}-${value.slice(7)}`
  }
}

function handleSignIn() {
  if (isFormValid.value) {
    const newUser:Ref<NewUser> = ref<NewUser>({ email: email.value,
      password: password.value,
      phone: phone.value,
      name: name.value
    })
    signApi(newUser.value).then(() => {
      created.value = true
    })
  } else {
    console.log('Formulário inválido. Corrija os erros.')
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

.email-sent h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e3a8a;
  font-family: Arial, sans-serif;
  margin-bottom: 0.5rem;
}

.email-sent p, .email-sent ul {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: #374151;
  margin-top: 0.5rem;
}

.email-sent ul {
  list-style: disc;
  margin-left: 1.25rem;
  color: #6b7280;
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
