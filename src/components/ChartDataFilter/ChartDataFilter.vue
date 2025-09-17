<template>
  <div class="filters-bar">
    <div class="filter-group">
      <label>Produto</label>
      <Select
        v-model="selectedProduct"
        :options="clients"
        optionLabel="name"
        optionValue="code"
        :panelStyle="{
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
        }"
      >
      </Select>
    </div>
    <div class="filter-group">
      <label>Cliente</label>
      <Select
        v-model="selectedClient"
        :options="clients"
        optionLabel="name"
        optionValue="code"
        :panelStyle="{
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
        }"
      >
      </Select>
    </div>
    <div class="filter-group">
      <label>De</label>
      <DatePicker
        v-model="dateStart"
        showIcon
        dateFormat="dd/mm/yy"
        :maxDate="new Date()"
        :panelStyle="{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
        }"
      />
    </div>
    <div class="filter-group">
      <label>Até</label>
      <DatePicker
        v-model="dateEnd"
        showIcon
        dateFormat="dd/mm/yy"
        :maxDate="new Date()"
        :panelStyle="{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
        }"
      />
    </div>
    <div class="button-group">
      <button class="btn btn-clear" @click="resetFilters">Limpar</button>
      <button class="btn btn-apply" @click="applyFilters">Aplicar</button>
    </div>
  </div>
  <div class="export-button-container">
    <button class="btn btn-export">Exportar</button>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import type { FilterOptions } from '@/components/types/FilterOptions.ts'

const baseDate = new Date()

baseDate.setMonth(baseDate.getMonth() - 1)

const dateStart = ref(baseDate)
const dateEnd = ref(new Date())

const selectedClient = ref('all')
const selectedProduct = ref('all')

function subtractMonth(dateData: Date, numberOfMonths: number) {
  return new Date(dateData.setMonth(dateData.getMonth() - numberOfMonths))
}

const resetFilters = () => {
  dateStart.value = subtractMonth(new Date(), 1)
  dateEnd.value = new Date()
  selectedClient.value = 'all'
  selectedProduct.value = 'all'
}



const applyFilters = () => {
  const appliedFilters: Ref<FilterOptions> = ref<FilterOptions>({
    productId: selectedProduct.value,
    companyId: selectedClient.value,
    startDate: dateStart.value.toLocaleDateString("pt-BR"),
    endDate: dateEnd.value.toLocaleDateString("pt-BR")
    });

  console.log(appliedFilters.value);
}

const clients = ref([
  { name: 'Todos', code: 'all' },
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
])
</script>

<style scoped>
.filters-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  margin-bottom: 0;
}

.filter-group :deep(.p-select) {
  display: flex;
  align-items: center;
  height: 2.5rem;
  width: 10.5rem;
  padding: 0 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  color: #555;
}

.filter-group input[type='date'] {
  display: flex;
  align-items: center;
  height: 2.5rem;
  width: 9.5rem;
  padding: 0 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  color: #555;
}

.filter-group :deep(.p-datepicker) {
  height: 2.5rem;
  width: 10.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.export-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  height: 2.5rem;
  transition: all 0.2s ease-in-out;
}

.btn-clear {
  background-color: #f0f4f8;
  color: #3b5066;
  border: none;
}

.btn-apply {
  background-color: #0f172a;
  color: #ffffff;
  border: none;
}

.btn-export {
  background-color: #0f172a;
  color: #ffffff;
  border: none;
}
</style>
