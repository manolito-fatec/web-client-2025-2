import type { TicketsByProduct } from '@/types/ChartTypes/TicketsByProduct.ts'
import type { TicketsByPeriod } from '@/types/ChartTypes/TicketsByPeriod.ts'

export interface ChartDate {
  recidivismRate: number;
  ticketsCountGroupedByProduct : TicketsByProduct[];
  ticketClosureTimeInHours: number;
  ticketsCount:number;
  slaCompliancePercentualDto:number;
  ticketsCountOverTime: TicketsByPeriod[];
}
