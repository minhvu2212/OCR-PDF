export interface OcrOptions {
  language: string;
  quality: 'medium' | 'high';
}

export interface OcrProgress {
  page: number;
  totalPages: number;
  percent: number;
  status: string;
}

export interface OcrJob {
  imageUrl: string;
  lang: string;
  pageNumber: number;
}

export interface OcrMessage {
  type: 'initialize' | 'process' | 'terminate';
  numWorkers?: number;
  job?: OcrJob;
}

export interface OcrResult {
  pageNumber: number;
  text: string;
}
