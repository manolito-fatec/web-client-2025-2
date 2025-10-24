import type { Product } from '@/types/Product'
import type { Company } from '@/types/Company'
import type { ApiResponse } from '@/types/PaginatedInterfaces/ApiResponse'
import api from '@/api/axios/AxiosConfig.ts'

/**
 * Fetch all companies and products
 * @param pageSize - Number of itens per page.
 * @returns an object that has the arrays of all products and all companies.
 */
export async function fetchFilterOptions(pageSize: number = 10): Promise<{ allProducts: Product[], allCompanies: Company[] }> {
  const url = 'api/metrics';

  const allProducts: Product[] = [];
  const allCompanies: Company[] = [];

  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    try {
      const response = await api.get<ApiResponse>(url, {
        params: {
          page: currentPage,
          size: pageSize
        }
      });

      const { products, companies } = response.data;

      if (products.content.length > 0) {
        allProducts.push(...products.content);
      }
      if (companies.content.length > 0) {
        allCompanies.push(...companies.content);
      }

      if (products.last && companies.last) {
        hasMorePages = false;
      } else {
        currentPage++;
      }

    } catch (error) {
      hasMorePages = false;
      throw error;
    }
  }

  return { allProducts, allCompanies };
}
