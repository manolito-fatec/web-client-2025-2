import type { InsightsDataDto, RootCauseAnalysisData, RawParetoItem } from "@/types/RootCauseAnalysisResponse";
import axios from "axios";

const BASE_URL = 'http://localhost:8080/api/insights/data';

const transformParetoListToMap = (data: RawParetoItem[]): RootCauseAnalysisData => {
  const groupedData: RootCauseAnalysisData = {};

  data.forEach(item => {
    const subCategory = item.subcategoryName;

    const clientCode = item.companyId.toString();

    const occurrences = item.totalTickets;

    if (!groupedData[subCategory]) {
      groupedData[subCategory] = {};
    }

    groupedData[subCategory][clientCode] = occurrences;
  });

  return groupedData;
};

export async function getRootCauseAnalysis(companyId: string | null)
  : Promise<RootCauseAnalysisData> {
  try {
    let clientParam = '';

    if (companyId && companyId !== 'ALL') {
      clientParam = `customerId=${companyId}`;
    }

    const url = clientParam ? `${BASE_URL}?${clientParam}` : BASE_URL;

    const response = await axios.get<InsightsDataDto>(url);

    const rawList = response.data?.paretoInsightData || [];

    return transformParetoListToMap(rawList);

  } catch (error) {
    console.error("Error fetching root cause analysis data", error);
    throw error;
  }
};
