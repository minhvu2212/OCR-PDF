import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { PageOcrResult } from '../../types/pdf.types';
import * as pdfjsLib from 'pdfjs-dist';
import fontkit from '@pdf-lib/fontkit';
import { normalizeVietnameseText } from '../ocr/textFormattingUtil';

// Đảm bảo worker được thiết lập cho pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// Thay thế URL font không tồn tại bằng cách sử dụng font mặc định
// const VIETNAMESE_FONT_URL = 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-vietnamese/files/noto-sans-vietnamese-vietnamese-400-normal.woff';

/**
 * Mảng các ký tự tiếng Việt cần thay thế khi sử dụng font chuẩn
 */
const VIETNAMESE_CHARS: Record<string, string> = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd', 'Đ': 'D',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  // Chữ hoa
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
};

/**
 * Tối ưu hóa văn bản trước khi thêm vào PDF
 * @param text Văn bản cần tối ưu hóa
 * @returns Văn bản đã được tối ưu hóa
 */
function optimizeText(text: string): string {
  // Đầu tiên chuẩn hóa văn bản với các công cụ định dạng
  const normalized = normalizeVietnameseText(text);
  // Sau đó loại bỏ dấu để đảm bảo hiển thị được
  return removeVietnameseAccents(normalized);
}

/**
 * Chuyển đổi text tiếng Việt sang không dấu để tránh lỗi font
 */
function removeVietnameseAccents(text: string): string {
  return text.replace(/[^\x00-\x7F]/g, (char) => {
    return VIETNAMESE_CHARS[char] || char;
  });
}

/**
 * Tải font từ URL
 */
async function fetchFont(url: string): Promise<Uint8Array> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.error('Error fetching font:', error);
    throw error;
  }
}

/**
 * Tạo bản sao của ArrayBuffer để tránh lỗi detached ArrayBuffer
 */
function cloneArrayBuffer(buffer: ArrayBuffer): ArrayBuffer {
  // Cách an toàn hơn để tạo bản sao
  return buffer.slice(0);
}

/**
 * Chuyển đổi kích thước tương đối sang tuyệt đối
 * Sử dụng để đảm bảo vị trí đặt văn bản chính xác
 */
function transformCoordinates(
  box: { x: number; y: number; width: number; height: number },
  originalWidth: number,
  originalHeight: number,
  pdfWidth: number,
  pdfHeight: number
): { x: number; y: number; width: number; height: number } {
  // Tỉ lệ kích thước
  const widthRatio = pdfWidth / originalWidth;
  const heightRatio = pdfHeight / originalHeight;
  
  // Tính toán tọa độ mới
  return {
    x: box.x * widthRatio,
    y: box.y * heightRatio,
    width: box.width * widthRatio,
    height: box.height * heightRatio
  };
}

/**
 * Xử lý text an toàn - thay thế các ký tự không thể mã hóa
 */
