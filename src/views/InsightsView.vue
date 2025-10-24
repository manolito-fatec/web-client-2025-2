<template>
  <div class="insight-container">
    <NavigationBar></NavigationBar>

    <div class="filter-card">
      <div class="p-field">
        <label for="client-filter">Cliente</label>
        <Dropdown id="client-filter" v-model="selectedClient" :options="clientOptions" optionLabel="name"
         class="client-dropdown" />
      </div>
    </div>
   <LoadingComponent v-show="insightLoading"/>
   <div v-show="!insightsData.length" class="empty-insights-message">
          <p>Selecione um cliente específico no filtro para ver os insights do produto.</p>
   </div>
   <div v-if="insightsData.length && forecasterDate.length" >
      <p class="forecaster-card-title">Previsão de sazonalidade e volume de tickets por produto</p>
      <div class="chart-card-full">
        <div class="chart-content-wrapper">
          <ForecasterCard :forecaster="forecasterDate"></ForecasterCard>
        </div>
      </div>

      <div class="insight-section-wrapper">
          <InsightCard :insights="insightsData"/>
      </div>

      <h2 class="chart-title-main">Análise de Causas Raízes</h2>
      <div class="chart-card-full">
        <div class="chart-content-wrapper">
          <p class="chart-subtitle-pareto">Pareto por Subcategoria (Ocorrências x % Acumulado)</p>
          <div class="pareto-chart-wrapper">
            <VueChart type="bar" :data="paretoChartData" :options="paretoChartOptions" />
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, type Ref, watch } from 'vue'


import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import Dropdown from 'primevue/dropdown'
import LoadingComponent from '@/components/LoadingComponent.vue'
import InsightCard from '@/components/insightSection/InsightCard.vue'


import {
  BarElement, CategoryScale, Chart as ChartJS, type Chart, type ChartData,
  type ChartOptions, Legend, LinearScale, LineElement, PointElement,
  Title, Tooltip, type TooltipItem,
} from 'chart.js'
import { Chart as VueChart } from 'vue-chartjs'


import { getRootCauseAnalysis } from '@/api/RootCauseAnalysisApi'
import { fetchProductInsights } from '@/api/InsightCardApi'
import { fetchFilterOptions } from '@/api/FiltersApi'


import type { RootCauseAnalysisData } from '@/types/RootCauseAnalysisResponse'
import type { FilterCompany } from '@/types/Company'
import type { SelectListOption } from '@/types/SelectListOption'
import type { Forecaster, ProductInsight } from '@/components/types/InsightType/Insight'
import ForecasterCard from '@/components/insightSection/ForecasterCard.vue'


const eightyPercentLine = {
  id: 'eightyPercentLine',
  afterDraw(chart: Chart) {
    const { ctx, chartArea, scales } = chart
    const yScale = scales.y1
    if (!yScale) return
    const yPosition = yScale.getPixelForValue(80)
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = 'rgb(255, 99, 132)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 6])
    ctx.moveTo(chartArea.left, yPosition)
    ctx.lineTo(chartArea.right, yPosition)
    ctx.stroke()
    ctx.restore()
  },
}
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, eightyPercentLine,
)

const selectedClient = ref<FilterCompany>()
const clientOptions: Ref<FilterCompany[]> = ref([])


const paretoLoading: Ref<boolean> = ref(false)
const rawParetoData: Ref<RootCauseAnalysisData> = ref({})


const insightLoading: Ref<boolean> = ref(false)
const insightsData: Ref<ProductInsight[]> = ref([]);
const forecasterDate: Ref<Forecaster[]> = ref([]);

