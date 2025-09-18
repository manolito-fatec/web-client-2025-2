import type { ChartDate } from "@/components/types/ChartDateaResponse";
import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/metrics/chart';

export async function getChartDate(pProductId:String, pCustomerId:String, pFromDate:String, pToDate:String)
{
    try
    {
      const response = await axios.get<ChartDate>(BASE_URL+`?productId=${pProductId}&customerId=${pCustomerId}&fromDate=${pFromDate}&toDate=${pToDate}`)
      return response.data;
    }catch (error) {
      throw error;
    }
};