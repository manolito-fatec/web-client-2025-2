import type { ChartDate } from "@/types/ChartDateaResponse";
import type { FilterOptions } from "@/types/FilterOptions";
import api from '@/api/axios/AxiosConfig.ts'

const BASE_URL = 'http://localhost:8080/api/metrics/chart';

export async function getChartDate(request:FilterOptions)
{
  try
  {
    const response = await api.get<ChartDate>(BASE_URL+`?productId=${request.productId}&customerId=${request.companyId}&fromDate=${request.startDate}&toDate=${request.endDate}&periods=${request.periods}`)
    return response.data;
  }catch (error) {
    throw error;
  }
};
