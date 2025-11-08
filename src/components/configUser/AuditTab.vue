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
      <DataTable :value="auditData" class="audit-table" stripedRows>
        <Column field="id" header="#" style="width: 60px"></Column>
        <Column field="evento" header="Evento"></Column>
        <Column field="por" header="Por"></Column>
        <Column field="quando" header="Quando"></Column>
        <Column field="onde" header="Onde"></Column>
        <Column field="detalhe" header="Detalhe"></Column>
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
    required: true
  }
})

defineEmits(['export-audit'])
</script>
