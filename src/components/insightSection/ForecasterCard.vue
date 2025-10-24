<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { ChartDataStructure, Forecaster, MonthTicket } from '../types/InsightType/Insight';
import { ref } from 'vue';
import { watch } from 'vue';
const props = defineProps<{
forecaster: Forecaster[];
}>();

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: false,
    },
    y: {
      stacked: false,
      beginAtZero: true
    }
  },
  datasets: {
    bar: {
        barPercentage: 0.9,
        categoryPercentage: 0.8
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    }
  }
}

const grouped = ref<Record<string, Forecaster[]>>({});
const labels = ref<string[]>([]);
const chartData = ref<ChartDataStructure>({
    labels: [],
    datasets: []
});
const sumMonthTickets = ref<MonthTicket[]>([]);
const colorList = ['#003366', '#1E4E8D', '#2962FF', '#42A5F5', '#90CAF9', '#BBDEFB'];


function formatMonth(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
             .replace(".", "")
             .replace('/', ' ') 
             .replace(/^\w/, c => c.toUpperCase());
}

function formatMonthPtBr(date: Date) {
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" })
             .replace(".", "")
             .replace(/^\w/, c => c.toUpperCase());
}

function convertLabelToPtBr(labelStr: string): string {
  const [monthStr, yearStr] = labelStr.split(" ");
  const dateString = `${monthStr} 1, ${yearStr}`;

  const dateObj = new Date(dateString);
  return formatMonthPtBr(dateObj);
}

function calculateChartData(data: Forecaster[]) {
  if (!data || data.length === 0) {
    grouped.value = {};
    labels.value = [];
    chartData.value = { labels: [], datasets: [] };
    return;
  }
  sumTicketsByMonth(data);
  grouped.value = data.reduce((acc, curr) => {
    if (!acc[curr.productName]) acc[curr.productName] = [];
    acc[curr.productName].push(curr);
    return acc;
  }, {} as Record<string, Forecaster[]>);

  labels.value = [...new Set(
    data.map(r => formatMonth(r.futureDate))
  )].sort((a, b) => {
    const [ma, ya] = a.split("/");
    const [mb, yb] = b.split("/");
    const dateA = new Date(`${ya}-${ma}-01`).getTime();
    const dateB = new Date(`${yb}-${mb}-01`).getTime();
    
    return dateA - dateB;
  });

  const datasets = Object.keys(grouped.value).map((productName, index) => {
    const color = colorList[index % colorList.length];
    
    const dataPoints = labels.value.map(label => {
      const item = grouped.value[productName].find(
        d => formatMonth(d.futureDate) === label
      );
      return item ? item.totalTickets : 0;
    });

    return {
      label: productName,
      backgroundColor: color,
      borderColor: color,
      data: dataPoints,
      fill: false
    };
  });

  chartData.value = {
    labels: labels.value,
    datasets
  };

}

function sumTicketsByMonth(forecasters: Forecaster[]) {
    const monthlyTotals = forecasters.reduce((acc, curr) => {
        const monthYear = formatMonth(curr.futureDate);
        if (!acc[monthYear]) {
            acc[monthYear] = 0;
        }
        acc[monthYear] += curr.totalTickets;

        return acc;
    }, {} as Record<string, number>);

   const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => 
   {
    const dateStringA = `${a.split(" ")[0]} 1, ${a.split(" ")[1]}`;
    const dateStringB = `${b.split(" ")[0]} 1, ${b.split(" ")[1]}`;

    const dateA = new Date(dateStringA).getTime();
    const dateB = new Date(dateStringB).getTime();

    return dateA - dateB;
  });
  const finalResult = sortedMonths.map(month => ({
    month: month, 
    total: monthlyTotals[month]
  }));
  const finalList = finalResult.sort((a, b) => {
    return b.total - a.total;
  });
  sumMonthTickets.value = finalList;

}

watch(
  () => props.forecaster,
  (newForecasterData) => {
    if(!!newForecasterData){
      calculateChartData(newForecasterData);
    }
  },
  { 
    deep: true,
    immediate: true
  }
);

</script>
<template>
       <span>
           <p class="chart-subtitle-forecaster">Volume previsto (próximos 12 meses)</p>
           <p> Com base na previsão, o mês de maior volume geral de chamados será <b> {{ convertLabelToPtBr(sumMonthTickets[0]?.month)}}</b></p>
           <div class="chart-container">
              <Bar
                id="my-bar-chart"
                :options="chartOptions"
                :data="chartData"
                />
           </div>
        </span>
</template>
<style scoped>

.chart-container {
  width: 100%; 
  height: 430px;
}
.chart-subtitle-forecaster {
  font-size: 1.2rem;
  color: #000;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: bold;
}
</style>