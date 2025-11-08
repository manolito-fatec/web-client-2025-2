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
                <span class="data-label">Empresa</span>
                <span class="data-value">{{ user.company }}</span>
              </div>
              <div class="data-item">
                <span class="data-label">Papel</span>
                <span class="data-value">{{ user.role }}</span>
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

<script setup>
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

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  padding-left: 2.2rem;
  padding-right: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #f1f5f9;
  border-radius: 20px;
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

.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.data-card,
.delete-card {
  border: 2px dotted #e6e6e6;
  padding: 10px;
}

.card-header-content {
  padding: 16px;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.card-description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.data-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.data-item:last-child {
  border-bottom: none;
}

.data-label {
  color: #64748b;
}

.data-value {
  font-weight: 500;
  color: #0f172a;
}

.card-footer-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.delete-warning {
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;
}

.btn-export-csv {
  border-color: #d6d6d6 !important;
  color: #0f172a !important; 
  font-size: smaller;
  white-space: nowrap;
}

.btn-export-csv:hover {
  background-color: #0ea5e91a !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}


.btn-request-delete {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
  font-weight: 500;
  font-size: smaller;
  white-space: nowrap;
}

.btn-request-delete:hover {
  background-color: #b91c1c !important;
  border-color: #b91c1c !important;
}

</style>