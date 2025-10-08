<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Pardal Logo" class="logo" />
      </div>
      <h1 class="title">Pardal</h1>
      <p class="subtitle">
        Faça login ou cadastre-se com e-mail do domínio <span>@pardal</span>
      </p>

      <div class="form-section">
        <!-- Login Form -->
        <LoginForm/>

        <!-- Signup Form -->
        <SignupForm />

        <!-- Email Sent -->
        <div class="email-sent">
          <h3>Verifique seu e-mail</h3>
          <p>Enviamos um link para concluir seu cadastro. Verifique sua caixa de entrada.</p>
          <ul>
            <li>O link expira em 24 horas.</li>
            <li>Verifique também a pasta de spam.</li>
          </ul>
          <button class="btn secondary">Voltar ao login</button>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast success">Login efetuado (mock)</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import SignupForm from '@/components/auth/SignupForm.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
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
