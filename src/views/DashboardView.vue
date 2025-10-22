<template>
  <div class="dashboard-container">
    <NavigationBar></NavigationBar>

    <ChartDataFilter @applyFilters="applyFilters"></ChartDataFilter>
    <LoadingComponent v-if="loadingValue"></LoadingComponent>
    <div v-if="!loadingValue">
      <div class="metrics-grid">
        <Cards title="Total de Chamados" :value="totalOfTicketsValue"></Cards>
        <Cards title="Tempo Médio de Resolução" :value="averageTimeValue"></Cards>
        <Cards title="% Reincidência" :value="reOpenedValue"></Cards>
        <Cards title="SLA Cumprido" :value="slaCompliancePercentualValue"></Cards>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <h2>Chamados por Produto</h2>
          <BarChart :data="productChartData" :options="chartOptions" />
        </div>
        <div class="chart-card">
          <h2>Chamados ao Longo do Tempo</h2>
          <LineChart :data="timeChartData" :options="chartOptions" />
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue'
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
    type ChartOptions
} from 'chart.js'
import { Bar as BarChart, Line as LineChart } from 'vue-chartjs'
import ChartDataFilter from '@/components/chartDataFilter/ChartDataFilter.vue'
import Cards from '@/components/ticketsCard/Cards.vue'
import { getChartDate } from '@/api/ChartDataApi'
import LoadingComponent from '@/components/LoadingComponent.vue'
import type { FilterOptions } from '@/types/FilterOptions.ts'
import {
    transformTicketsByPeriod,
    transformTicketsByProductData,
} from '@/components/ChartService.ts'
import NavigationBar from '@/components/navigationBar/NavigationBar.vue'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
)

const chartOptions: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            type: 'category'
        },
        y: {
            beginAtZero: true
        }
    }
}

const applyFilters = async (data: FilterOptions) => {
    loadingValue.value = true
    try {
        const response = await getChartDate(data)
        reOpenedValue.value = `${response.recidivismRate.toPrecision(2)}%`
        averageTimeValue.value = `${response.ticketClosureTimeInHours.toPrecision(4)} Horas`
        totalOfTicketsValue.value = `${response.ticketsCount}`
        slaCompliancePercentualValue.value = `${response.slaCompliancePercentualDto.toPrecision(2)}%`
        productChartData.value = transformTicketsByProductData(response)
        timeChartData.value = transformTicketsByPeriod(response)
    } catch (error) {
        console.error('Error fetching chart information', error)
    } finally {
        loadingValue.value = false
    }
}

const averageTimeValue: Ref<string> = ref<string>('0 Horas')
const totalOfTicketsValue: Ref<string> = ref<string>('0')
const slaCompliancePercentualValue: Ref<string> = ref<string>('0%')
const loadingValue: Ref<boolean> = ref<boolean>(false)
const reOpenedValue: Ref<string> = ref<string>('0%')

const productChartData: Ref<ChartData<'bar', number[], string>> = ref({
    labels: [],
    datasets: [
        {
            label: 'Chamados',
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            data: [],
        },
    ],
})

const timeChartData: Ref<ChartData<'line', number[], string>> = ref({
    labels: [],
    datasets: [
        {
            label: 'Chamados',
            backgroundColor: '#10b981',
            borderColor: '#10b981',
            data: [],
        },
    ],
})

onMounted(async () => {
    const filters: FilterOptions = {
        productId: '',
        companyId: '',
        startDate: '',
        endDate: '',
        periods: 'MONTH',
    }
    await applyFilters(filters)
})
</script>

<style scoped>
html {
    overflow: hidden;
}

.dashboard-container {
    font-family: Arial, sans-serif;
    padding: 2rem;
    background-color: #f7f9fc;
    color: #333;
}

.header-content h1{
    margin: 0;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    height: 30rem;

}

.chart-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 30rem;
}
.chart-card h2{
    margin: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
