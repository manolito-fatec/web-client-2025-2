import type { ChartDate } from '@/components/types/ChartDateaResponse.ts'

export function transformTicketsByProductData(data:ChartDate) {
  const ticketByProduct = data.ticketsCountGroupedByProduct;
  const newLabels = ticketByProduct.map(item => item.productName.split('(')[0]);
  const newValues = ticketByProduct.map(item => item.totalTickets);
  return  {
    labels: newLabels,
    datasets: [{
      label: 'Chamados',
      backgroundColor: '#000000',
      data: newValues
    }]
  };
}

export function transformTicketsByPeriod(data:ChartDate) {
  const ticketByPeriod = data.ticketsCountOverTime
  const newLabels = ticketByPeriod.map((item) => item.period)
  const newValues = ticketByPeriod.map((item) => item.totalTickets)
  return {
    labels: newLabels,
    datasets: [
      {
        label: 'Tickets',
        data: newValues,
        fill: false,
        borderColor: 'rgb(0,0,0)',
        tension: 0.1,
      },
    ],
  }
}
