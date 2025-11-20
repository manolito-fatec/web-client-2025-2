import api from '@/api/axios/AxiosConfig.ts'
import type { Term, TermByUser } from '@/types/ContractTypes/Term.ts'

const BASE_URL = 'http://localhost:8080/api/term/current';

export const getActualTerm = async (): Promise<Term> => {
  try{
    const response = await api.get(BASE_URL);
    return response.data;
  } catch(error){
    console.error(error);
    throw error;
  }
}

export const getActualTermByUser = async (userId: string): Promise<TermByUser> => {
  try{
    const response = await api.get('http://localhost:8080/api/term/user/' + userId);
    return response.data;
  } catch(error){
    console.error(error);
    throw error;
  }
}

export const updateTermByUser = async(termByUser: any) => {
  try{
    const response = await api.patch('http://localhost:8080/api/term', termByUser);
    return response.data;
  } catch(error){
    console.error(error);
    throw error;
  }
}

