<template>
  <div class="insight-container">
    <NavigationBar></NavigationBar>

    <div class="filter-card">
      <div class="p-field">
        <label for="client-filter">Cliente</label>
        <Dropdown
          id="client-filter"
          v-model="selectedClient"
          :options="clientOptions"
          optionLabel="name"
          class="client-dropdown"
        />
      </div>
    </div>

    <p class="forecaster-card-title">Previsão de tickets estourarem o SLA</p>
    <SlaPredictionCard
      v-show="slaPredictionData.length > 0 || slaPredictionLoading"
      :predictionData="slaPredictionData"
      :loading="slaPredictionLoading"
    />
    <LoadingComponent v-show="insightLoading" />
    <div v-show="!insightsData.length && !insightLoading" class="empty-insights-message">
      <p>Selecione um cliente específico no filtro para ver os insights do produto.</p>
    </div>

    <div v-if="insightsData.length && forecasterDate.length">
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

      <div v-if="insightsData.length && forecasterDate.length">
        <h2 class="chart-title-main">Análise de Causas Raízes</h2>
        <ParetoChart
          v-if="selectedClient"
          :raw-pareto-data="rawParetoData"
          :selected-client="selectedClient"
          :loading="paretoLoading"
        />

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref, watch, computed } from 'vue'

import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import Dropdown from 'primevue/dropdown'
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

const selectedClient = ref<FilterCompany>()
const clientOptions: Ref<FilterCompany[]> = ref([])

const paretoLoading: Ref<boolean> = ref(false)
const rawParetoData: Ref<RootCauseAnalysisData> = ref({})

const insightLoading: Ref<boolean> = ref(false)
const insightsData: Ref<ProductInsight[]> = ref([])
const forecasterDate: Ref<Forecaster[]> = ref([])

const slaPredictionLoading: Ref<boolean> = ref(false)
const slaPredictionData: Ref<SlaPredictionItem[]> = ref([])

const currentPage = ref(1)
const itemsPerPage = ref(3)

const loadClientOptions = async () => {
  try {
    const filterData = await fetchFilterOptions(3)
    const allCompanies = filterData.allCompanies as unknown as SelectListOption[]
    const companyOptions: FilterCompany[] = allCompanies.map((company) => ({
      name: company.name,
      code: company.id!.toString(),
    }))
    clientOptions.value = companyOptions
  } catch (error) {
    console.error('Error fetching filter options for clients:', error)
  }
}

const fetchParetoData = async (clientCode: string) => {
  paretoLoading.value = true
  try {
    const clientIdParam = clientCode === 'ALL' ? null : clientCode
    const apiData = await getRootCauseAnalysis(clientIdParam)
    rawParetoData.value = apiData || {}
  } catch (error) {
    console.error('Error fetching Pareto data:', error)
    rawParetoData.value = {}
  } finally {
    paretoLoading.value = false
  }
}

const fetchInsightsData = async (clientCode: string | null) => {
  if (clientCode === 'ALL' || clientCode === null) {
    insightsData.value = []
    insightLoading.value = false
    return
  }

  insightLoading.value = true
  try {
    const customerId = parseInt(clientCode)

    if (!isNaN(customerId)) {
      const rawInsights = await fetchProductInsights(customerId)

      insightsData.value = cleanInsightsData(rawInsights.productInsightsData)
      forecasterDate.value = rawInsights.seasonalityInsightData
    } else {
      console.warn('Invalid client ID for insights:', clientCode)
      insightsData.value = []
    }
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

watch(
  selectedClient,
  (newClient) => {
    if (!!newClient) {
      const clientCode = newClient.code
      fetchParetoData(clientCode)
      fetchInsightsData(clientCode)
      fetchSlaPredictionData(clientCode)
    } else {
      slaPredictionData.value = []
    }
  },
  { deep: true },
)

onMounted(async () => {
  await loadClientOptions()
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
  flex-direction: column;
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

.p-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p-field label {
  font-weight: bold;
  color: #555;
  font-size: 0.9rem;
}

.client-dropdown {
  width: 15rem;
  max-width: 100%;
}

.insight-section-wrapper {
  margin-top: 2.5rem;
}
</style>
