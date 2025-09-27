import type { TicketsByPeriod } from '@/components/types/ChartTypes/TicketsByPeriod.ts'

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

interface TicketCountGroupedByProduct {
  productId: number;
  productName: string;
  totalTickets: number;
}

export interface TicketsResponse {
  ticketsCountGroupedByProduct: TicketCountGroupedByProduct[];
  ticketsCountOverTime: TicketsByPeriod[];
}
