import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PageOcrResult } from '../../types/pdf.types';
import * as pdfjsLib from 'pdfjs-dist';
import { normalizeVietnameseText } from '../ocr/textFormattingUtil';

// Đảm bảo worker được thiết lập cho pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';



/**
 * Tạo PDF có thể tìm kiếm từ file PDF gốc và kết quả OCR
 * Bằng cách giữ lại hình ảnh gốc và thêm lớp text chính xác
 */
export async function createSearchablePdf(
  originalPdf: File,
  ocrResults: PageOcrResult[]
): Promise<Uint8Array> {
  try {
    // Đọc file PDF gốc
    const arrayBuffer = await originalPdf.arrayBuffer();
    const arrayBufferCopy = arrayBuffer.slice(0); // Tạo bản sao để tránh lỗi detached
    
    // Lấy kích thước trang từ PDF gốc
    const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const originalSizes = [];
    
    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
      const page = await pdfJsDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      originalSizes.push({ width: viewport.width, height: viewport.height });
    }
    
    // Tạo PDF mới từ PDF gốc
    const pdfDoc = await PDFDocument.load(arrayBufferCopy);
    
    // Nhúng font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Lấy các trang hiện có
    const pages = pdfDoc.getPages();
    
    // Xử lý kết quả OCR từng trang
    for (const result of ocrResults) {
      const { pageNumber, text, boxes } = result;
      
      // Kiểm tra tính hợp lệ của số trang
      if (pageNumber <= 0 || pageNumber > pages.length) {
        console.warn(`Số trang không hợp lệ: ${pageNumber}`);
        continue;
      }
      
      // Lấy trang từ PDF
      const page = pages[pageNumber - 1];
      const { width, height } = page.getSize();
      
      // Nếu có boxes (tọa độ chi tiết của từng đoạn văn bản), sử dụng chúng để đặt text chính xác
      if (boxes && boxes.length > 0) {
        for (const box of boxes) {
          try {
            // Chuẩn hóa text tiếng Việt
            const normalizedText = normalizeVietnameseText(box.text);
            
            // Chuyển đổi tọa độ từ hệ tọa độ OCR sang hệ tọa độ PDF
            // Giả sử tọa độ OCR bắt đầu từ trên cùng bên trái
            // PDF-lib sử dụng tọa độ bắt đầu từ dưới cùng bên trái
            const pdfX = box.x;
            const pdfY = height - box.y - box.height;
            
            page.drawText(normalizedText, {
              x: pdfX,
              y: pdfY,
              size: 0.1,  // Kích thước nhỏ nhưng không phải 0 để đảm bảo chính xác
              font: font,
              opacity: 0.01,  // Gần như trong suốt nhưng không hoàn toàn để tăng tính chính xác
              color: rgb(0, 0, 0)
            });
          } catch (error) {
            console.warn(`Không thể thêm text layer cho hộp văn bản ở trang ${pageNumber}:`, error);
          }
        }
      } else {
        // Nếu không có boxes, phân tích văn bản thành các dòng và đặt vào vị trí ước lượng
        try {
          const normalizedText = normalizeVietnameseText(text);
          const lines = normalizedText.split('\n');
          const lineHeight = height / (lines.length + 2); // Ước lượng khoảng cách dòng
          
          for (let i = 0; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Bỏ qua dòng trống
            
            page.drawText(lines[i], {
              x: width * 0.05, // Đặt text cách lề trái 5%
              y: height - (i + 1) * lineHeight, // Đặt text từ trên xuống
              size: 0.1, // Kích thước nhỏ nhưng không phải 0
              font: font,
              opacity: 0.01, // Gần như trong suốt
              color: rgb(0, 0, 0)
            });
          }
        } catch (error) {
          console.warn(`Không thể thêm text layer cho trang ${pageNumber}:`, error);
        }
      }
    }
    
    // Đặt metadata cho PDF
    pdfDoc.setTitle(`Có thể tìm kiếm - ${originalPdf.name}`);
    pdfDoc.setSubject('PDF có thể tìm kiếm được');
    pdfDoc.setProducer('PDF OCR App');
    pdfDoc.setCreator('PDF OCR Converter');
    pdfDoc.setKeywords(['ocr', 'searchable', 'pdf']);
    
    // Tạo và trả về PDF đã xử lý
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Lỗi khi tạo PDF có thể tìm kiếm:', error);
    throw error;
  }
}

