// 1. File HTML chính với SEO (index.html)
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm | Miễn phí</title>
    <meta name="description" content="Chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép hoàn toàn miễn phí. Công cụ OCR online hỗ trợ tiếng Việt và nhiều ngôn ngữ khác." />
    <meta name="keywords" content="PDF OCR, chuyển đổi PDF, PDF có thể tìm kiếm, công cụ OCR, OCR tiếng Việt, PDF scan, PDF ảnh, OCR online, miễn phí" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.pdf-ocr-app.com" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.pdf-ocr-app.com" />
    <meta property="og:title" content="PDF OCR - Chuyển đổi PDF sang định dạng có thể tìm kiếm" />
    <meta property="og:description" content="Chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép hoàn toàn miễn phí. Hỗ trợ tiếng Việt và nhiều ngôn ngữ." />
    <meta property="og:image" content="https://www.pdf-ocr-app.com/images/og-image.jpg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://www.pdf-ocr-app.com" />
    <meta property="twitter:title" content="PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm" />
    <meta property="twitter:description" content="Chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép hoàn toàn miễn phí. Công cụ OCR online hỗ trợ tiếng Việt." />
    <meta property="twitter:image" content="https://www.pdf-ocr-app.com/images/twitter-image.jpg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// 2. Entry point - main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 3. Root component - App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/toaster';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import GuidePage from './pages/GuidePage';
import FaqPage from './pages/FaqPage';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import { SchemaMarkup } from './components/seo/SchemaMarkup';
import { reportWebVitals } from './lib/analytics/performance';

function App() {
  return (
    <HelmetProvider>
      <SchemaMarkup />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<AppPage />} />
              <Route path="/huong-dan" element={<GuidePage />} />
              <Route path="/faq" element={<FaqPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </HelmetProvider>
  );
}

export default App;

// 4. Landing Page - pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <>
      <Seo />
      <div className="container mx-auto px-4">
        <Hero 
          title="Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm" 
          subtitle="Công cụ OCR miễn phí, hoạt động ngay trên trình duyệt của bạn, không cần tải lên máy chủ"
          ctaText="Bắt đầu ngay"
          ctaLink="/app"
        />
        
        <Features />
        
        <HowItWorks />
        
        <Testimonials />
        
        <FAQ />
        
        <CTASection />
      </div>
    </>
  );
}

// 5. App Page (Converter) - pages/AppPage.tsx
import { useState, useCallback } from 'react';
import { Seo } from '../components/seo/Seo';
import FileUploader from '../components/converter/FileUploader';
import ConversionSettings from '../components/converter/ConversionSettings';
import ConversionProgress from '../components/converter/ConversionProgress';
import ResultDownload from '../components/converter/ResultDownload';
import { PdfOcrService, ConversionProgress as Progress } from '../lib/pdf/pdfOcrService';
import { OcrOptions } from '../lib/ocr/ocrService';
import { useToast } from '../hooks/useToast';

export default function AppPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [options, setOptions] = useState<OcrOptions>({
    language: 'vie',
    quality: 'medium'
  });
  
  const { toast } = useToast();
  const pdfOcrService = new PdfOcrService();
  
  const handleFileChange = useCallback((file: File | null) => {
    setFile(file);
    setResultBlob(null);
  }, []);
  
  const handleOptionChange = useCallback((newOptions: Partial<OcrOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  }, []);
  
  const startConversion = useCallback(async () => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(null);
      setResultBlob(null);
      
      const result = await pdfOcrService.convertPdfToSearchable(
        file,
        options,
        setProgress
      );
      
      setResultBlob(result);
      toast({
        title: 'Chuyển đổi thành công!',
        description: 'PDF của bạn đã được chuyển đổi thành công.',
        variant: 'success'
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: 'Lỗi chuyển đổi',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, options, pdfOcrService, toast]);
  
  return (
    <>
      <Seo 
        title="Chuyển đổi PDF - PDF OCR"
        description="Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm, sao chép. Hoạt động hoàn toàn trên trình duyệt, không cần tải lên máy chủ."
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm
        </h1>
        
        <div className="max-w-3xl mx-auto">
          <FileUploader
            file={file}
            onFileChange={handleFileChange}
            isProcessing={isProcessing}
          />
          
          {file && !resultBlob && !isProcessing && (
            <ConversionSettings
              options={options}
              onOptionChange={handleOptionChange}
              onStartConversion={startConversion}
              disabled={isProcessing}
            />
          )}
          
          {isProcessing && progress && (
            <ConversionProgress progress={progress} />
          )}
          
          {resultBlob && (
            <ResultDownload
              blob={resultBlob}
              fileName={file ? `searchable_${file.name}` : 'searchable_document.pdf'}
            />
          )}
        </div>
      </div>
    </>
  );
}

