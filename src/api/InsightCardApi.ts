import type { InsightApiResponse, ProductInsight } from '@/types/InsightType/Insight';
import api from '@/api/axios/AxiosConfig.ts'


/**
 * Busca os insights de produto para um determinado cliente.
 * @param customerId - O ID do cliente para o qual buscar os insights.
 * @returns Uma promessa que resolve para um array de ProductInsight.
 */
export async function fetchProductInsights(customerId: number): Promise<InsightApiResponse> {
  const url = `api/insights/data`;

  try {
    const response = await api.get<InsightApiResponse>(url, {
      params: {
        customerId
      }
    });

    return response.data || [];

  } catch (error) {
    console.error(`Erro ao buscar insights para o cliente ID ${customerId}:`, error);
    throw error;
  }
}
