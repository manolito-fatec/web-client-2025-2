export interface InsightTheme {
  theme: string;
  percentage: string;
  actions: string[];
}

export interface ProductInsight {
  id: string;
  companyId: number;
  companyName: string;
  productId: number;
  productName: string;
  insights: InsightTheme[];
  starttime: string;
  endtime: string;
  dth: string;
}

export interface InsightApiResponse {
  slaInsightData: any | null;
  seasonalityInsightData: Forecaster[];
  productInsightsData: ProductInsight[];
  paretoInsightData: any[];
}


export interface Forecaster {
  productId: number;
  productName: string;
  totalTickets: number;
  futureDate: string;
}
export interface Dataset {
  label: string;
  backgroundColor: string;
  borderColor: string;
  data: number[];
  fill: boolean;
  datalabels?: any;
};

export interface ChartDataStructure {
  labels: string[];
  datasets: Dataset[];
};

export interface MonthTicket {
  month: string,
  total: number
}