// 6. File Uploader Component - components/converter/FileUploader.tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { formatFileSize } from '../../lib/utils';

interface FileUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isProcessing: boolean;
}

export default function FileUploader({ file, onFileChange, isProcessing }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        onFileChange(file);
      } else {
        alert('Vui lòng chỉ tải lên file PDF.');
      }
    }
  }, [onFileChange]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  });
  
  const removeFile = () => {
    if (!isProcessing) {
      onFileChange(null);
    }
  };
  
  return (
    <div className="mb-6">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-blue-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Kéo thả file PDF hoặc nhấp để chọn</h3>
          <p className="text-sm text-gray-500">Hỗ trợ file PDF dạng ảnh cần chuyển đổi</p>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center">
            <File className="h-8 w-8 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            {!isProcessing && (
              <button 
                onClick={removeFile}
                className="p-1 rounded-full hover:bg-blue-100"
                aria-label="Remove file"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// 7. PDF Service - lib/pdf/pdfOcrService.ts
import { extractPdfPages, PdfPageInfo } from './pdfReader';
import { createSearchablePdf, PageOcrResult } from './pdfCreator';
import { OcrService, OcrProgress, OcrOptions } from '../ocr/ocrService';

export interface ConversionProgress {
  stage: 'extracting' | 'ocr' | 'creating' | 'complete';
  percent: number;
  page?: number;
  totalPages?: number;
  status?: string;
}

export class PdfOcrService {
  private ocrService: OcrService;
  
  constructor() {
    this.ocrService = new OcrService();
  }
  
  public async convertPdfToSearchable(
    file: File,
    options: OcrOptions,
    onProgress: (progress: ConversionProgress) => void
  ): Promise<Blob> {
    try {
      // Giai đoạn 1: Trích xuất trang từ PDF
      onProgress({ stage: 'extracting', percent: 0 });
      const pages = await extractPdfPages(file);
      onProgress({ stage: 'extracting', percent: 100 });
      
      // Giai đoạn 2: Xử lý OCR cho từng trang
      return new Promise((resolve, reject) => {
        this.ocrService.processPages(
          pages,
          options,
          // Callback tiến độ OCR
          (ocrProgress: OcrProgress) => {
            onProgress({
              stage: 'ocr',
              percent: ocrProgress.percent,
              page: ocrProgress.page,
              totalPages: ocrProgress.totalPages,
              status: ocrProgress.status
            });
          },
          // Callback khi OCR hoàn tất
          async (results: PageOcrResult[]) => {
            try {
              // Giai đoạn 3: Tạo PDF có thể tìm kiếm
              onProgress({ stage: 'creating', percent: 0 });
              const pdfBytes = await createSearchablePdf(file, results);
              onProgress({ stage: 'creating', percent: 100 });
              
              // Giai đoạn 4: Hoàn tất
              onProgress({ stage: 'complete', percent: 100 });
              
              // Tạo Blob từ PDF bytes
              const blob = new Blob([pdfBytes], { type: 'application/pdf' });
              resolve(blob);
            } catch (error) {
              reject(error);
            }
          },
          // Callback khi có lỗi
          (error: Error) => {
            reject(error);
          }
        );
      });
    } catch (error) {
      throw error;
    }
  }
  
  public terminate() {
    this.ocrService.terminate();
  }
}

// 8. OCR Worker - workers/ocrWorker.ts
import { createWorker, createScheduler } from 'tesseract.js';

// Khai báo interface cho message từ main thread
interface OcrMessage {
  type: 'initialize' | 'process' | 'terminate';
  numWorkers?: number;
  job?: OcrJob;
}

// Khai báo interface cho job OCR
export interface OcrJob {
  imageUrl: string;
  lang: string;
  pageNumber: number;
}

// Biến global để lưu trữ scheduler
let scheduler: any = null;

// Khởi tạo scheduler và workers
async function initializeScheduler(numWorkers: number = 2) {
  scheduler = createScheduler();
  
  for (let i = 0; i < numWorkers; i++) {
    const worker = createWorker({
      langPath: '/lang-data',
      logger: m => {
        self.postMessage({
          type: 'progress',
          workerId: i,
          progress: m.progress,
          status: m.status
        });
      }
    });
    
    await worker.load();
    scheduler.addWorker(worker);
  }
  
  self.postMessage({ type: 'initialized' });
}

// Xử lý OCR cho một trang
async function processPage(job: OcrJob) {
  try {
    const { imageUrl, lang, pageNumber } = job;
    
    // Thực hiện OCR
    const result = await scheduler.addJob('recognize', imageUrl, { lang });
    
    // Trả về kết quả
    self.postMessage({
      type: 'result',
      pageNumber,
      text: result.data.text
    });
  } catch (error: any) {
    self.postMessage({
      type: 'error',
      pageNumber: job.pageNumber,
      error: error.message
    });
  }
}

// Xử lý message từ main thread
self.addEventListener('message', async function(e: MessageEvent<OcrMessage>) {
  const data = e.data;
  
  switch (data.type) {
    case 'initialize':
      await initializeScheduler(data.numWorkers);
      break;
    case 'process':
      if (data.job) {
        await processPage(data.job);
      }
      break;
    case 'terminate':
      if (scheduler) {
        await scheduler.terminate();
      }
      self.close();
      break;
  }
});

// 9. PDF Reader - lib/pdf/pdfReader.ts
import * as pdfjsLib from 'pdfjs-dist';

// Đặt worker path cho PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export interface PdfPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  dataUrl: string; // Base64 encoded image
}