const currentPage = ref(1);
const itemsPerPage = ref(3);

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
    insightsData.value = [];
    insightLoading.value = false;
    return;
  }

  insightLoading.value = true;
  try {
    const customerId = parseInt(clientCode);

    if (!isNaN(customerId)) {
      const rawInsights = await fetchProductInsights(customerId);

      insightsData.value = cleanInsightsData(rawInsights.productInsightsData);
      forecasterDate.value = rawInsights.seasonalityInsightData;
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

const totalPages = computed(() => {
  return Math.ceil(insightsData.value.length / itemsPerPage.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

function cleanActionText(text: string): string {
  if (!text) return '';
  // Regex:
  // \*\* -> Corresponde aos dois asteriscos de abertura
  // (.*?) -> Captura (de forma não-gulosa) qualquer caractere entre os asteriscos
  // \*\* -> Corresponde aos dois asteriscos de fechamento
  //  ? -> Corresponde a um espaço opcional logo após o fechamento
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

const sortedParetoData = computed(() => {
  if(selectedClient.value)
  {
  const clientCode = selectedClient.value.code
  const data = rawParetoData.value
  if (Object.keys(data).length === 0) return []

  const dataArray = Object.entries(data).map(([label, counts]) => {
    let occurrenceValue = 0
    if (clientCode === 'ALL') {
      if (counts && typeof counts === 'object') {
        occurrenceValue = Object.values(counts).reduce((sum, value) => sum + value, 0)
      }
    } else {
      occurrenceValue = (counts as Record<string, number>)?.[clientCode] || 0
    }
    return { label, occurrence: occurrenceValue }
  })

  const filteredData = dataArray.filter((item) => item.occurrence > 0)
  filteredData.sort((a, b) => b.occurrence - a.occurrence)
  return filteredData
}
})

const paretoLabels = computed(() => {
    if (sortedParetoData.value) {
      return sortedParetoData.value.map((item) => {
        return item.label; 
      });
    }
    return [];
});
const paretoOccurrences = computed(() => 
    sortedParetoData.value?.map((item) => item.occurrence) ?? []
);

const calculateCumulativePercentage = (data: number[]) => {
  const total = data.reduce((sum, value) => sum + value, 0)
  if (total === 0) return data.map(() => 0)
  let cumulativeSum = 0
  return data.map((value) => {
    cumulativeSum += value
    return (cumulativeSum / total) * 100
  })
}

const paretoCumulative = computed(() => calculateCumulativePercentage(paretoOccurrences.value))

const paretoChartData = computed<ChartData<'bar' | 'line', (number | null)[], string>>(() => {
  return {
    labels: paretoLabels.value,
    datasets: [
      {
        type: 'line',
        label: '% Acumulado',
        backgroundColor: 'transparent',
        borderColor: '#000000',
        borderWidth: 2,
        data: paretoCumulative.value,
        yAxisID: 'y1',
        tension: 0,
        pointRadius: 5,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#000000',
        pointBorderWidth: 2,
        order: 1,
        clip: false
      },
      {
        type: 'bar',
        label: 'Ocorrências',
        backgroundColor: '#1E293B',
        borderColor: '#1E293B',
        data: paretoOccurrences.value,
        yAxisID: 'y',
        order: 2,
      },
    ],
  }
})

const maxOccurrences = computed(() => {
  const max = Math.max(...paretoOccurrences.value)
  if (max === 0) return 1000
  return Math.ceil((max * 1.05) / 100) * 100
})

const suggestedMinOccurrences = computed(() => {
  const min = Math.min(...paretoOccurrences.value.filter(v => v > 0))
  if (min === Infinity || min === 0) return 0
  const suggestedMin = Math.floor(min / 100) * 100
  const max = Math.max(...paretoOccurrences.value)
  if ((max - min) > 200) return 0
  return suggestedMin > 0 ? suggestedMin : 0
})


const paretoChartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 30 } },
  plugins: {
    legend: { position: 'top', align: 'end', labels: { reverse: true, boxWidth: 10, padding: 10 } },
    tooltip: {
      callbacks: {
        label: function (context: TooltipItem<'bar' | 'line'>) {
          let label = context.dataset.label || ''
          if (context.parsed.y !== null) {
            if (context.dataset.yAxisID === 'y1') {
              label += `: ${context.parsed.y.toFixed(1)}%`
            } else {
              label += `: ${context.parsed.y}`
            }
          }
          return label
        },
        title: function (context: TooltipItem<'bar' | 'line'>[]) {
          const barValue = context.find((c: TooltipItem<'bar' | 'line'>) => c.dataset.type === 'bar')?.parsed.y || 0
          return `${context[0].label}: ${barValue}`
        },
      },
    },
  },
  scales: {
    x: { type: 'category', grid: { display: false }, ticks: { maxRotation: 30, minRotation: 0 } },
    y: {
      type: 'linear', position: 'left', min: suggestedMinOccurrences.value,
      max: maxOccurrences.value, title: { display: false },
      ticks: {
        stepSize: maxOccurrences.value === 0 ? 100
          : Math.max(10, Math.ceil((maxOccurrences.value - suggestedMinOccurrences.value) / 10)),
      },
      grid: { color: 'rgba(0, 0, 0, 0.1)' },
    },
    y1: {
      type: 'linear', position: 'right', min: 0, max: 100,
      ticks: { callback: function (value: any) { return value + '%' } },
      border: { display: false }, grid: { drawOnChartArea: false },
    },
  },
}))

watch(
  selectedClient,
  (newClient) => {
    if(!!newClient){
      fetchParetoData(newClient.code);
      fetchInsightsData(newClient.code);
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

.chart-subtitle-pareto {
  font-size: 0.9rem;
  color: #555;
  margin-top: 0;
  margin-bottom: 1rem;
}

.pareto-chart-wrapper {
  flex-grow: 1;
  position: relative;
}

.pareto-chart-wrapper>canvas {
  position: absolute;
  width: 100%;
  height: 100%;
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
