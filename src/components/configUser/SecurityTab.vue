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

<script setup lang="ts">
import './SecurityTab.css'
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
