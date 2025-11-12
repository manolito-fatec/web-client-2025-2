<template>
  <Card class="audit-card">
    <template #header>
      <div class="section-header">
        <div class="header-icon">
          <i class="pi pi-chart-bar"></i>
        </div>
        <div class="header-content">
          <h3 class="header-title">Auditoria de Acessos e Ações</h3>
          <p class="header-subtitle">Exportação e rastreabilidade (art. 6 e art. 46).</p>
        </div>
      </div>
    </template>

    <template #content>
      <DataTable :value="auditData" paginator :rows="5" size="small" stripedRows class="audit-table">
        <template #empty>Nenhum registro encontrado.</template>

        <Column field="event" header="Evento"></Column>
        <Column field="user" header="Usuário"></Column>
        <Column field="date" header="Data"></Column>
        <Column field="locale" header="IP"></Column>
        <Column field="details" header="Detalhes"></Column>
      </DataTable>
    </template>

    <template #footer>
      <Button label="Exportar CSV" icon="pi pi-download" @click="$emit('export-audit')" class="btn-csv-export" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import './AuditTab.css'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps({
  auditData: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['export-audit'])
</script>