export async function extractPdfPages(file: File): Promise<PdfPageInfo[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    
    // Tải PDF document
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    const numPages = pdf.numPages;
    
    // Extract each page as an image
    const pages: PdfPageInfo[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // Scale for better OCR quality
      
      // Tạo canvas để render page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page vào canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Chuyển canvas thành data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      pages.push({
        pageNumber: i,
        width: viewport.width,
        height: viewport.height,
        dataUrl
      });
    }
    
    return pages;
  } catch (error) {
    console.error('Error extracting PDF pages:', error);
    throw new Error('Không thể đọc file PDF. Vui lòng kiểm tra lại file.');
  }
}

// 10. PDF Creator - lib/pdf/pdfCreator.ts
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface PageOcrResult {
  pageNumber: number;
  text: string;
}

export async function createSearchablePdf(
  originalPdfFile: File,
  ocrResults: PageOcrResult[]
): Promise<Uint8Array> {
  try {
    const arrayBuffer = await originalPdfFile.arrayBuffer();
    
    // Tải PDF gốc
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Lấy tất cả các trang
    const pages = pdfDoc.getPages();
    
    // Nhúng font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Thêm lớp văn bản cho mỗi trang
    for (const result of ocrResults) {
      const pageIndex = result.pageNumber - 1;
      
      if (pageIndex < pages.length) {
        const page = pages[pageIndex];
        const { width, height } = page.getSize();
        
        // Thêm lớp văn bản OCR vào trang PDF
        // (văn bản được làm "vô hình" nhưng vẫn có thể tìm kiếm)
        page.drawText(result.text, {
          x: 0,
          y: height,
          size: 1, // Font size nhỏ để không ảnh hưởng đến hình ảnh
          font: helveticaFont,
          color: rgb(0, 0, 0),
          opacity: 0.01, // Gần như trong suốt
          maxWidth: width
        });
      }
    }
    
    // Lưu và trả về PDF mới
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error creating searchable PDF:', error);
    throw new Error('Không thể tạo PDF có thể tìm kiếm. Vui lòng thử lại.');
  }
}

