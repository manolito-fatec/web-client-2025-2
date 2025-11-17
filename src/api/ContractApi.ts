import api from '@/api/axios/AxiosConfig.ts'
import type { Term } from '@/types/ContractTypes/Term.ts'

const BASE_URL = 'http://localhost:8080/api/term';

export const getActualTerm = async (): Promise<Term> => {
  try{
    const response = await api.get(BASE_URL);
    return response.data;
  } catch(error){
    console.error(error);
    throw error;
  }
}

