<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Pardal Logo" class="logo" />
      </div>
      <h1 class="title">Pardal</h1>
      <p class="subtitle">
        Faça login ou cadastre-se com seu e-mail
      </p>

      <div class="form-section" v-if="!SignMode">
        <LoginForm  @toggleSign="toggleSign"/>
      </div>
      <div class="form-section" v-else>
        <SignupForm  @toggleSign="toggleSign"/>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import SignupForm from '@/components/auth/SignupForm.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { ref, type Ref } from 'vue'

const SignMode: Ref<boolean> = ref<boolean>(false)

const toggleSign = () => {
  console.log(SignMode.value)
  SignMode.value = !SignMode.value
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8fafc, #eef2ff);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 35px rgba(2, 6, 23, 0.08);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
}

.logo {
  width: 6rem;
  height: 6rem;
  background: #eef2ff;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.title {
  font-size: 26px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 14px;
  font-family: Arial, sans-serif;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.subtitle span {
  font-weight: 600;
  font-family: Arial, sans-serif;
  color: #1e3a8a;
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




.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 14px;
  font-family: Arial, sans-serif;
}

.toast.success {
  background: #059669;
}
</style>
