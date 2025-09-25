import type { TicketsByProduct } from '@/components/types/ChartTypes/TicketsByProduct.ts'
import type { TicketsByPeriod } from '@/components/types/ChartTypes/TicketsByPeriod.ts'

export interface ChartDate {
  recidivismRate: number;
  ticketsCountGroupedByProduct : TicketsByProduct[];
  ticketClosureTimeInHours: number;
  ticketsCount:number;
  ticketsCountOverTime: TicketsByPeriod[];
}
