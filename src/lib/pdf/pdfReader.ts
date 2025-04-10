import * as pdfjsLib from 'pdfjs-dist';
import { PdfPageInfo } from '../../types/pdf.types';

// Đăng ký worker cho pdf.js
// Sử dụng worker từ CDN phù hợp hoặc sao chép vào thư mục public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Trích xuất các trang từ file PDF và chuyển thành dạng hình ảnh
 * @param file File PDF cần trích xuất
 * @param onProgress Callback để báo cáo tiến độ trích xuất
 */
export async function extractPdfPages(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PdfPageInfo[]> {
  try {
    // Chuyển File thành ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Tải tài liệu PDF
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // Lấy tổng số trang
    const numPages = pdfDocument.numPages;
    const pagesInfo: PdfPageInfo[] = [];

    // Lặp qua từng trang và trích xuất thành hình ảnh
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      // Cập nhật tiến độ nếu có callback
      if (onProgress) {
        onProgress(pageNum, numPages);
      }

      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Scale cao hơn để chất lượng OCR tốt hơn

      // Tạo canvas để render PDF
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Không thể tạo context canvas 2D');
      }

      // Thiết lập kích thước canvas
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render trang PDF vào canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Chuyển canvas thành dataURL (base64 image)
      const dataUrl = canvas.toDataURL('image/png');

      // Thêm thông tin trang vào mảng kết quả
      pagesInfo.push({
        pageNumber: pageNum,
        width: viewport.width,
        height: viewport.height,
        dataUrl: dataUrl,
      });
    }

    return pagesInfo;
  } catch (error) {
    console.error('Lỗi khi trích xuất trang PDF:', error);
    throw error;
  }
}
