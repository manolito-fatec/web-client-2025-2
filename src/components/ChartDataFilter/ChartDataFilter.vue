<script setup lang="ts">
import SelectList from '@/components/SelectList.vue'
import type { SelectListOption } from '@/components/types/SelectListOption.ts'
import { type Ref, ref } from 'vue'

const selectOptions: Ref<SelectListOption[]> = ref([
  { label: 'Todos', value: 'all' },
  { label: 'Nunes', value: '1' }
])



</script>

<template>
  <div class="filters-bar">
    <div class="filter-group">
      <label>Produto</label>
      <select>
        <option>Todos</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Cliente</label>
      <select>
        <option>Todos</option>
      </select>
      <SelectList :options="selectOptions"/>
    </div>
    <div class="filter-group">
      <label>De</label>
      <input type="date" value="2023-01-01" />
    </div>
    <div class="filter-group">
      <label>Até</label>
      <input type="date" value="2023-09-30" />
    </div>
    <div class="button-group">
      <button class="btn btn-clear">Limpar</button>
      <button class="btn btn-apply">Aplicar</button>
    </div>
  </div>
  <div class="export-button-container">
    <button class="btn btn-export">Exportar</button>
  </div>
</template>

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

.filter-group select,
.filter-group input[type='date'] {
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f8f9fa;
  font-size: 0.9rem;
  color: #555;
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
