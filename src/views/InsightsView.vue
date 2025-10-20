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
          placeholder="Todos"
          class="client-dropdown"
        />
      </div>
    </div>

    <div class="chart-card-full">
      <h2 class="chart-title-main">Análise de Causas Raízes</h2>
      <p class="chart-subtitle-pareto">Pareto por Subcategoria (Ocorrências x % Acumulado)</p>

      <div class="pareto-chart-wrapper">
        <BarChart :data="paretoChartData" :options="paretoChartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, type Ref } from 'vue'
import NavigationBar from '@/components/navigationBar/NavigationBar.vue'
import Dropdown from 'primevue/dropdown'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from 'chart.js'
import { Bar as BarChart } from 'vue-chartjs'

import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

const selectedClient = ref({ name: 'Todos', code: 'ALL' });
const clientOptions = ref([
  { name: 'Todos', code: 'ALL' },
  { name: 'Empresa Alpha', code: 'E1' },
  { name: 'Empresa Beta', code: 'E2' },
]);

const rawParetoData = ref({
  'Login/Senha': { ALL: 834, E1: 500, E2: 334 },
  'Faturamento': { ALL: 612, E1: 200, E2: 412 },
  'Instabilidade no Produto Y': { ALL: 451, E1: 300, E2: 151 },
  'Funcionalidade Y': { ALL: 320, E1: 150, E2: 170 },
  'Relatórios': { ALL: 298, E1: 50, E2: 248 },
});

const paretoLabels = computed(() => Object.keys(rawParetoData.value));

const paretoOccurrences = computed(() => {
  const clientCode = selectedClient.value.code;
  return paretoLabels.value.map(label => {
    return rawParetoData.value[label][clientCode] || 0;
  });
});

const calculateCumulativePercentage = (data: number[]) => {
  const total = data.reduce((sum, value) => sum + value, 0)
  if (total === 0) return data.map(() => 0);
  let cumulativeSum = 0
  return data.map(value => {
    cumulativeSum += value
    return (cumulativeSum / total) * 100
  })
}

const paretoCumulative = computed(() => calculateCumulativePercentage(paretoOccurrences.value))


const paretoChartData: Ref<ChartData<'bar' | 'line', (number | null)[], string>> = computed(() => {
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
    ]
  }
})

const maxOccurrences = computed(() => {
  const max = Math.max(...paretoOccurrences.value);
  if (max === 0) return 1000;
  return Math.ceil((max * 1.1) / 100) * 100;
});

const paretoChartOptions: ChartOptions<'bar'> = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 20
    }
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        reverse: true,
        boxWidth: 10,
        padding: 10
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (context.parsed.y !== null) {
            if (context.dataset.yAxisID === 'y1') {
              label += `: ${context.parsed.y.toFixed(1)}%`;
            } else {
              label += `: ${context.parsed.y}`;
            }
          }
          return label;
        },
        title: function(context) {
          const barValue = context[1].parsed.y;
          return `${context[0].label}: ${barValue}`;
        }
      }
    },
    annotation: {
      annotations: {
        line80percent: {
          type: 'line',
          value: 80,
          scaleID: 'y1',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          borderDash: [6, 6],
          drawTime: 'afterDatasetsDraw',
          label: {
            display: false,
            content: '80%',
            backgroundColor: 'rgb(255, 99, 132)',
            borderRadius: 6,
            padding: 4,
            font: {
              color: 'white',
              size: 12,
              weight: 'bold',
            },
            position: 'end',
            xAdjust: 0,
            yAdjust: -12,
          },
        },
      }
    }
  },
  scales: {
    x: {
      type: 'category',
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 0,
        minRotation: 0
      }
    },
    y: {
      type: 'linear',
      position: 'left',
      min: 0,
      max: maxOccurrences.value,
      title: {
        display: false
      },
      ticks: {
        stepSize: Math.max(100, Math.ceil(maxOccurrences.value / 10) / 10) * 10
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    y1: {
      type: 'linear',
      position: 'right',
      min: 0,
      max: 100,
      ticks: {
        callback: function(value: any) {
          return value + '%';
        }
      },
      border: {
        display: false,
      },
      grid: {
        drawOnChartArea: false,
      },
    }
  }
}))

onMounted(() => {
});
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

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.prediction-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2.5rem;
}

.chart-card-full {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 30rem;
  display: flex;
  flex-direction: column;

  max-width: 1000px;
  width: 90%;
  margin-right: auto;
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

.pareto-chart-wrapper > canvas {
  position: absolute;
  width: 100%;
  height: 90rem;
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

.prediction-description {
  color: #555;
  margin-top: 0;
  margin-bottom: 1rem;
}

.prediction-list {
  list-style: none;
  padding: 0;
}

.prediction-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.7rem;
  color: #333;
}

.indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 0.2rem;
}

.high-risk {
  background-color: #ef4444;
}
</style>
