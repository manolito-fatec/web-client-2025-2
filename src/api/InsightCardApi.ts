import axios from 'axios';
import type { InsightApiResponse, ProductInsight } from '@/components/types/InsightType/Insight';

const BASE_URL = 'http://localhost:8080/';

/**
 * Busca os insights de produto para um determinado cliente.
 * @param customerId - O ID do cliente para o qual buscar os insights.
 * @returns Uma promessa que resolve para um array de ProductInsight.
 */
export async function fetchProductInsights(customerId: number): Promise<ProductInsight[]> {
  const url = `${BASE_URL}api/insights/data`;

  try {
    const response = await axios.get<InsightApiResponse>(url, {
      params: {
        customerId
      }
    });

    return response.data.productInsightsData || [];

  } catch (error) {
    console.error(`Erro ao buscar insights para o cliente ID ${customerId}:`, error);
    throw error;
  }
}
