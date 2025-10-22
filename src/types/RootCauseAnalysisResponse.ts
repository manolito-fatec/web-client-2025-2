export type OccurrencesByClient = {
  [clientCode: string]: number;
};

export type RootCauseAnalysisData = {
  [subCategory: string]: OccurrencesByClient;
};

export type RawParetoItem = {
  subcategoryId: number;
  subcategoryName: string;
  companyId: number;
  companyName: string;
  totalTickets: number;
};

export type InsightsDataDto = {
  paretoInsightData: RawParetoItem[];
};
