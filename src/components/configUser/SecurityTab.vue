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
              <InputText 
                id="password" 
                :type="showPassword ? 'text' : 'password'" 
                value="********" 
                readonly 
                class="password-input"
              />
              <Button 
                :icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" 
                outlined
                @click="togglePassword"
                class="btn-password"
              />
              <Button 
                label="Redefinir" 
                icon="pi pi-key" 
                @click="$emit('reset-password')" 
                class="btn-reset-password"
              />
            </div>
            <p class="password-hint">
              Política: comprimento mínimo, histórico, bloqueio progressivo.
            </p>
          </div>
        </div>
        
        <div class="password-rules">
          <h4 class="rules-title">Regras de senha (exemplo)</h4>
          <ul class="rules-list">
            <li>Mínimo 12 caracteres;</li>
            <li>Pelo menos 1 maiúscula, 1 minúscula e 1 número;</li>
            <li>Bloqueio após 5 tentativas consecutivas falhas (cooldown crescente);</li>
            <li>Histórico impede reutilização das 5 últimas senhas.</li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const showPassword = ref(false)

defineEmits(['reset-password'])

function togglePassword() {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f1f5f9;
  border-radius: 12px;
}

.header-icon i {
  font-size: 20px;
  color: #475569;
}

.header-content {
  flex: 1;
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.2;
}

.header-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.security-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 16px;
}

.password-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.password-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-field label {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.password-input-group {
  display: flex;
  gap: 8px;
}

.password-input {
  flex: 1;
}

.password-hint {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.password-rules {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rules-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.rules-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .security-content {
    grid-template-columns: 1fr;
  }
}

.btn-password {
    background-color: transparent !important;
    border: 1px solid #cbd5e1 !important;
    color: #475569 !important;
    font-size: 14px !important;
    white-space: nowrap;
}

.btn-password:hover {
    background-color: #f8fafc !important;
    border-color: #94a3b8 !important;
}

.btn-reset-password {
    background-color: #0f172a !important;
    border-color: #0f172a !important;
    font-size: 14px !important;
    white-space: nowrap;
}

.btn-reset-password:hover {
    background-color: #1e293b !important;
    border-color: #1e293b !important;
}
</style>