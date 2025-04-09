/**
 * Những tiện ích xử lý định dạng văn bản từ OCR
 * Tập trung hỗ trợ các tính năng cho tiếng Việt
 */

/**
 * Chuyển đổi dấu câu tiếng Việt không chuẩn sang chuẩn
 * @param text Chuỗi văn bản cần chuẩn hóa
 * @returns Chuỗi văn bản đã được chuẩn hóa
 */
export function normalizeVietnamesePunctuation(text: string): string {
  return text
    // Chuẩn hóa dấu ngoặc
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    // Chuẩn hóa dấu gạch ngang
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    // Chuẩn hóa dấu ba chấm
    .replace(/…/g, '...')
    // Chuẩn hóa dấu câu khác
    .replace(/․/g, '.')  // Dấu chấm không chuẩn
    .replace(/，/g, ',') // Dấu phẩy không chuẩn
    .replace(/；/g, ';') // Dấu chấm phẩy không chuẩn
}

/**
 * Sửa các lỗi phổ biến trong văn bản OCR tiếng Việt
 * @param text Chuỗi văn bản cần sửa
 * @returns Chuỗi văn bản đã được sửa lỗi
 */
export function fixCommonVietnameseOcrErrors(text: string): string {
  return text
    // Sửa các lỗi dấu thanh bị tách rời
    .replace(/([aăâeêioôơuưyAĂÂEÊIOÔƠUƯY])[\s`']+([àáạảãăằắặẳẵâầấậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ])/gi, '$1$2')
    // Sửa lỗi "nh" bị tách thành "n h"
    .replace(/([^\s])[\s]+([hH])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi "ng" bị tách thành "n g"
    .replace(/([^\s])[\s]+([gG])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi "th" bị tách thành "t h"
    .replace(/([^\s])[\s]+([hH])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi "tr" bị tách thành "t r"
    .replace(/([tT])[\s]+([rR])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi "qu" bị tách thành "q u"
    .replace(/([qQ])[\s]+([uU])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi "gi" bị tách thành "g i"
    .replace(/([gG])[\s]+([iI])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, '$1$2')
    // Sửa lỗi số bị tách
    .replace(/(\d)[\s,]+(\d)/g, '$1$2')
    // Sửa lỗi chữ "đ/Đ" bị nhận dạng thành "d/D"
    .replace(/(?<=[^\w])([dD])(?=[aàáạảãăằắặẳẵâầấậẩẫeèéẹẻẽêềếệểễiìíịỉĩoòóọỏõôồốộổỗơờớợởỡuùúụủũưừứựửữyỳýỵỷỹ])/g, 'đ');
}

/**
 * Chuẩn hóa khoảng trắng trong văn bản tiếng Việt
 * @param text Chuỗi văn bản cần chuẩn hóa
 * @returns Chuỗi văn bản đã được chuẩn hóa khoảng trắng
 */
export function normalizeVietnameseSpacing(text: string): string {
  return text
    // Loại bỏ khoảng trắng trước dấu câu 
    .replace(/\s+([\.,;:!?)\]}])/g, '$1')
    // Loại bỏ khoảng trắng sau dấu mở ngoặc
    .replace(/([\(\[{])\s+/g, '$1')
    // Đảm bảo khoảng trắng sau dấu câu
    .replace(/([\.!?])([A-ZÀ-Ỹ])/g, '$1 $2')
    // Thêm khoảng trắng giữa câu và chữ hoa bắt đầu câu mới
    .replace(/([a-zà-ỹ])([A-ZÀ-Ỹ])/g, '$1 $2')
    // Loại bỏ khoảng trắng thừa
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Chuẩn hóa văn bản tiếng Việt từ OCR
 * @param text Chuỗi văn bản OCR cần chuẩn hóa
 * @returns Chuỗi văn bản đã được chuẩn hóa
 */
export function normalizeVietnameseText(text: string): string {
  // Loại bỏ các ký tự đặc biệt không mong muốn
  let normalized = text
    .replace(/[\x00-\x08\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ');
  
  // Áp dụng các bước chuẩn hóa
  normalized = normalizeVietnamesePunctuation(normalized);
  normalized = fixCommonVietnameseOcrErrors(normalized);
  normalized = normalizeVietnameseSpacing(normalized);
  
  return normalized;
} 