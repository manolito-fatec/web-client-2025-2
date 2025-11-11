<template>
  <div class="insight-container">
    <NavigationBar></NavigationBar>

    <div class="filter-card">
      <div class="p-field-group">

        <div class="p-field">
          <label for="client-filter">Cliente(s)</label>
          <MultiSelect
            id="client-filter"
            v-model="selectedClients"
            :options="clientOptions"
            optionLabel="name"
            placeholder="Selecione um ou mais clientes"
            class="client-multiselect"
            showClear
          />
        </div>

        <div class="p-field">
          <label for="product-filter">Produto(s)</label>
          <MultiSelect
            id="product-filter"
            v-model="selectedProducts"
            :options="productOptions"
            optionLabel="name"
            placeholder="Selecione um ou mais produtos"
            class="client-multiselect"
            showClear
          />
        </div>

      </div>
    </div>

    <LoadingComponent v-show="insightLoading" />
    <div v-show="!insightsData.length && !forecasterDate.length && !slaPredictionData.length" class="empty-insights-message">
      <p>Selecione um cliente específico no filtro para ver os insights do produto.</p>
    </div>

    <div v-if="insightsData.length && forecasterDate.length && slaPredictionData.length && !insightLoading ">
      <p class="forecaster-card-title">Previsão de tickets estourarem o SLA</p>
      <SlaPredictionCard
        :predictionData="slaPredictionData"
        :loading="slaPredictionLoading"
      />

      <p class="forecaster-card-title">Previsão de sazonalidade e volume de tickets por produto</p>
      <div class="chart-card-full">
        <div class="chart-content-wrapper">
          <ForecasterCard :forecaster="forecasterDate"></ForecasterCard>
        </div>
      </div>

      <div class="insight-section-wrapper">
        <InsightCard :insights="insightsData" />
      </div>

      <h2 class="chart-title-main">Análise de Causas Raízes</h2>
      <ParetoChart
        v-if="selectedClients.length"
        :raw-pareto-data="rawParetoData"
        :selected-clients="selectedClients" :loading="paretoLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref, watch, computed } from 'vue'

import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import MultiSelect from 'primevue/multiselect'
import LoadingComponent from '@/components/LoadingComponent.vue'
import InsightCard from '@/components/insightSection/InsightCard.vue'
import ParetoChart from '@/components/ParetoChart.vue'
import ForecasterCard from '@/components/insightSection/ForecasterCard.vue'
import SlaPredictionCard from '@/components/SlaPredictionCard.vue'
import type { SlaPredictionItem } from '@/types/InsightType/Insight.ts'

import { getRootCauseAnalysis } from '@/api/RootCauseAnalysisApi'
import { fetchProductInsights } from '@/api/InsightCardApi'
import { fetchFilterOptions } from '@/api/FiltersApi'
import { fetchSlaPrediction } from '@/api/SlaPredictionApi'

import type { RootCauseAnalysisData } from '@/types/RootCauseAnalysisResponse'
import type { FilterCompany } from '@/types/Company'
import type { SelectListOption } from '@/types/SelectListOption'
import type { Forecaster, ProductInsight } from '@/types/InsightType/Insight.ts'

const selectedClients: Ref<FilterCompany[]> = ref([])
const clientOptions: Ref<FilterCompany[]> = ref([])

const selectedProducts: Ref<FilterCompany[]> = ref([])
const productOptions: Ref<FilterCompany[]> = ref([])

const paretoLoading: Ref<boolean> = ref(false)
const rawParetoData: Ref<RootCauseAnalysisData> = ref({})

const insightLoading: Ref<boolean> = ref(false)
const insightsData: Ref<ProductInsight[]> = ref([])
const forecasterDate: Ref<Forecaster[]> = ref([])

const slaPredictionLoading: Ref<boolean> = ref(false)
const slaPredictionData: Ref<SlaPredictionItem[]> = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(3)

