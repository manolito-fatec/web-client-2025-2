import axios from '@/api/axios/AxiosConfig'
import type { PdfExportRequest, CsvExportParams } from '@/types/InsightType/ExportType'

const BASE_URL = 'http://localhost:8080/api/insights/export'
const AUDIT_URL = 'http://localhost:8080/user/audit/csv'

const downloadBlob = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export const exportCsv = async (customerId?: number) => {
  const params: CsvExportParams = {}
  if (customerId) {
    params.customerIds = customerId
  }

  try {
    const response = await axios.get(`${BASE_URL}/csv`, {
      params,
      responseType: 'blob'
    })
    
    const filename = `insights_export_${new Date().toISOString().split('T')[0]}.zip`
    
    downloadBlob(response.data, filename)
  } catch (error) {
    console.error('Erro ao exportar CSV/ZIP:', error)
    throw error
  }
}

export const exportPdf = async (requestBody: PdfExportRequest) => {
  try {
    const response = await axios.post(`${BASE_URL}/pdf`, requestBody, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const filename = `report_${new Date().toISOString().split('T')[0]}.pdf`
    downloadBlob(response.data, filename)
  } catch (error) {
    console.error('Erro ao exportar PDF:', error)
    throw error
  }
}

export const exportAuditCsv = async (userEmail:string, userRole:string) => {
  try{
      const response = await axios.get(
        `${AUDIT_URL}/${userEmail}/${userRole}`, 
        {
          responseType: 'blob'
        }
      )
      const filename = `audit_export_${new Date().toISOString().split('T')[0]}.zip`
      downloadBlob(response.data, filename) 
  } catch (error) {
    console.error('Erro ao exportar CSV/ZIP:', error)
    throw error
  }
}