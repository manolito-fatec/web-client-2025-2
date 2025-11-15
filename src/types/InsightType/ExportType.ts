export interface PdfExportRequest {
  reportTitle: string;
  graphImagesBase64: string[];
  clientId?: number;
  startDate?: string;
  endDate?: string;
}

export interface CsvExportParams {
  customerIds?: number;
}