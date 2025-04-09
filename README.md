# OCR PDF

Công cụ chuyển đổi PDF ảnh thành PDF có thể tìm kiếm (searchable) bằng OCR với hỗ trợ tiếng Việt.

## Yêu cầu

- Node.js (phiên bản 14 trở lên)
- NPM hoặc Yarn
- Các công cụ hỗ trợ (không bắt buộc, nhưng khuyến nghị cài đặt ít nhất một):
  - Poppler-utils: Đặc biệt là `pdftoppm` (cách tốt nhất)
  - GhostScript: Hỗ trợ chuyển đổi PDF sang hình ảnh
  - ImageMagick: Hỗ trợ chuyển đổi PDF sang hình ảnh (với `convert` command)

## Cài đặt công cụ ngoài (Khuyến nghị)

### Windows
1. Cài đặt Poppler for Windows:
   - Tải từ: https://github.com/oschwartz10612/poppler-windows/releases/
   - Giải nén và thêm thư mục bin vào PATH hệ thống

2. Hoặc cài đặt GhostScript:
   - Tải từ: https://www.ghostscript.com/download/gsdnld.html
   - Cài đặt và đảm bảo đường dẫn được thêm vào PATH hệ thống

3. Hoặc cài đặt ImageMagick:
   - Tải từ: https://imagemagick.org/script/download.php
   - Đảm bảo chọn tùy chọn "Install legacy utilities (e.g. convert)" khi cài đặt
   - Đảm bảo đường dẫn được thêm vào PATH hệ thống

### macOS
```bash
# Cài đặt Poppler
brew install poppler

# Hoặc cài đặt GhostScript
brew install ghostscript

# Hoặc cài đặt ImageMagick
brew install imagemagick
```

### Linux (Ubuntu/Debian)
```bash
# Cài đặt Poppler-utils
sudo apt-get install poppler-utils

# Hoặc cài đặt GhostScript
sudo apt-get install ghostscript

# Hoặc cài đặt ImageMagick
sudo apt-get install imagemagick
```

## Cài đặt ứng dụng

1. Clone hoặc tải về repository này
2. Cài đặt các gói phụ thuộc:

```bash
npm install
```

hoặc nếu bạn dùng Yarn:

```bash
yarn install
```

## Cách sử dụng

1. Đặt file PDF bạn muốn OCR vào thư mục gốc của dự án (mặc định là "Giáo trình các phương pháp tối ưu.pdf")
2. Chỉnh sửa tên file đầu vào và đầu ra trong file `ocr-pdf.js` (nếu cần)
3. Chạy script:

```bash
npm start
```

hoặc:

```bash
node ocr-pdf.js
```

4. Kết quả sẽ được lưu với tên file được cấu hình trong biến `outputPdfPath`

## Phương pháp chuyển đổi

Script sử dụng các phương pháp sau để chuyển đổi PDF sang hình ảnh, theo thứ tự ưu tiên:

1. **Poppler-utils (pdftoppm)**: Phương pháp tốt nhất, nhanh và chất lượng cao
2. **GhostScript**: Phương pháp thay thế tốt nếu không có Poppler-utils
3. **ImageMagick (convert)**: Sử dụng lệnh convert từ ImageMagick
4. **Trang trống với Jimp**: Phương pháp cuối cùng, tạo trang trống với kích thước A4 (ít hiệu quả với OCR)
5. **Hướng dẫn thủ công**: Nếu không có phương pháp nào hoạt động, script sẽ tạo hướng dẫn trong thư mục `temp_images`

## Khắc phục sự cố

Nếu bạn gặp lỗi khi chạy script:

1. Đảm bảo đã cài đặt ít nhất một trong các công cụ hỗ trợ (Poppler-utils, GhostScript hoặc ImageMagick)
2. Kiểm tra các đường dẫn trong PATH hệ thống bằng cách chạy lệnh sau:
   - Windows: `echo %PATH%`
   - macOS/Linux: `echo $PATH`
3. Kiểm tra xem công cụ đã cài đặt đúng bằng cách chạy một trong các lệnh sau:
   - `pdftoppm -v`
   - `gs -v` hoặc `gswin64c -v` (Windows)
   - `convert -version`
4. Trên Windows, đảm bảo cài đặt ImageMagick với tùy chọn "Install legacy utilities"

## Lưu ý

- Quá trình OCR có thể mất nhiều thời gian tùy thuộc vào số lượng trang và độ phức tạp của nội dung
- Chất lượng OCR phụ thuộc vào chất lượng của file PDF gốc và phương pháp chuyển đổi PDF sang hình ảnh
- Công cụ này sử dụng Tesseract.js với ngôn ngữ tiếng Việt
- Ưu tiên sử dụng công cụ bên ngoài như Poppler-utils hoặc GhostScript để có kết quả tốt nhất 