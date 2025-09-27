export interface Company {
  id: number;
  name: string;
  cnpj: string;
  segmento: string;
  createdAt: string;
}

export interface FilterCompany{
  name: string;
  code: string;
}