function sanitizeText(text: string): string {
  // Loại bỏ dấu tiếng Việt
  return removeVietnameseAccents(text);
}

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
    const originalArrayBuffer = await originalPdf.arrayBuffer();
    
    // Tạo bản sao cho pdf.js và pdf-lib để tránh lỗi
    const pdfJsArrayBuffer = cloneArrayBuffer(originalArrayBuffer);
    const pdfLibArrayBuffer = cloneArrayBuffer(originalArrayBuffer);
    
    // Lấy kích thước trang và thông tin khác từ PDF gốc
    const pdfJsDoc = await pdfjsLib.getDocument({ data: pdfJsArrayBuffer }).promise;
    const originalSizes = [];
    
    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
      const page = await pdfJsDoc.getPage(i);
      const viewport = page.getViewport({ scale: 1.0 });
      originalSizes.push({ 
        width: viewport.width, 
        height: viewport.height,
        rotation: page.rotate || 0
      });
    }
    
    // Tạo PDF mới từ PDF gốc
    const pdfDoc = await PDFDocument.load(pdfLibArrayBuffer, {
      ignoreEncryption: true
    });
    
    // Sử dụng font chuẩn thay vì tải từ URL bên ngoài
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
    // Lấy các trang hiện có
    const pages = pdfDoc.getPages();
    
    // Tiền xử lý và chuẩn hóa dữ liệu OCR
    const processedOcrResults = ocrResults.map(result => ({
      ...result,
      text: normalizeVietnameseText(result.text), // Vẫn giữ dấu trong text gốc để tìm kiếm
      boxes: result.boxes ? result.boxes.map(box => ({
        ...box,
        text: normalizeVietnameseText(box.text || '')
      })).filter(box => box.text.trim().length > 0) : undefined
    }));
    
    // Xử lý kết quả OCR từng trang
    for (const result of processedOcrResults) {
      const { pageNumber, text, boxes } = result;
      
      // Kiểm tra tính hợp lệ của số trang
      if (pageNumber <= 0 || pageNumber > pages.length) {
        console.warn(`Số trang không hợp lệ: ${pageNumber}`);
        continue;
      }
      
      // Lấy trang từ PDF
      const page = pages[pageNumber - 1];
      const { width, height } = page.getSize();
      const originalSize = originalSizes[pageNumber - 1];
      
      // Xử lý rotation nếu có
      let pdfWidth = width;
      let pdfHeight = height;
      
      if (originalSize.rotation === 90 || originalSize.rotation === 270) {
        // Đảo chiều dài và rộng nếu trang bị xoay
        pdfWidth = height;
        pdfHeight = width;
      }
      
      // Nếu có boxes (tọa độ chi tiết của từng đoạn văn bản), sử dụng chúng để đặt text chính xác
      if (boxes && boxes.length > 0) {
        // Nhóm các box gần nhau thành dòng văn bản hoàn chỉnh
        const lines = groupBoxesIntoLines(boxes);
        
        for (const line of lines) {
          try {
            if (!line.text || !line.text.trim()) continue;
            
            // Chuẩn hóa và loại bỏ dấu tiếng Việt để tránh lỗi font
            const safeText = removeVietnameseAccents(line.text);
            
            // Chuyển đổi tọa độ và kích thước theo tỉ lệ thực tế của PDF
            const transformedBox = transformCoordinates(
              line,
              originalSize.width,
              originalSize.height,
              pdfWidth,
              pdfHeight
            );
            
            // Chuyển đổi tọa độ từ hệ tọa độ OCR (trên xuống) sang hệ tọa độ PDF (dưới lên)
            const pdfX = transformedBox.x;
            const pdfY = height - transformedBox.y - transformedBox.height;
            
            // Thêm text vào PDF với độ mờ = 0 (hoàn toàn trong suốt)
            const adjustedFontSize = Math.min(transformedBox.height * 0.85, 12);
            page.drawText(safeText, {
              x: pdfX,
              y: pdfY,
              size: adjustedFontSize,
              font: font,
              opacity: 0,
              color: rgb(0, 0, 0),
              maxWidth: transformedBox.width
            });
          } catch (error) {
            console.warn(`Không thể thêm text layer cho dòng văn bản ở trang ${pageNumber}:`, error);
          }
        }
      } else {
        // Nếu không có boxes, phân tích văn bản thành các đoạn và dòng để đặt chính xác hơn
        try {
          // Phân tích text thành các đoạn 
          const paragraphs = text.split('\n\n');
          const totalParagraphs = paragraphs.length;
          
          for (let pIndex = 0; pIndex < totalParagraphs; pIndex++) {
            const paragraph = paragraphs[pIndex].trim();
            if (!paragraph) continue;
            
            // Chia đoạn thành các dòng
            const lines = paragraph.split('\n');
            const totalLines = lines.length;
            
            // Ước tính vị trí bắt đầu của đoạn
            const yStart = height - (height * 0.1) - (pIndex * (height / (totalParagraphs + 2)));
            const lineHeight = (height / (totalParagraphs + 2)) / (totalLines + 1);
            
            // Vẽ từng dòng văn bản
            for (let lIndex = 0; lIndex < totalLines; lIndex++) {
              const line = lines[lIndex].trim();
              if (!line) continue;
              
              // Chuẩn hóa và loại bỏ dấu tiếng Việt
              const safeText = removeVietnameseAccents(line);
              
              // Tính toán vị trí Y của dòng
              const lineY = yStart - (lIndex * lineHeight);
              
              // Kích thước font dựa trên độ cao dòng
              const fontSize = lineHeight * 0.7;
              
              // Thêm văn bản (hoàn toàn trong suốt)
              page.drawText(safeText, {
                x: width * 0.05,
                y: lineY,
                size: fontSize > 0.5 ? fontSize : 0.5,
                font: font,
                opacity: 0,
                color: rgb(0, 0, 0)
              });
            }
          }
        } catch (error) {
          console.warn(`Không thể thêm text layer cho trang ${pageNumber}:`, error);
        }
      }
    }
    
    // Đặt metadata cho PDF
    pdfDoc.setTitle(`Có thể tìm kiếm - ${originalPdf.name}`);
    pdfDoc.setSubject('PDF có thể tìm kiếm với OCR');
    pdfDoc.setProducer('PDF OCR App');
    pdfDoc.setCreator('PDF OCR Converter');
    pdfDoc.setKeywords(['ocr', 'searchable', 'pdf', 'tiếng việt']);
    
    // Tạo và trả về PDF đã xử lý
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false
    });
    return pdfBytes;
  } catch (error) {
    console.error('Lỗi khi tạo PDF có thể tìm kiếm:', error);
    throw error;
  }
}

