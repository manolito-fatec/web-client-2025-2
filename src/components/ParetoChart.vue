<template>
  <div class="chart-card-full">
    <LoadingComponent v-show="loading" />
    <div v-show="!loading" class="chart-content-wrapper">
      <h2 class="chart-title-main">Análise de Causas Raízes</h2>
      <p class="chart-subtitle-pareto">Pareto por Subcategoria (Ocorrências x % Acumulado)</p>
      <div class="pareto-chart-wrapper">
        <VueChart type="bar" :data="paretoChartData" :options="paretoChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import LoadingComponent from '@/components/LoadingComponent.vue'
import {
  BarElement, CategoryScale, Chart as ChartJS, type Chart, type ChartData,
  type ChartOptions, Legend, LinearScale, LineElement, PointElement,
  Title, Tooltip, type TooltipItem,
} from 'chart.js'
import { Chart as VueChart } from 'vue-chartjs'

import type { RootCauseAnalysisData } from '@/types/RootCauseAnalysisResponse'
import type { FilterCompany } from '@/types/Company'


const props = defineProps<{
  rawParetoData: RootCauseAnalysisData
  selectedClient: FilterCompany
  loading: boolean
}>()

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

const sortedParetoData = computed(() => {
  const clientCode = props.selectedClient.code
  const data = props.rawParetoData
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
})

const paretoLabels = computed(() => sortedParetoData.value.map((item) => item.label))
const paretoOccurrences = computed(() => sortedParetoData.value.map((item) => item.occurrence))

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

</script>

<style scoped>
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
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  margin-bottom: 0.2rem;
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
</style>
