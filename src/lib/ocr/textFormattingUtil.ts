/**
 * Chuẩn hóa văn bản tiếng Việt để xử lý OCR tốt hơn
 * @param text Văn bản cần chuẩn hóa
 * @returns Văn bản đã được chuẩn hóa
 */
export function normalizeVietnameseText(text: string): string {
  if (!text) return '';
  
  // Loại bỏ các ký tự không cần thiết
  let normalizedText = text.trim();
  
  // Sửa lỗi chung trong OCR tiếng Việt
  normalizedText = normalizedText
    // Sửa dấu thanh
    .replace(/òa/g, 'oà')
    .replace(/óa/g, 'oá')
    .replace(/ỏa/g, 'oả')
    .replace(/õa/g, 'oã')
    .replace(/ọa/g, 'oạ')
    
    // Sửa lỗi gõ dấu sai
    .replace(/ă'/g, 'ắ')
    .replace(/ă`/g, 'ằ')
    .replace(/ă\?/g, 'ẳ')
    .replace(/ă~/g, 'ẵ')
    .replace(/ă\./g, 'ặ')
    
    // Sửa lỗi chữ đ/Đ
    .replace(/đ'/g, 'đ')
    .replace(/Đ'/g, 'Đ')
    
    // Các lỗi dấu khác
    .replace(/\bi\b/g, 'í')
    .replace(/\bl\b/g, 'I');
  
  return normalizedText;
}