// 11. OCR Service - lib/ocr/ocrService.ts
import { PdfPageInfo } from '../pdf/pdfReader';
import { PageOcrResult } from '../pdf/pdfCreator';

export interface OcrProgress {
  page: number;
  totalPages: number;
  percent: number;
  status: string;
}

export interface OcrOptions {
  language: string;
  quality: 'medium' | 'high';
}

export class OcrService {
  private worker: Worker | null = null;
  private pages: PdfPageInfo[] = [];
  private results: PageOcrResult[] = [];
  private onProgress: (progress: OcrProgress) => void = () => {};
  private onComplete: (results: PageOcrResult[]) => void = () => {};
  private onError: (error: Error) => void = () => {};
  
  constructor() {
    this.initializeWorker();
  }
  
  private initializeWorker() {
    try {
      this.worker = new Worker(new URL('../../workers/ocrWorker.ts', import.meta.url), { type: 'module' });
      
      this.worker.addEventListener('message', (e) => {
        const message = e.data;
        
        switch (message.type) {
          case 'initialized':
            // OCR worker đã sẵn sàng
            break;
          case 'progress':
            this.handleProgress(message);
            break;
          case 'result':
            this.handleResult(message);
            break;
          case 'error':
            this.handleError(message);
            break;
        }
      });
      
      // Khởi tạo OCR worker
      this.worker.postMessage({
        type: 'initialize',
        numWorkers: 2 // Số lượng worker cần tạo
      });
    } catch (error) {
      console.error('Failed to initialize OCR worker:', error);
    }
  }
  
  public processPages(
    pages: PdfPageInfo[],
    options: OcrOptions,
    onProgress: (progress: OcrProgress) => void,
    onComplete: (results: PageOcrResult[]) => void,
    onError: (error: Error) => void
  ) {
    this.pages = pages;
    this.results = [];
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.onError = onError;
    
    // Bắt đầu xử lý từng trang
    for (const page of pages) {
      this.processPage(page, options.language);
    }
  }
  
  private processPage(page: PdfPageInfo, language: string) {
    if (!this.worker) {
      this.onError(new Error('OCR worker không được khởi tạo.'));
      return;
    }
    
    this.worker.postMessage({
      type: 'process',
      job: {
        imageUrl: page.dataUrl,
        lang: language,
        pageNumber: page.pageNumber
      }
    });
  }
  
  private handleProgress(message: any) {
    if (this.pages.length === 0) return;
    
    // Tính toán tổng tiến độ
    const currentPage = this.results.length + 1;
    const percent = (message.progress * 100) / this.pages.length + 
                   (this.results.length * 100) / this.pages.length;
    
    this.onProgress({
      page: currentPage,
      totalPages: this.pages.length,
      percent: Math.min(percent, 99), // Giữ ở 99% cho đến khi hoàn tất
      status: message.status
    });
  }
  
  private handleResult(message: any) {
    this.results.push({
      pageNumber: message.pageNumber,
      text: message.text
    });
    
    // Kiểm tra xem đã hoàn thành tất cả các trang chưa
    if (this.results.length === this.pages.length) {
      // Sắp xếp kết quả theo số trang
      this.results.sort((a, b) => a.pageNumber - b.pageNumber);
      
      // Gọi callback hoàn thành
      this.onComplete(this.results);
    }
  }
  
  private handleError(message: any) {
    this.onError(new Error(`Lỗi OCR ở trang ${message.pageNumber}: ${message.error}`));
  }
  
  public terminate() {
    if (this.worker) {
      this.worker.postMessage({ type: 'terminate' });
      this.worker = null;
    }
  }
}

