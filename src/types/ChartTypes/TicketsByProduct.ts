export interface TicketsByProduct {
  productId: number;
  productName: string;
  totalTickets: number;
}

interface ChartDataset {
  label: string;
  backgroundColor: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}
