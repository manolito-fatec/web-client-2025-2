import axios from 'axios';
import type { Product } from '@/components/types/Product.ts'
import type { Company } from '@/components/types/Company.ts'
import type { ApiResponse } from '@/components/types/PaginatedInterfaces/ApiResponse.ts'

const BASE_URL = 'http://localhost:8080/';


/**
 * Busca TODOS os produtos e empresas de uma API paginada,
 * fazendo chamadas sequenciais até a última página.
 * @param pageSize - O número de itens a buscar por chamada (página).
 * @returns Um objeto contendo duas listas: uma com todos os produtos e outra com todas as empresas.
 */
export async function fetchFilterOptions(pageSize: number = 10): Promise<{ allProducts: Product[], allCompanies: Company[] }> {
  const url = BASE_URL + 'filters';

  const allProducts: Product[] = [];
  const allCompanies: Company[] = [];

  let currentPage = 1;
  let hasMorePages = true;

  console.log(`Iniciando busca de todos os dados com ${pageSize} itens por página.`);

  while (hasMorePages) {
    try {
      console.log(`Buscando página: ${currentPage}...`);
      const response = await axios.get<ApiResponse>(url, {
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
        console.log("Busca finalizada. Última página atingida.");
      } else {
        currentPage++;
      }

    } catch (error) {
      console.error(`Erro ao buscar a página ${currentPage}:`, error);
      hasMorePages = false;
      throw error;
    }
  }

  return { allProducts, allCompanies };
}
