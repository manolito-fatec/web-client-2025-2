import type { TicketsByProduct } from '@/components/types/ChartTypes/TicketsByProduct.ts'

export interface ChartDate {
  recidivismRate: number;
  ticketsCountGroupedByProduct : TicketsByProduct[];
}
