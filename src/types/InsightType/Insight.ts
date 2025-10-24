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
  seasonalityInsightData: any | null;
  productInsightsData: ProductInsight[];
  paretoInsightData: any[];
}
