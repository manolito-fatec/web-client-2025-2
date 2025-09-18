<template>
  <div class="filters-bar">
    <div class="filter-group">
      <label>Produto</label>
      <Select
        v-model="selectedProduct"
        :options="products"
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
import './ChartDataFilter.css'
import { onMounted, type Ref, ref } from 'vue'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import type { FilterOptions } from '@/components/types/FilterOptions.ts'
import { fetchFilterOptions } from '@/api/FiltersApi.ts'
import type { SelectListOption } from '@/components/types/SelectListOption.ts'

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
    startDate: dateStart.value.toLocaleDateString('pt-BR'),
    endDate: dateEnd.value.toLocaleDateString('pt-BR'),
  })
}

const clients:Ref<SelectListOption[]> = ref<SelectListOption[]>([{
  name: "Todas", code: "all"
}]);

const products:Ref<SelectListOption[]> = ref<SelectListOption[]>([{
  name: "Todas", code: "all"
}]);

onMounted(() => {
  fetchFilterOptions(3)
    .then((resultado) => {
      for (let i = 0; i < resultado.allCompanies.length; i++) {
        const selectListOption: Ref<SelectListOption> = ref<SelectListOption>({
          name: resultado.allCompanies[i].name,
          code: resultado.allCompanies[i].id
        })
        clients.value.push(selectListOption.value)
      }
      for (let i = 0; i < resultado.allProducts.length; i++) {
        const selectListOption: Ref<SelectListOption> = ref<SelectListOption>({
          name: resultado.allProducts[i].name,
          code: resultado.allProducts[i].id
        })
        products.value.push(selectListOption.value)
      }
    })
    .catch((error) => {
      console.error('A busca geral falhou:', error.message)
    })
})
</script>

<style scoped>

</style>