/**
 * Nhóm các box thành các dòng văn bản hoàn chỉnh
 */
function groupBoxesIntoLines(boxes: Array<{ x: number; y: number; width: number; height: number; text: string }>): Array<{ x: number; y: number; width: number; height: number; text: string }> {
  // Sắp xếp boxes theo thứ tự từ trên xuống
  const sortedBoxes = [...boxes].sort((a, b) => a.y - b.y);
  
  // Mảng kết quả chứa các dòng
  const lines: Array<{ x: number; y: number; width: number; height: number; text: string; boxes: typeof boxes }> = [];
  
  // Tính chiều cao trung bình của box
  const avgHeight = sortedBoxes.reduce((sum, box) => sum + box.height, 0) / sortedBoxes.length;
  
  // Duyệt qua từng box và nhóm thành dòng
  for (const box of sortedBoxes) {
    // Tìm dòng hiện tại mà box có thể thuộc về
    const lineIndex = lines.findIndex(line => {
      // Kiểm tra xem box có thuộc cùng dòng với line hay không
      const yDiff = Math.abs(line.y - box.y);
      // Sử dụng chiều cao trung bình làm cơ sở để xác định box có nằm trên cùng dòng không
      const threshold = Math.min(avgHeight * 0.6, Math.max(line.height, box.height) * 0.5);
      return yDiff < threshold;
    });
    
    if (lineIndex >= 0) {
      // Nếu tìm thấy dòng phù hợp, thêm box vào dòng đó
      lines[lineIndex].boxes.push(box);
    } else {
      // Nếu không, tạo dòng mới
      lines.push({
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        text: box.text,
        boxes: [box]
      });
    }
  }
  
  // Xử lý từng dòng: sắp xếp các box từ trái sang phải và gộp text
  return lines.map(line => {
    // Sắp xếp boxes trong dòng từ trái sang phải
    const sortedBoxes = line.boxes.sort((a, b) => a.x - b.x);
    
    // Tính toán vị trí và kích thước mới cho dòng
    const minX = Math.min(...sortedBoxes.map(b => b.x));
    const minY = Math.min(...sortedBoxes.map(b => b.y));
    const maxX = Math.max(...sortedBoxes.map(b => b.x + b.width));
    const maxY = Math.max(...sortedBoxes.map(b => b.y + b.height));
    
    // Gộp text từ các box, thêm khoảng trắng giữa các box gần nhau
    let lineText = '';
    for (let i = 0; i < sortedBoxes.length; i++) {
      const box = sortedBoxes[i];
      lineText += box.text;
      
      // Thêm khoảng trắng nếu không phải box cuối và khoảng cách đủ lớn
      if (i < sortedBoxes.length - 1) {
        const nextBox = sortedBoxes[i + 1];
        const gap = nextBox.x - (box.x + box.width);
        
        // Tính toán chiều rộng trung bình của ký tự cho box hiện tại
        const avgCharWidth = box.width / Math.max(box.text.length, 1);
        
        // Nếu khoảng cách lớn hơn 1/3 chiều rộng ký tự, thêm khoảng trắng
        if (gap > avgCharWidth * 0.3) {
          // Thêm nhiều khoảng trắng nếu khoảng cách rất lớn
          if (gap > avgCharWidth * 2) {
            lineText += '  ';
          } else {
            lineText += ' ';
          }
        }
        
        // Nếu box hiện tại kết thúc bằng dấu gạch ngang và box tiếp theo bắt đầu với chữ cái,
        // có thể đây là từ bị ngắt - cần loại bỏ khoảng trắng vừa thêm
        if (box.text.endsWith('-') && 
            nextBox.text.length > 0 && 
            /^[a-zA-ZÀ-ỹ]/.test(nextBox.text)) {
          lineText = lineText.trimEnd();
        }
      }
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      text: lineText.trim()
    };
  });
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
    
    // Sử dụng font chuẩn thay vì tải từ URL bên ngoài
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Lấy kích thước từ PDF gốc
    let originalSizes: Array<{ width: number; height: number; rotation: number }> = [];
    try {
      const arrayBuffer = await originalPdf.arrayBuffer();
      const pdfJsArrayBuffer = cloneArrayBuffer(arrayBuffer);
      
      const pdfJsDoc = await pdfjsLib.getDocument({ data: pdfJsArrayBuffer }).promise;
      
      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        originalSizes.push({ 
          width: viewport.width, 
          height: viewport.height,
          rotation: page.rotate || 0
        });
      }
    } catch (error) {
      console.warn('Không thể lấy kích thước từ PDF gốc:', error);
      // Mặc định A4
      originalSizes = ocrResults.map(() => ({ width: 595, height: 842, rotation: 0 }));
    }
    
    // Tiền xử lý và chuẩn hóa dữ liệu OCR - và luôn luôn loại bỏ dấu
    const processedOcrResults = ocrResults.map(result => ({
      ...result,
      text: removeVietnameseAccents(normalizeVietnameseText(result.text)),
      boxes: result.boxes ? result.boxes.map(box => ({
        ...box,
        text: removeVietnameseAccents(normalizeVietnameseText(box.text || ''))
      })).filter(box => box.text.trim().length > 0) : undefined
    }));
    
    // Xử lý kết quả OCR từng trang
    for (const result of processedOcrResults) {
      const { pageNumber, text, boxes } = result;
      
      if (pageNumber <= 0 || pageNumber > originalSizes.length) {
        console.warn(`Số trang không hợp lệ: ${pageNumber}`);
        continue;
      }
      
      // Lấy kích thước trang
      const { width, height, rotation } = originalSizes[pageNumber - 1];
      
      // Xử lý rotation
      let pageWidth = width;
      let pageHeight = height;
      
      if (rotation === 90 || rotation === 270) {
        pageWidth = height;
        pageHeight = width;
      }
      
      // Tạo trang mới
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      
      // Thêm header - đã được loại bỏ dấu
      page.drawText(`Trang ${pageNumber} - Ban xem truoc text OCR`, {
        x: 50,
        y: pageHeight - 30,
        size: 16,
        font: boldFont,
        color: rgb(0.2, 0.2, 0.8)
      });
      
      // Vẽ đường ngăn header
      page.drawLine({
        start: { x: 50, y: pageHeight - 40 },
        end: { x: pageWidth - 50, y: pageHeight - 40 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8)
      });
      
      // Vẽ thông tin file gốc
      page.drawText(`File goc: ${removeVietnameseAccents(originalPdf.name)}`, {
        x: 50,
        y: pageHeight - 60,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
      
      // Nếu có boxes, nhóm chúng thành dòng và hiển thị
      if (boxes && boxes.length > 0) {
        // Nhóm các box thành dòng
        const lines = groupBoxesIntoLines(boxes);
        
        for (const line of lines) {
          try {
            if (!line.text || !line.text.trim()) continue;
            
            // Text đã được loại bỏ dấu khi xử lý trước đó
            const safeText = line.text;
            
            // Chuyển đổi tọa độ
            const transformedBox = transformCoordinates(
              line,
              originalSizes[pageNumber - 1].width,
              originalSizes[pageNumber - 1].height,
              pageWidth,
              pageHeight
            );
            
            const pdfX = transformedBox.x;
            const pdfY = pageHeight - transformedBox.y - transformedBox.height;
            
            // Vẽ đường viền xung quanh box
            page.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: transformedBox.width,
              height: transformedBox.height,
              borderColor: rgb(0.8, 0.2, 0.2),
              borderWidth: 0.5
            });
            
            // Vẽ text
            page.drawText(safeText, {
              x: pdfX + 2,
              y: pdfY + transformedBox.height / 2 - 4,
              size: 8,
              font: font,
              color: rgb(0, 0, 0)
            });
          } catch (error) {
            console.warn(`Không thể thêm text cho dòng văn bản ở trang ${pageNumber}:`, error);
          }
        }
        
        // Thêm văn bản đầy đủ ở dưới
        page.drawText('Van ban day du:', {
          x: 50,
          y: 120,
          size: 12,
          font: boldFont,
          color: rgb(0.2, 0.5, 0.2)
        });
        
        const paragraphs = text.split('\n\n'); // text đã được loại bỏ dấu
        let yPos = 100;
        
        for (let i = 0; i < Math.min(paragraphs.length, 3); i++) {
          const para = paragraphs[i].trim();
          if (!para) continue;
          
          const lines = para.split('\n');
          for (let j = 0; j < Math.min(lines.length, 3); j++) {
            const line = lines[j].trim();
            if (!line) continue;
            
            const displayText = line.length > 80 ? line.substring(0, 77) + '...' : line;
            
            page.drawText(displayText, {
              x: 50,
              y: yPos,
              size: 8,
              font: font,
              color: rgb(0.3, 0.3, 0.3)
            });
            
            yPos -= 12;
            if (yPos < 50) break;
          }
          
          if (yPos < 50) {
            page.drawText('... (con nua)', {
              x: 50,
              y: 35,
              size: 8,
              font: font,
              color: rgb(0.5, 0.5, 0.5)
            });
            break;
          }
          
          yPos -= 5; // Khoảng cách giữa các đoạn
        }
      } else {
        // Nếu không có boxes, hiển thị văn bản dạng đoạn
        const paragraphs = text.split('\n\n'); // text đã được loại bỏ dấu 
        let yPos = pageHeight - 100;
        
        for (const para of paragraphs) {
          if (!para.trim()) continue;
          
          const lines = para.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue;
            
            page.drawText(line.trim(), {
              x: 50,
              y: yPos,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
              maxWidth: pageWidth - 100
            });
            
            yPos -= 14;
            if (yPos < 50) {
              page.drawText('... (con nua)', {
                x: 50,
                y: 30,
                size: 10,
                font: boldFont,
                color: rgb(0.5, 0.5, 0.5)
              });
              break;
            }
          }
          
          if (yPos < 50) break;
          
          yPos -= 10; // Khoảng cách giữa các đoạn
        }
      }
    }
    
    // Đặt metadata
    pdfDoc.setTitle(`Xem truoc van ban - ${removeVietnameseAccents(originalPdf.name)}`);
    pdfDoc.setSubject('Xem truoc van ban OCR');
    pdfDoc.setProducer('PDF OCR App');
    pdfDoc.setCreator('PDF OCR Converter');
    pdfDoc.setKeywords(['ocr', 'text', 'preview', 'tieng viet']);
    
    // Tạo và trả về PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Lỗi khi tạo PDF chỉ chứa text:', error);
    throw error;
  }
} 