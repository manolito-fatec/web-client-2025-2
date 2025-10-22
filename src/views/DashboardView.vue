<template>
  <div class="dashboard-container">
    <header class="header">
      <div class="header-content">
        <h1>Pardal - Análise de Chamados</h1>

        <div class="user-menu" ref="userMenuRef">
          <button @click="toggleDropdown" class="user-icon-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <div v-if="isDropdownOpen" class="dropdown-content">
            <button @click="logoutHandler" class="logout-button">Logout</button>
          </div>
        </div>
      </div>
      <nav class="navigation">
        <button class="nav-item active">Dashboard</button>
        <button class="nav-item">Insights</button>
        <button class="nav-item">Chamados</button>
        <button class="nav-item">Admin</button>
      </nav>
    </header>
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
import { onMounted, onUnmounted, ref, type Ref } from 'vue'
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
import { authService } from '@/api/AuthService.ts'
import NavigationBar from '@/components/navigationBar/NavigationBar.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
)

const chartOptions: ChartOptions<'bar' | 'line'> = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'category',
    },
    y: {
      beginAtZero: true,
    },
  },
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

const isDropdownOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const logoutHandler = () => {
  authService.logout();
  isDropdownOpen.value = false // Fecha o dropdown após clicar
}

const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(async () => {
  const filters: FilterOptions = {
    productId: '',
    companyId: '',
    startDate: '',
    endDate: '',
    periods: 'MONTH',
  }
  await applyFilters(filters)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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

.header {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.header-content {
  display: flex;
  margin: 0;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  margin: 0;
}

.navigation {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.nav-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  color: #999;
}

.nav-item.active {
  color: #000;
  border-bottom: 2px solid #3b82f6;
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
.chart-card h2 {
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 0.5rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.user-menu {
  position: relative;
}

.user-icon-button {
  background-color: #f0f0f0;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: background-color 0.2s;
}

.user-icon-button:hover {
  background-color: #e0e0e0;
}

.dropdown-content {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 100;
  min-width: 140px;
}

.logout-button {
  background-color: transparent;
  border: none;
  color: #d9534f;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.logout-button:hover {
  background-color: #fef2f2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
