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
