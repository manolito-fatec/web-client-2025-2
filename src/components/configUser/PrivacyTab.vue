<template>
  <Card class="privacy-card">
    <template #header>
      <div class="section-header">
        <div class="header-icon">
          <i class="pi pi-file"></i>
        </div>
        <div class="header-content">
          <h3 class="header-title">Painel de Privacidade</h3>
          <p class="header-subtitle">LGPD: acesso, portabilidade, eliminação (art. 18).</p>
        </div>
      </div>
    </template>

    <template #content>
      <div class="privacy-content">
        <Card class="data-card">
          <template #header>
            <div class="card-header-content">
              <h4 class="card-title">Meus dados pessoais</h4>
              <p class="card-description">Formato claro e acessível.</p>
            </div>
          </template>

          <template #content>
            <div class="data-list">
              <div class="data-item">
                <span class="data-label">Nome</span>
                <span class="data-value">{{ profile.name }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">E-mail</span>
                <span class="data-value">{{ profile.email }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Papel</span>
                <span class="data-value">{{ user.role?.rlName }}</span>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="card-footer-actions">
              <Button label="Exportar CSV" icon="pi pi-download" outlined @click="$emit('export-csv')"
                class="btn-export-csv" />
            </div>
          </template>
        </Card>

        <Card class="delete-card">
          <template #header>
            <div class="card-header-content">
              <h4 class="card-title">Encerrar conta / Eliminar dados</h4>
              <p class="card-description">Conforme política de retenção e hipóteses legais.</p>
            </div>
          </template>

          <template #content>
            <p class="delete-warning">
              Ao encerrar, seus dados serão eliminados/anonimizados após os prazos aplicáveis.
            </p>
            <Button label="Encerrar e solicitar eliminação" icon="pi pi-trash" severity="danger"
              @click="$emit('request-delete')" class="btn-request-delete" />
          </template>
        </Card>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import './PrivacyTab.css'
import Card from 'primevue/card'
import Button from 'primevue/button'

defineProps({
  profile: {
    type: Object,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
})

defineEmits(['export-csv', 'request-delete'])
</script>
