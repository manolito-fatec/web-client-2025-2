import type { TicketsResponse } from '@/types/Product';

export function transformTicketsByProductData(data:TicketsResponse) {
  const newLabels = data.ticketsCountGroupedByProduct.map(item => item.productName.split('(')[0]);
  const newValues = data.ticketsCountGroupedByProduct.map(item => item.totalTickets);
  return  {
    labels: newLabels,
    datasets: [{
      label: 'Chamados',
      backgroundColor: '#000000',
      data: newValues
    }]
  };
}
