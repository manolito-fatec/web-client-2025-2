import type { InsightApiResponse } from '@/types/InsightType/Insight';
import api from '@/api/axios/AxiosConfig.ts'


/**
 * Busca os insights de produto para clientes e produtos específicos.
 *
 * @param customerIds - Um array de strings contendo os IDs dos clientes
 * @param productIds - Um array de strings contendo os IDs dos produtos
 * @returns Uma promessa que resolve para a InsightApiResponse.
 */
export async function fetchProductInsights(
  customerIds: string[],
  productIds: string[]
): Promise<InsightApiResponse> {
  const url = `api/insights/data`;

  const customerIdParam = customerIds.join(',');
  const productIdParam = productIds.join(',');

  try {
    const response = await api.get<InsightApiResponse>(url, {
      params: {
        customerId: customerIdParam,
        productId: productIdParam
      }
    });

    return response.data;

  } catch (error) {
    console.error(`Erro ao buscar insights (Clientes: ${customerIdParam}, Produtos: ${productIdParam}):`, error);
    throw error;
  }
}
