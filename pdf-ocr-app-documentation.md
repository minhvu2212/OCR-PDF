# Tài liệu chi tiết: Ứng dụng chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Kiến trúc ứng dụng](#kiến-trúc-ứng-dụng)
4. [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
5. [Chi tiết triển khai](#chi-tiết-triển-khai)
   - [Cấu trúc dự án](#cấu-trúc-dự-án)
   - [Landing Page & SEO](#landing-page--seo)
   - [Xử lý PDF](#xử-lý-pdf)
   - [OCR Engine](#ocr-engine)
   - [Tạo PDF có thể tìm kiếm](#tạo-pdf-có-thể-tìm-kiếm)
6. [Tối ưu hiệu suất](#tối-ưu-hiệu-suất)
7. [Các tính năng nâng cao](#các-tính-năng-nâng-cao)
8. [FAQ dành cho nhà phát triển](#faq-dành-cho-nhà-phát-triển)
9. [Phụ lục: Mã nguồn](#phụ-lục-mã-nguồn)

## Tổng quan

Ứng dụng "PDF OCR" là công cụ chuyển đổi PDF dạng ảnh (scanned PDF) sang PDF có thể tìm kiếm được, hoạt động hoàn toàn ở phía client (trình duyệt người dùng). Ứng dụng sử dụng công nghệ OCR (Optical Character Recognition) để nhận dạng văn bản từ hình ảnh và nhúng lớp văn bản vào tài liệu gốc, cho phép người dùng tìm kiếm, sao chép, và chỉnh sửa nội dung PDF mà không cần kết nối đến bất kỳ máy chủ nào.

### Ưu điểm chính:

- **Bảo mật**: Toàn bộ xử lý diễn ra trên trình duyệt, không có dữ liệu nào được gửi lên máy chủ
- **Đa nền tảng**: Hoạt động trên mọi thiết bị có trình duyệt web hiện đại
- **Miễn phí**: Không có chi phí cho người dùng cuối
- **Đa ngôn ngữ**: Hỗ trợ nhiều ngôn ngữ khác nhau, đặc biệt là tiếng Việt
- **Tìm kiếm SEO**: Được tối ưu để dễ dàng tìm kiếm trên các công cụ tìm kiếm

## Công nghệ sử dụng

- **Framework**: Vite + React + TypeScript
- **UI Component**: Tailwind CSS + Shadcn/UI
- **PDF Processing**: 
  - PDF.js (Đọc và hiển thị PDF)
  - pdf-lib (Tạo và chỉnh sửa PDF)
- **OCR Engine**: Tesseract.js (phiên bản WASM chạy trên trình duyệt)
- **State Management**: React Context API + Hooks
- **Routing**: React Router
- **Web Workers**: Xử lý OCR trong một luồng riêng biệt
- **Testing**: Vitest, React Testing Library
- **SEO Tools**: React Helmet, Schema.org markup
- **Analytics**: Google Analytics (tùy chọn)

## Kiến trúc ứng dụng

Ứng dụng được thiết kế theo mô hình kiến trúc lớp với các thành phần sau:

1. **UI Layer**: Giao diện người dùng, form nhập liệu, hiển thị kết quả
2. **Processing Layer**: Xử lý PDF, OCR, tạo PDF mới
3. **Worker Layer**: Web Workers cho các tác vụ nặng
4. **Utility Layer**: Các hàm tiện ích, helpers

Luồng xử lý chính:
```
PDF Upload → Extract Images → OCR Processing → Create Searchable PDF → Download
```

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

- Node.js (v18+)
- npm hoặc yarn

### Các bước cài đặt

1. Clone dự án từ GitHub:
```bash
git clone https://github.com/your-username/pdf-ocr-app.git
cd pdf-ocr-app
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Chạy môi trường phát triển:
```bash
npm run dev
# hoặc
yarn dev
```

4. Build sản phẩm:
```bash
npm run build
# hoặc
yarn build
```

## Chi tiết triển khai

### Cấu trúc dự án

```
pdf-ocr-app/
├── public/
│   ├── tesseract-core/     # WASM files cho Tesseract
│   ├── lang-data/          # Dữ liệu ngôn ngữ cho OCR
│   ├── favicon.ico
│   └── robots.txt          # SEO
├── src/
│   ├── assets/             # Hình ảnh, icons
│   ├── components/         # React components
│   │   ├── landing/        # Components cho landing page
│   │   ├── converter/      # Components cho công cụ chuyển đổi
│   │   ├── ui/             # Shadcn/UI components
│   │   └── shared/         # Các components dùng chung
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Thư viện và utilities
│   │   ├── ocr/            # OCR processing
│   │   ├── pdf/            # PDF processing
│   │   └── seo/            # SEO utilities
│   ├── workers/            # Web Workers
│   ├── pages/              # Các trang chính
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Component chính
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite type definitions
├── .gitignore
├── index.html              # HTML entry point với SEO tags
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Landing Page & SEO

Landing page được thiết kế để tối ưu SEO với các thành phần:

1. **HTML Meta Tags**:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
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
  <meta property="og:image" content="https://www.pdf-ocr-app.com/og-image.jpg" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://www.pdf-ocr-app.com" />
  <meta property="twitter:title" content="PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm" />
  <meta property="twitter:description" content="Chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép hoàn toàn miễn phí. Công cụ OCR online hỗ trợ tiếng Việt." />
  <meta property="twitter:image" content="https://www.pdf-ocr-app.com/twitter-image.jpg" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

2. **Schema.org Markup**:

Sử dụng React Helmet để thêm Schema.org markup:

```tsx
// src/components/seo/SchemaMarkup.tsx
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
```

3. **SEO Component**:

```tsx
// src/components/seo/Seo.tsx
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
  ogImage = 'https://www.pdf-ocr-app.com/og-image.jpg'
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
```

4. **Sitemap.xml và robots.txt**:

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.pdf-ocr-app.com/</loc>
    <lastmod>2025-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.pdf-ocr-app.com/app</loc>
    <lastmod>2025-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.pdf-ocr-app.com/huong-dan</loc>
    <lastmod>2025-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.pdf-ocr-app.com/faq</loc>
    <lastmod>2025-04-09</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://www.pdf-ocr-app.com/sitemap.xml
```

5. **Content SEO**:

Landing page được thiết kế với nội dung phong phú về từ khóa liên quan đến OCR, PDF, tìm kiếm, v.v. Sử dụng các heading tags (h1, h2, h3) hợp lý và alt text cho hình ảnh.

### Xử lý PDF

1. **Đọc PDF**:

```tsx
// src/lib/pdf/pdfReader.ts
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
```

2. **Tạo PDF có thể tìm kiếm**:

```tsx
// src/lib/pdf/pdfCreator.ts
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
```

### OCR Engine

1. **OCR Worker**:

```tsx
// src/workers/ocrWorker.ts
import { createWorker, createScheduler } from 'tesseract.js';

export interface OcrJob {
  imageUrl: string;
  lang: string;
  pageNumber: number;
}

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
  } catch (error) {
    self.postMessage({
      type: 'error',
      pageNumber: job.pageNumber,
      error: error.message
    });
  }
}

// Xử lý message từ main thread
self.addEventListener('message', async function(e) {
  const data = e.data;
  
  switch (data.type) {
    case 'initialize':
      await initializeScheduler(data.numWorkers);
      break;
    case 'process':
      await processPage(data.job);
      break;
    case 'terminate':
      if (scheduler) {
        await scheduler.terminate();
      }
      self.close();
      break;
  }
});
```

2. **OCR Service**:

```tsx
// src/lib/ocr/ocrService.ts
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
```

### Tạo PDF có thể tìm kiếm

Lớp service tổng hợp xử lý OCR và tạo PDF:

```tsx
// src/lib/pdf/pdfOcrService.ts
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
```

## Tối ưu hiệu suất

1. **Web Workers**:
   - Sử dụng Web Workers để chạy OCR trong một luồng riêng, tránh block UI thread
   - Phân chia công việc thành các đơn vị nhỏ để tránh treo trình duyệt

2. **Xử lý từng phần**:
   - Xử lý PDF từng trang một để giảm tải cho bộ nhớ
   - Streaming kết quả khi sẵn sàng thay vì đợi toàn bộ quá trình hoàn tất

3. **Tối ưu hóa dữ liệu OCR**:
   - Tải trước các model ngôn ngữ phổ biến
   - Sử dụng cache để tránh tải lại các model ngôn ngữ và thư viện

4. **Nén và tối ưu hóa**:
   - Nén các thư viện WASM để giảm thời gian tải
   - Lazy loading các components không cần thiết ngay lập tức

## Các tính năng nâng cao

1. **Mở rộng hỗ trợ ngôn ngữ**:
   - Hỗ trợ tự động phát hiện ngôn ngữ
   - Chức năng nhận dạng nhiều ngôn ngữ trong cùng một tài liệu
   - Tùy chỉnh bộ từ điển riêng cho các thuật ngữ chuyên ngành

2. **Cải thiện chất lượng OCR**:
   - Tiền xử lý hình ảnh (tăng độ tương phản, loại bỏ nhiễu, điều chỉnh độ nghiêng)
   - Tự động phát hiện và xoay trang có hướng không chính xác
   - Nhận dạng bảng và duy trì cấu trúc bảng trong kết quả

3. **Xử lý batch**:
   - Cho phép người dùng tải lên nhiều file PDF cùng lúc
   - Hàng đợi xử lý tự động với hiển thị tiến độ
   - Tải xuống kết quả dưới dạng file zip nếu có nhiều file

4. **Giao diện nâng cao**:
   - Xem trước và chỉnh sửa kết quả OCR trước khi tạo PDF cuối cùng
   - Chế độ so sánh trước/sau để kiểm tra kết quả
   - Tùy chọn lưu và khôi phục phiên làm việc

5. **Công cụ xuất/nhập**:
   - Xuất văn bản đã trích xuất sang các định dạng như TXT, DOCX
   - Chức năng chuyển đổi ngược (từ PDF có thể tìm kiếm sang văn bản thuần túy)
   - Tích hợp với các dịch vụ lưu trữ đám mây như Google Drive, Dropbox

## FAQ dành cho nhà phát triển

### 1. Làm thế nào để thêm ngôn ngữ mới cho OCR?

Tesseract.js hỗ trợ nhiều ngôn ngữ khác nhau thông qua các file dữ liệu ngôn ngữ (traineddata). Để thêm ngôn ngữ mới:

1. Tải file traineddata từ [Tesseract OCR GitHub repo](https://github.com/tesseract-ocr/tessdata)
2. Đặt file vào thư mục `/public/lang-data/`
3. Thêm ngôn ngữ vào danh sách lựa chọn trong giao diện người dùng
4. Cập nhật file cấu hình để bao gồm ngôn ngữ mới

```tsx
// src/config/languages.ts
export const languages = [
  { code: 'vie', name: 'Tiếng Việt' },
  { code: 'eng', name: 'Tiếng Anh' },
  { code: 'fra', name: 'Tiếng Pháp' },
  // Thêm ngôn ngữ mới ở đây
  { code: 'your_lang_code', name: 'Tên ngôn ngữ' }
];
```

### 2. Làm thế nào để tối ưu hiệu suất OCR?

1. **Tiền xử lý hình ảnh**:
   ```tsx
   // Thêm vào src/lib/ocr/imageProcessor.ts
   import Jimp from 'jimp';

   export async function preprocessImage(imageUrl: string): Promise<string> {
     // Tải hình ảnh từ data URL
     const image = await Jimp.read(Buffer.from(imageUrl.split(',')[1], 'base64'));
     
     // Áp dụng các bước tiền xử lý
     image
       .greyscale() // Chuyển sang thang độ xám
       .contrast(0.2) // Tăng độ tương phản
       .normalize(); // Chuẩn hóa độ sáng
     
     // Trả về data URL mới
     const processed = await image.getBase64Async(Jimp.MIME_PNG);
     return processed;
   }
   ```

2. **Cân nhắc sử dụng Web Assembly trực tiếp** thay vì thông qua Tesseract.js để có hiệu suất tốt hơn.

3. **Phân chia trang thành các khu vực nhỏ hơn** để xử lý song song.

### 3. Làm thế nào để xử lý file PDF lớn?

Đối với file PDF lớn (>50MB hoặc >100 trang), nên áp dụng chiến lược sau:

1. **Chunking**: Chia nhỏ PDF thành các nhóm trang (ví dụ: mỗi 10 trang)
2. **Xử lý tuần tự**: Xử lý từng nhóm một để tránh sử dụng quá nhiều bộ nhớ
3. **Lưu trữ kết quả tạm thời**: Sử dụng IndexedDB để lưu trữ kết quả OCR trung gian

```tsx
// Xử lý PDF lớn theo các nhóm trang
async function processLargePdf(file: File, chunkSize: number = 10) {
  const totalPages = await getTotalPdfPages(file);
  const chunks = Math.ceil(totalPages / chunkSize);
  
  for (let i = 0; i < chunks; i++) {
    const startPage = i * chunkSize + 1;
    const endPage = Math.min((i + 1) * chunkSize, totalPages);
    
    // Trích xuất và xử lý nhóm trang này
    const pagesChunk = await extractPdfPagesRange(file, startPage, endPage);
    const results = await processOcrForPages(pagesChunk);
    
    // Lưu kết quả tạm thời
    await saveIntermediateResults(i, results);
  }
  
  // Kết hợp tất cả kết quả
  const allResults = await combineIntermediateResults(chunks);
  return createFinalPdf(file, allResults);
}
```

### 4. Làm cách nào để triển khai ứng dụng để người dùng có thể cài đặt dưới dạng PWA?

Để biến ứng dụng này thành Progressive Web App (PWA):

1. **Tạo Web App Manifest**:
```json
// public/manifest.json
{
  "name": "PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm",
  "short_name": "PDF OCR",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3498db",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

2. **Cài đặt Service Worker** để hỗ trợ offline:
```tsx
// Trong vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm',
        short_name: 'PDF OCR',
        description: 'Công cụ miễn phí chuyển đổi PDF dạng ảnh thành PDF có thể tìm kiếm',
        theme_color: '#3498db',
        icons: [
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['pdf-lib', 'tesseract.js', 'pdfjs-dist'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tesseract: ['tesseract.js'],
          pdfjs: ['pdfjs-dist'],
          pdflib: ['pdf-lib'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### 5. Làm thế nào để đo lường và theo dõi hiệu suất của ứng dụng?

Triển khai các kỹ thuật theo dõi hiệu suất:

1. **Sử dụng Web Vitals**:
```tsx
// src/lib/analytics/performance.ts
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry); // Cumulative Layout Shift
    getFID(onPerfEntry); // First Input Delay
    getLCP(onPerfEntry); // Largest Contentful Paint
    getFCP(onPerfEntry); // First Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
}
```

2. **Theo dõi thời gian xử lý của từng giai đoạn**:
```tsx
// Trong hàm xử lý OCR
const startTime = performance.now();
// ... xử lý OCR
const endTime = performance.now();
console.log(`OCR processing took ${endTime - startTime}ms`);
```

## Phụ lục: Mã nguồn

### 1. Component App chính

```tsx
// src/App.tsx
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

// Đo lường hiệu suất
reportWebVitals(console.log);
```

### 2. Landing Page Component

```tsx
// src/pages/LandingPage.tsx
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
```

### 3. App Page Component

```tsx
// src/pages/AppPage.tsx
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
```

### 4. Các thành phần chuyển đổi chính

```tsx
// src/components/converter/FileUploader.tsx
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
```

```tsx
// src/components/converter/ConversionProgress.tsx
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
        return `Đang nhận dạng văn bản (Trang ${progress.page}/${progress.totalPages})`;
      case 'creating':
        return 'Đang tạo PDF có thể tìm kiếm';
      case 'complete':
        return 'Hoàn tất';
      default:
        return 'Đang xử lý';
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{getStageLabel()}</span>
        <span className="text-sm text-gray-500">{Math.round(progress.percent)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full" 
          style={{ width: `${Math.max(5, progress.percent)}%` }}
        />
      </div>
      
      {progress.status && (
        <p className="text-xs text-gray-500 mt-2">{progress.status}</p>
      )}
    </div>
  );
}
```

```tsx
// src/components/converter/ResultDownload.tsx
import { Download, Check, Eye } from 'lucide-react';
import { useState } from 'react';

interface ResultDownloadProps {
  blob: Blob;
  fileName: string;
}

export default function ResultDownload({ blob, fileName }: ResultDownloadProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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
    <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-800 mb-2">Chuyển đổi hoàn tất!</h3>
      <p className="text-gray-600 mb-6">PDF của bạn đã được chuyển đổi thành định dạng có thể tìm kiếm.</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Tải xuống PDF
        </button>
        
        <button
          onClick={openPreview}
          className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Eye className="h-5 w-5 mr-2" />
          Xem trước
        </button>
      </div>
    </div>
  );
}
```

### 5. Cấu hình Vite

```tsx
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'lang-data/*.traineddata'],
      manifest: {
        name: 'PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm',
        short_name: 'PDF OCR',
        description: 'Công cụ miễn phí chuyển đổi PDF dạng ảnh thành PDF có thể tìm kiếm',
        theme_color: '#3498db',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-