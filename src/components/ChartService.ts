import type { TicketsResponse } from '@/types/Product';

/**
 * Transforms ticket data grouped by product into a Chart.js compatible dataset.
 *
 * @param data - The chart data object containing tickets grouped by product.
 * @returns An object with `labels` (product names) and `datasets` (tickets count per product).
 */
export function transformTicketsByProductData(data: TicketsResponse) {
  const ticketByProduct = data.ticketsCountGroupedByProduct;
  const newLabels = ticketByProduct.map(item => item.productName.split('(')[0]);
  const newValues = ticketByProduct.map(item => item.totalTickets);

  return {
    labels: newLabels,
    datasets: [
      {
        label: 'Chamados',
        backgroundColor: '#000000',
        data: newValues,
      },
    ],
  };
}

/**
 * Transforms ticket data grouped by time period into a Chart.js compatible dataset.
 *
 * @param data - The chart data object containing tickets over time.
 * @returns An object with `labels` (time periods) and `datasets` (tickets count per period).
 */
export function transformTicketsByPeriod(data: TicketsResponse) {
  const ticketByPeriod = data.ticketsCountOverTime;
  const newLabels = ticketByPeriod.map(item => item.period);
  const newValues = ticketByPeriod.map(item => item.totalTickets);

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
  };
}
