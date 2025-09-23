<template>
  <div class="dashboard-container">
    <header class="header">
      <div class="header-content">
        <h1>Pardal - Análise de Chamados</h1>
        <div class="analyst-info">
          <span>Analista</span>
          <select>
            <option>Selecione</option>
          </select>
        </div>
      </div>
      <nav class="navigation">
        <button class="nav-item active">Dashboard</button>
        <button class="nav-item">Insights</button>
        <button class="nav-item">Chamados</button>
        <button class="nav-item">Admin</button>
      </nav>
    </header>
    <ChartDataFilter
      @applyFilters="applyFilters"
    ></ChartDataFilter>
    <LoadingComponent v-if="loadingValue"></LoadingComponent>
    <div v-if="!loadingValue">
      <div class="metrics-grid">
        <Cards title="Total de Chamados" :value=totalOfTicketsValue></Cards>
        <Cards title="Tempo Médio de Resolução" :value=averageTimeValue></Cards>
        <Cards title="% Reincidência" :value="reOpenedValue"></Cards>
        <Cards title="SLA Cumprido" :value=slaCompliancePercentualValue></Cards>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <h2>Chamados por Produto</h2>
          <BarChart :data="productChartData" />
        </div>
      </div>  
    </div>
<!--      <div class="chart-card">-->
<!--        <h2>Chamados ao Longo do Tempo</h2>-->
<!--        <LineChart :chart-data="timeChartData" />-->
<!--      </div>-->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, type ChartData } from 'chart.js';
import { Bar as BarChart} from 'vue-chartjs';
import ChartDataFilter from "@/components/chartDataFilter/ChartDataFilter.vue";
import Cards from "@/components/ticketsCard/Cards.vue";
import { getChartDate } from '@/api/ChartDataApi';
import LoadingComponent from '@/components/LoadingComponent.vue';
import type {FilterOptions} from "@/types/FilterOptions.ts";
import { transformTicketsByProductData } from '@/components/ChartService.ts'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement);



const applyFilters = async (data: FilterOptions) => {
  loadingValue.value = true;
  try {
    const response = await getChartDate(data);
    reOpenedValue.value = `${response.recidivismRate.toPrecision(2)}%`;
    averageTimeValue.value = `${response.ticketClosureTimeInHours.toPrecision(4)} Horas`;
    totalOfTicketsValue.value = `${response.ticketsCount}`;
    slaCompliancePercentualValue.value = `${response.slaCompliancePercentualDto.toPrecision(2)}%`;
    productChartData.value = transformTicketsByProductData(response);
  } catch (error) {
    console.error("Error fetching chart information", error);
  } finally {
    loadingValue.value = false;
  }
};

const averageTimeValue: Ref<string> = ref<string>("0 Horas")
const totalOfTicketsValue: Ref<string> = ref<string>("0")
const slaCompliancePercentualValue: Ref<string> = ref<string>("0%")
const loadingValue: Ref<boolean> = ref<boolean>(false)
const reOpenedValue: Ref<string> = ref<string>("0%");  

const productChartData: Ref<ChartData<'bar', number[], string>> = ref({
  labels: [],
  datasets: [{
    label: 'Chamados',
    backgroundColor: '#000000',
    data: []
  }]
});

const timeChartData = ref({
  labels: ['2025-08', '2025-09'],
  datasets: [{
    label: 'Chamados',
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    data: [5, 1],
    fill: false,
    tension: 0.4
  }]
});

onMounted(async () => {
  const filters: FilterOptions = {
  productId: "",
  companyId: "",
  startDate: "",
  endDate: "",
 };
 applyFilters(filters);
})

</script>

<style scoped>
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.chart-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