/**
 * Tạo một PDF mới chỉ chứa text từ kết quả OCR để kiểm tra
 * Được sử dụng để xác nhận kết quả OCR trước khi tạo PDF cuối cùng
 */
export async function createTextOnlyPdf(
  originalPdf: File,
  ocrResults: PageOcrResult[]
): Promise<Uint8Array> {
  try {
    // Tạo một PDF mới
    const pdfDoc = await PDFDocument.create();
    
    // Nhúng font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Lấy kích thước từ PDF gốc nếu có thể
    let originalSizes: Array<{ width: number; height: number }> = [];
    try {
      const arrayBuffer = await originalPdf.arrayBuffer();
      const arrayBufferCopy = arrayBuffer.slice(0); // Tạo bản sao để tránh lỗi detached
      const pdfJsDoc = await pdfjsLib.getDocument({ data: arrayBufferCopy }).promise;
      
      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        originalSizes.push({ width: viewport.width, height: viewport.height });
      }
    } catch (error) {
      console.warn('Không thể lấy kích thước từ PDF gốc:', error);
      // Mặc định nếu không lấy được kích thước từ PDF gốc
      originalSizes = ocrResults.map(() => ({ width: 595, height: 842 })); // A4 mặc định
    }
    
    // Xử lý kết quả OCR từng trang
    for (const result of ocrResults) {
      const { pageNumber, text, boxes } = result;
      
      // Kiểm tra tính hợp lệ của số trang
      if (pageNumber <= 0 || pageNumber > originalSizes.length) {
        console.warn(`Số trang không hợp lệ: ${pageNumber}`);
        continue;
      }
      
      // Lấy kích thước trang
      const { width, height } = originalSizes[pageNumber - 1];
      
      // Tạo trang mới
      const page = pdfDoc.addPage([width, height]);
      
      // Thêm số trang cho dễ đối chiếu
      page.drawText(`Trang ${pageNumber}`, {
        x: 50,
        y: height - 30,
        size: 16,
        font: font,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      // Nếu có boxes (tọa độ chi tiết của từng đoạn văn bản), sử dụng chúng
      if (boxes && boxes.length > 0) {
        for (const box of boxes) {
          try {
            const normalizedText = normalizeVietnameseText(box.text);
            const pdfX = box.x;
            const pdfY = height - box.y - box.height; // Chuyển đổi tọa độ Y
            
            page.drawText(normalizedText, {
              x: pdfX,
              y: pdfY,
              size: 10,  // Kích thước nhìn thấy được
              font: font,
              color: rgb(0, 0, 0)
            });
            
            // Vẽ đường viền xung quanh box để dễ kiểm tra
            page.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: box.width,
              height: box.height,
              borderColor: rgb(1, 0, 0),
              borderWidth: 1
            });
          } catch (error) {
            console.warn(`Không thể thêm text cho hộp văn bản ở trang ${pageNumber}:`, error);
          }
        }
      } else {
        // Nếu không có boxes, thêm toàn bộ văn bản ở vị trí cố định
        try {
          // Chuẩn hóa text tiếng Việt
          const normalizedText = normalizeVietnameseText(text);
          // Chia text thành các dòng để hiển thị dễ đọc hơn
          const lines = normalizedText.split('\n');
          for (let i = 0; i < lines.length; i++) {
            page.drawText(lines[i], {
              x: 50,
              y: height - 50 - (i * 14), // Mỗi dòng xuống thêm 14pt
              size: 10,
              font: font,
              color: rgb(0, 0, 0)
            });
          }
        } catch (error) {
          console.warn(`Không thể thêm text cho trang ${pageNumber}:`, error);
        }
      }
    }
    
    // Đặt metadata cho PDF
    pdfDoc.setTitle(`Text Only - ${originalPdf.name}`);
    pdfDoc.setSubject('PDF chỉ chứa text từ OCR');
    pdfDoc.setProducer('PDF OCR App');
    pdfDoc.setCreator('PDF OCR Converter');
    
    // Tạo và trả về PDF đã xử lý
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Lỗi khi tạo PDF chỉ chứa text:', error);
    throw error;
  }
}