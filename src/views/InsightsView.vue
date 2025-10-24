<template>
  <div class="insight-container">
    <NavigationBar></NavigationBar>

    <div class="filter-card">
      <div class="p-field">
        <label for="client-filter">Cliente</label>
        <Dropdown id="client-filter" v-model="selectedClient" :options="clientOptions" optionLabel="name"
          placeholder="Todos" class="client-dropdown" />
      </div>
    </div>

    <div class="sla-prediction-wrapper">
      <SlaPredictionCard
        :prediction-data="slaPredictionData"
        :loading="slaPredictionLoading"
      />
    </div>
    <RootCauseParetoChart
      :raw-pareto-data="rawParetoData"
      :selected-client="selectedClient"
      :loading="paretoLoading"
    />

    <div class="insight-section-wrapper">
      <LoadingComponent v-show="insightLoading" />

      <div v-show="!insightLoading && selectedClient.code === 'ALL'" class="empty-insights-message">
        <p>Selecione um cliente específico no filtro para ver os insights do produto.</p>
      </div>

      <div v-show="!insightLoading && selectedClient.code !== 'ALL'">
        <InsightCard :insights="insightsData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref, watch } from 'vue'

import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import Dropdown from 'primevue/dropdown'
import LoadingComponent from '@/components/LoadingComponent.vue'
import InsightCard from '@/components/insightSection/InsightCard.vue'
import RootCauseParetoChart from '@/components/ParetoChart.vue'

import SlaPredictionCard, { type SlaPredictionItem } from '@/components/SlaPredictionCard.vue'

import { getRootCauseAnalysis } from '@/api/RootCauseAnalysisApi'
import { fetchProductInsights } from '@/api/InsightCardApi'
import { fetchFilterOptions } from '@/api/FiltersApi'

import type { RootCauseAnalysisData } from '@/types/RootCauseAnalysisResponse'
import type { FilterCompany } from '@/types/Company'
import type { SelectListOption } from '@/types/SelectListOption'
import type { ProductInsight } from '@/components/types/InsightType/Insight'

const selectedClient = ref<FilterCompany>({ name: 'Todos', code: 'ALL' })
const clientOptions: Ref<FilterCompany[]> = ref([{ name: 'Todos', code: 'ALL' }])


const paretoLoading: Ref<boolean> = ref(false)
const rawParetoData: Ref<RootCauseAnalysisData> = ref({})

const slaPredictionLoading: Ref<boolean> = ref(false)
const slaPredictionData: Ref<SlaPredictionItem[]> = ref([])

const insightLoading: Ref<boolean> = ref(false)
const insightsData: Ref<ProductInsight[]> = ref([]);


const loadClientOptions = async () => {
  try {
    const filterData = await fetchFilterOptions(3)
    const allCompanies = filterData.allCompanies as unknown as SelectListOption[]
    const companyOptions: FilterCompany[] = allCompanies.map(
      (company) => ({
        name: company.name,
        code: company.id!.toString(),
      }),
    )
    clientOptions.value = [{ name: 'Todos', code: 'ALL' }, ...companyOptions]
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
    insightsData.value = [];
    insightLoading.value = false;
    return;
  }

  insightLoading.value = true;
  try {
    const customerId = parseInt(clientCode);

    if (!isNaN(customerId)) {
      const rawInsights = await fetchProductInsights(customerId);

      insightsData.value = cleanInsightsData(rawInsights);

    } else {
      console.warn('Invalid client ID for insights:', clientCode);
      insightsData.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar insights:", error);
    insightsData.value = [];
  } finally {
    insightLoading.value = false;
  }
};

function cleanActionText(text: string): string {
  if (!text) return '';
  const regex = /\*\*(.*?)\*\* ?/g;
  return text.replace(regex, '');
}

function cleanInsightsData(insights: ProductInsight[]): ProductInsight[] {
  if (!insights) return [];

  return insights.map(product => ({
    ...product,
    insights: product.insights.map(theme => ({
      ...theme,
      actions: theme.actions.map(action => cleanActionText(action))
    }))
  }));
}

watch(
  selectedClient,
  (newClient) => {
    fetchParetoData(newClient.code);
    fetchInsightsData(newClient.code);
  },
  { deep: true },
)


onMounted(async () => {
  await loadClientOptions()
  await Promise.all([
    fetchParetoData(selectedClient.value.code),
    fetchInsightsData(selectedClient.value.code)
  ]);
})
</script>

<style scoped>
.insight-container {
  font-family: Arial, sans-serif;
  padding: 2rem;
  background-color: #f7f9fc;
  color: #333;
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

.sla-prediction-wrapper {
  margin-bottom: 2.5rem;
  max-width: 100%;
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

.empty-insights-message {
  background-color: #fff;
  padding: 2.5rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #555;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
</style>
