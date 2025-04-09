export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface PageOcrResult {
  pageNumber: number;
  text: string;
  boxes?: {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
  }[];
}

export interface ConversionProgress {
  stage: 'extracting' | 'ocr' | 'creating' | 'complete';
  percent: number;
  page?: number;
  totalPages?: number;
  status?: string;
}