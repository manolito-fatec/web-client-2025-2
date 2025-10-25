import api from '@/api/axios/AxiosConfig.ts'
import type { SlaPredictionResponse, InsightApiResponse, SlaPredictionItem } from '@/types/InsightType/Insight'

const BASE_URL = 'api/insights/data';

const transformSlaPrediction = (data: SlaPredictionResponse[]): SlaPredictionItem[] => {
  if (!Array.isArray(data)) return [];

  const mappedData = data.map(item => ({
    name: item.subcategoryName,
    percentage: Math.round(item.averageRiskProbability * 100),
  }));

  mappedData.sort((a, b) => b.percentage - a.percentage);

  return mappedData;
};

export async function fetchSlaPrediction(companyId: string | null)
  : Promise<SlaPredictionItem[]> {
  try {
    let clientParam = '';

    if (companyId && companyId !== 'ALL') {
      clientParam = `customerId=${companyId}`;
    }

    const url = clientParam ? `${BASE_URL}?${clientParam}` : BASE_URL;

    const response = await api.get<InsightApiResponse>(url);

    const slaData = response.data.slaInsightData;

    return transformSlaPrediction(slaData);

  } catch (error) {
    console.error("Error fetching SLA prediction data", error);
    return [];
  }
}