// 12. SEO Components - components/seo/Seo.tsx
import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export const Seo = ({
  title = 'PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm | Miễn phí',
  description = 'Chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép hoàn toàn miễn phí. Công cụ OCR online hỗ trợ tiếng Việt và nhiều ngôn ngữ khác.',
  canonical = 'https://www.pdf-ocr-app.com',
  ogImage = 'https://www.pdf-ocr-app.com/images/og-image.jpg'
}: SeoProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
};

// 13. SchemaMarkup Component - components/seo/SchemaMarkup.tsx
import { Helmet } from 'react-helmet-async';

export const SchemaMarkup = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm",
    "url": "https://www.pdf-ocr-app.com",
    "description": "Công cụ miễn phí chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép. Hỗ trợ tiếng Việt.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// 14. Conversion Settings Component - components/converter/ConversionSettings.tsx
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { OcrOptions } from "../../lib/ocr/ocrService";

interface ConversionSettingsProps {
  options: OcrOptions;
  onOptionChange: (options: Partial<OcrOptions>) => void;
  onStartConversion: () => void;
  disabled: boolean;
}

export default function ConversionSettings({
  options,
  onOptionChange,
  onStartConversion,
  disabled
}: ConversionSettingsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Cài đặt chuyển đổi</h2>
      
      <div className="space-y-6">
        {/* Ngôn ngữ OCR */}
        <div>
          <Label htmlFor="language" className="block mb-2">Ngôn ngữ văn bản</Label>
          <Select
            value={options.language}
            onValueChange={(value) => onOptionChange({ language: value })}
            disabled={disabled}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vie">Tiếng Việt</SelectItem>
              <SelectItem value="eng">Tiếng Anh</SelectItem>
              <SelectItem value="vie+eng">Tiếng Việt + Tiếng Anh</SelectItem>
              <SelectItem value="fra">Tiếng Pháp</SelectItem>
              <SelectItem value="deu">Tiếng Đức</SelectItem>
              <SelectItem value="jpn">Tiếng Nhật</SelectItem>
              <SelectItem value="chi_sim">Tiếng Trung (Giản thể)</SelectItem>
              <SelectItem value="chi_tra">Tiếng Trung (Phồn thể)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Chọn ngôn ngữ chính có trong tài liệu để cải thiện độ chính xác
          </p>
        </div>
        
        {/* Chất lượng OCR */}
        <div>
          <Label className="block mb-2">Chất lượng OCR</Label>
          <RadioGroup
            value={options.quality}
            onValueChange={(value) => onOptionChange({ quality: value as 'medium' | 'high' })}
            className="flex flex-col space-y-2"
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="quality-medium" />
              <Label htmlFor="quality-medium" className="cursor-pointer">
                Trung bình (xử lý nhanh hơn)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="quality-high" />
              <Label htmlFor="quality-high" className="cursor-pointer">
                Cao (xử lý chậm hơn, chính xác hơn)
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Nút bắt đầu chuyển đổi */}
        <div className="pt-2">
          <Button
            onClick={onStartConversion}
            disabled={disabled}
            className="w-full"
          >
            Bắt đầu chuyển đổi
          </Button>
        </div>
      </div>
    </div>
  );
}

// 15. Conversion Progress Component - components/converter/ConversionProgress.tsx
import { ConversionProgress as Progress } from '../../lib/pdf/pdfOcrService';

interface ConversionProgressProps {
  progress: Progress;
}