const loadFilterOptions = async () => {
  try {
    const [clientFilterData, productFilterData] = await Promise.all([
      fetchFilterOptions(3),
      fetchFilterOptions(1)
    ]);

    const allCompanies = clientFilterData.allCompanies as unknown as SelectListOption[]
    clientOptions.value = allCompanies.map((company) => ({
      name: company.name,
      code: company.id!.toString(),
    }))

    const allProducts = productFilterData.allProducts as unknown as SelectListOption[]
    productOptions.value = allProducts.map((product) => ({
      name: product.name,
      code: product.id!.toString(),
    }))

  } catch (error) {
    console.error('Error fetching filter options:', error)
  }
}

const fetchParetoData = async (clientCodes: string[]) => {
  paretoLoading.value = true
  try {
    const clientIdParam = clientCodes.length > 0 ? clientCodes.join(',') : null
    const apiData = await getRootCauseAnalysis(clientIdParam)
    rawParetoData.value = apiData || {}
  } catch (error) {
    console.error('Error fetching Pareto data:', error)
    rawParetoData.value = {}
  } finally {
    paretoLoading.value = false
  }
}

const fetchInsightsData = async () => {
  const clientCodes = selectedClients.value.map(client => client.code);
  const productCodes = selectedProducts.value.map(product => product.code);

  if (clientCodes.length === 0 || productCodes.length === 0) {
    insightsData.value = []
    insightLoading.value = false
    return
  }

  insightLoading.value = true
  try {
    const rawInsights = await fetchProductInsights(clientCodes, productCodes);

    insightsData.value = cleanInsightsData(rawInsights.productInsightsData)
    forecasterDate.value = rawInsights.seasonalityInsightData

  } catch (error) {
    console.error('Erro ao buscar insights:', error)
    insightsData.value = []
  } finally {
    insightLoading.value = false
  }
}

const fetchSlaPredictionData = async (clientCode: string | null) => {
  if (!clientCode || clientCode === 'ALL') {
    slaPredictionData.value = []
    slaPredictionLoading.value = false
    return
  }

  slaPredictionLoading.value = true
  try {
    const data: SlaPredictionItem[] = await fetchSlaPrediction(clientCode)
    slaPredictionData.value = data
  } catch (error) {
    console.error('Error fetching SLA prediction data:', error)
    slaPredictionData.value = []
  } finally {
    slaPredictionLoading.value = false
  }
}

const totalPages = computed(() => {
  return Math.ceil(insightsData.value.length / itemsPerPage.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function cleanActionText(text: string): string {
  if (!text) return ''

  const regex = /\*\*(.*?)\*\* ?/g
  return text.replace(regex, '')
}

function cleanInsightsData(insights: ProductInsight[]): ProductInsight[] {
  if (!insights) return []

  return insights.map((product) => ({
    ...product,
    insights: product.insights.map((theme) => ({
      ...theme,
      actions: theme.actions.map((action) => cleanActionText(action)),
    })),
  }))
}

watch(selectedClients, (newClients) => {
  const clientCode = newClients.length > 0 ? newClients[0].code : null;
  const clientCodesForPareto = newClients.map(client => client.code);

  if (newClients.length > 0) {
    fetchParetoData(clientCodesForPareto)
    fetchSlaPredictionData(clientCode)
  } else {
    rawParetoData.value = {}
    slaPredictionData.value = []
    selectedProducts.value = []
  }

  fetchInsightsData()
}, { deep: true });

watch(selectedProducts, () => {
  fetchInsightsData()
}, { deep: true });


onMounted(async () => {
  await loadFilterOptions()
})

</script>

<style scoped>
.insight-container {
  font-family: Arial, sans-serif;
  padding: 2rem;
  background-color: #f7f9fc;
  color: #333;
}

.forecaster-card-title {
  font-size: 20px;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.filter-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 2rem;
}

.p-field-group {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.p-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  max-width: 20rem;
}

.p-field label {
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}

.client-multiselect {
  width: 100%;
}

.chart-card-full {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 35rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

.chart-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 35rem;
}

.chart-title-main {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.empty-insights-message {
  text-align: center;
  color: #777;
  padding: 2rem 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.insight-section-wrapper {
  margin-top: 2.5rem;
}
</style>