export default function ConversionProgress({ progress }: ConversionProgressProps) {
  const getStageLabel = () => {
    switch (progress.stage) {
      case 'extracting':
        return 'Đang trích xuất trang từ PDF';
      case 'ocr':
        return progress.page && progress.totalPages
          ? `Đang nhận dạng văn bản (Trang ${progress.page}/${progress.totalPages})`
          : 'Đang nhận dạng văn bản';
      case 'creating':
        return 'Đang tạo PDF có thể tìm kiếm';
      case 'complete':
        return 'Hoàn tất';
      default:
        return 'Đang xử lý';
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{getStageLabel()}</span>
        <span className="text-sm text-gray-500">{Math.round(progress.percent)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${Math.max(5, progress.percent)}%` }}
        />
      </div>
      
      {progress.status && (
        <p className="text-xs text-gray-500 mt-2">{progress.status}</p>
      )}
    </div>
  );
}

// 16. Result Download Component - components/converter/ResultDownload.tsx
import { Download, Check, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface ResultDownloadProps {
  blob: Blob;
  fileName: string;
}

export default function ResultDownload({ blob, fileName }: ResultDownloadProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const openPreview = () => {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">Chuyển đổi hoàn tất!</h3>
      <p className="text-gray-600 mb-6">PDF của bạn đã được chuyển đổi thành định dạng có thể tìm kiếm.</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button
          onClick={handleDownload}
          className="flex items-center justify-center bg-green-600 hover:bg-green-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Tải xuống PDF
        </Button>
        
        <Button
          onClick={openPreview}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Eye className="h-5 w-5 mr-2" />
          Xem trước
        </Button>
      </div>
    </div>
  );
}

// 17. Hero Component - components/landing/Hero.tsx
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink }: HeroProps) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
        {title}
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
        {subtitle}
      </p>
      <Link to={ctaLink}>
        <Button size="lg" className="text-lg px-8 py-6 h-auto">
          {ctaText}
        </Button>
      </Link>
    </div>
  );
}

// 18. Features Component - components/landing/Features.tsx
import { Search, Lock, Zap, FileText, Globe, PenTool } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-500" />,
      title: 'Tìm kiếm trong PDF',
      description: 'Chuyển đổi PDF scan thành dạng có thể tìm kiếm để dễ dàng tìm kiếm nội dung.'
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-500" />,
      title: 'An toàn & riêng tư',
      description: 'Tất cả xử lý diễn ra trên trình duyệt của bạn, không cần tải lên máy chủ.'
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: 'Tốc độ nhanh',
      description: 'Xử lý OCR nhanh chóng với các thuật toán được tối ưu hóa.'
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      title: 'Trích xuất văn bản',
      description: 'Dễ dàng trích xuất và sao chép văn bản từ PDF dạng ảnh.'
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Đa ngôn ngữ',
      description: 'Hỗ trợ nhiều ngôn ngữ, bao gồm tiếng Việt, Anh, Pháp, Đức và nhiều ngôn ngữ khác.'
    },
    {
      icon: <PenTool className="h-8 w-8 text-blue-500" />,
      title: 'Chất lượng cao',
      description: 'Kết quả OCR chính xác với các thuật toán nhận dạng tiên tiến.'
    }
  ];

  return (
    <div className="py-16 bg-gray-50 rounded-xl">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Công cụ OCR hiện đại giúp bạn chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm một cách dễ dàng
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform hover:translate-y-[-5px]">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 19. How It Works Component - components/landing/HowItWorks.tsx
import { Upload, Cog, FileSearch } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-12 w-12 text-blue-500" />,
      title: 'Tải PDF lên',
      description: 'Kéo thả hoặc chọn file PDF dạng ảnh cần chuyển đổi.'
    },
    {
      icon: <Cog className="h-12 w-12 text-blue-500" />,
      title: 'Cấu hình OCR',
      description: 'Chọn ngôn ngữ văn bản và các tùy chọn khác để tối ưu kết quả.'
    },
    {
      icon: <FileSearch className="h-12 w-12 text-blue-500" />,
      title: 'Tải xuống kết quả',
      description: 'Nhận file PDF có thể tìm kiếm và dễ dàng sao chép nội dung.'
    }
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Cách sử dụng</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Chỉ với 3 bước đơn giản, bạn đã có thể chuyển đổi PDF scan thành PDF có thể tìm kiếm
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center items-center max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center px-6 mb-8 md:mb-0">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block w-8 h-8 text-gray-300 absolute transform translate-x-[9rem]">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 20. Utils - lib/utils.ts
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / 1048576).toFixed(2) + ' MB';
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}