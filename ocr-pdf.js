const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist');
const { PDFDocument, rgb } = require('pdf-lib');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const Jimp = require('jimp');

// Đường dẫn đến file PDF input
const inputPdfPath = 'Giáo trình các phương pháp tối ưu.pdf';
// Đường dẫn đến file PDF output
const outputPdfPath = 'Giáo trình các phương pháp tối ưu - OCR.pdf';
// Thư mục tạm thời để lưu ảnh từng trang
const tempDir = './temp_images';

// Tạo thư mục tạm thời nếu chưa tồn tại
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Cài đặt môi trường cho pdfjs-dist
if (typeof window === 'undefined') {
    global.window = {};
    global.navigator = { userAgent: 'node' };
    global.document = {
        documentElement: { style: {} },
        getElementsByTagName: () => [],
        createElement: () => ({
            style: {},
            getContext: () => ({}),
            getElementsByTagName: () => [],
            appendChild: () => {}
        })
    };
    global.DOMParser = require('xmldom').DOMParser;
    global.XMLSerializer = require('xmldom').XMLSerializer;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.js');

// Hàm chuyển đổi PDF sang hình ảnh
async function convertPdfToImages(pdfPath, outputDir) {
    // Phương pháp 1: Sử dụng pdftoppm từ Poppler-utils
    try {
        // Kiểm tra xem pdftoppm có sẵn không
        await execPromise('pdftoppm -v');
        // Sử dụng pdftoppm để chuyển đổi
        console.log('Sử dụng pdftoppm để chuyển PDF thành hình ảnh...');
        await execPromise(`pdftoppm -png -r 300 "${pdfPath}" "${path.join(outputDir, 'page')}"`);
        
        // Trả về danh sách các file PNG đã tạo
        const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.png'))
            .sort((a, b) => {
                const numA = parseInt(a.match(/page-(\d+)/)?.[1] || a.match(/-(\d+)\.png$/)?.[1] || '0');
                const numB = parseInt(b.match(/page-(\d+)/)?.[1] || b.match(/-(\d+)\.png$/)?.[1] || '0');
                return numA - numB;
            });
        return files.map(file => path.join(outputDir, file));
    } catch (error) {
        console.log('pdftoppm không khả dụng, sử dụng phương pháp thay thế...');
        
        // Phương pháp 2: Sử dụng Ghostscript trực tiếp
        try {
            console.log('Sử dụng Ghostscript...');
            
            // Kiểm tra Ghostscript
            let gsCommand = '';
            try {
                await execPromise('gswin64c -v');
                console.log('Ghostscript 64-bit đã được cài đặt, tiếp tục...');
                gsCommand = 'gswin64c';
            } catch (gsError) {
                try {
                    await execPromise('gswin32c -v');
                    console.log('Ghostscript 32-bit đã được cài đặt, tiếp tục...');
                    gsCommand = 'gswin32c';
                } catch (gsError2) {
                    try {
                        await execPromise('gs -v');
                        console.log('Ghostscript đã được cài đặt (Linux/macOS), tiếp tục...');
                        gsCommand = 'gs';
                    } catch (gsError3) {
                        throw new Error('Không tìm thấy Ghostscript. Vui lòng cài đặt Ghostscript.');
                    }
                }
            }
            
            // Đọc file PDF để xác định số trang
            const data = new Uint8Array(fs.readFileSync(pdfPath));
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            const numPages = pdf.numPages;
            
            console.log(`Tổng số trang: ${numPages}`);
            const imagePaths = [];
            
            // Chuyển đổi từng trang sử dụng Ghostscript
            for (let i = 1; i <= numPages; i++) {
                const outputPath = path.join(outputDir, `page_${i.toString().padStart(3, '0')}.png`);
                const cmd = `${gsCommand} -sDEVICE=pngalpha -o "${outputPath}" -r300 -dFirstPage=${i} -dLastPage=${i} -dNOPAUSE -dBATCH "${pdfPath}"`;
                
                await execPromise(cmd);
                imagePaths.push(outputPath);
                console.log(`Đã xử lý trang ${i}/${numPages}`);
            }
            
            return imagePaths;
        } catch (gsError) {
            console.error('Không thể sử dụng Ghostscript:', gsError.message);
            
            // Phương pháp 3: Sử dụng pdf-img với Ghostscript (thư viện Node.js)
            try {
                console.log('Thử sử dụng pdf-img...');
                
                // Đọc file PDF để xác định số trang
                const data = new Uint8Array(fs.readFileSync(pdfPath));
                const pdf = await pdfjsLib.getDocument({ data }).promise;
                const numPages = pdf.numPages;
                
                console.log(`Tổng số trang: ${numPages}`);
                const imagePaths = [];
                
                // Tạo file batch script tạm thời để chuyển đổi PDF trên Windows
                const batchFilePath = path.join(outputDir, 'convert.bat');
                const bashFilePath = path.join(outputDir, 'convert.sh');
                
                if (process.platform === 'win32') {
                    let batchContent = '@echo off\n';
                    batchContent += 'echo Đang chuyển đổi PDF thành hình ảnh...\n';
                    
                    for (let i = 1; i <= numPages; i++) {
                        const outputPath = path.join(outputDir, `page_${i.toString().padStart(3, '0')}.png`);
                        batchContent += `magick convert -density 300 "${pdfPath}"[${i-1}] -quality 100 "${outputPath}"\n`;
                        imagePaths.push(outputPath);
                    }
                    
                    fs.writeFileSync(batchFilePath, batchContent);
                    await execPromise(batchFilePath);
                } else {
                    // macOS/Linux
                    let bashContent = '#!/bin/bash\n';
                    bashContent += 'echo "Đang chuyển đổi PDF thành hình ảnh..."\n';
                    
                    for (let i = 1; i <= numPages; i++) {
                        const outputPath = path.join(outputDir, `page_${i.toString().padStart(3, '0')}.png`);
                        bashContent += `convert -density 300 "${pdfPath}"[${i-1}] -quality 100 "${outputPath}"\n`;
                        imagePaths.push(outputPath);
                    }
                    
                    fs.writeFileSync(bashFilePath, bashContent);
                    await execPromise(`chmod +x "${bashFilePath}" && "${bashFilePath}"`);
                }
                
                return imagePaths;
            } catch (imgError) {
                console.error('Không thể sử dụng pdf-img:', imgError.message);
                
                // Phương pháp 4: Tạo trang trống với Jimp - phương pháp giải pháp cuối cùng
                try {
                    console.log('Thử tạo trang trống với Jimp...');
                    
                    // Đọc file PDF để xác định số trang
                    const data = new Uint8Array(fs.readFileSync(pdfPath));
                    const pdf = await pdfjsLib.getDocument({ data }).promise;
                    const numPages = pdf.numPages;
                    
                    console.log(`Tổng số trang: ${numPages}`);
                    const imagePaths = [];
                    
                    // Tạo hình ảnh trống
                    for (let i = 1; i <= numPages; i++) {
                        const outputPath = path.join(outputDir, `page_${i.toString().padStart(3, '0')}.png`);
                        const image = new Jimp(595, 842, 'white'); // Kích thước A4
                        await image.writeAsync(outputPath);
                        imagePaths.push(outputPath);
                        console.log(`Đã tạo trang trống ${i}/${numPages}`);
                    }
                    
                    console.warn('CHÚ Ý: Đang sử dụng trang trống! OCR sẽ không có hiệu quả. Vui lòng cài đặt Poppler-utils hoặc Ghostscript.');
                    return imagePaths;
                } catch (jimpError) {
                    console.error('Không thể tạo trang trống:', jimpError.message);
                    
                    // Phương pháp 5: Tạo file hướng dẫn cho người dùng
                    const helpFilePath = path.join(outputDir, 'README_HELP.txt');
                    fs.writeFileSync(helpFilePath, 
                        `Không thể chuyển đổi PDF sang hình ảnh tự động.
                        Vui lòng cài đặt một trong các công cụ sau:
                        1. Poppler-utils (pdftoppm): https://poppler.freedesktop.org/
                        2. GhostScript: https://www.ghostscript.com/download/gsdnld.html
                        3. ImageMagick: https://imagemagick.org/script/download.php
                        
                        Hoặc sử dụng công cụ bên ngoài (như Adobe Acrobat, GIMP, v.v.) để chuyển đổi PDF sang hình ảnh PNG và đặt vào thư mục ${outputDir}
                        `);
                    throw new Error('Không thể chuyển đổi PDF sang hình ảnh. Vui lòng xem hướng dẫn trong thư mục temp_images.');
                }
            }
        }
    }
}

// Hàm chính
async function convertPdfToOcr() {
    try {
        console.log('Bắt đầu quá trình OCR PDF...');
        
        // Chuyển đổi PDF thành các ảnh
        const imagePaths = await convertPdfToImages(inputPdfPath, tempDir);
        console.log(`Đã chuyển đổi PDF thành ${imagePaths.length} ảnh.`);
        
        // Tạo PDF mới
        const outputPdf = await PDFDocument.create();
        
        // Khởi tạo worker Tesseract với tiếng Việt
        const worker = await createWorker('vie');
        
        for (let i = 0; i < imagePaths.length; i++) {
            const imgPath = imagePaths[i];
            console.log(`Đang xử lý trang ${i+1}/${imagePaths.length}: ${path.basename(imgPath)}`);
            
            // Thực hiện OCR
            const { data: { text } } = await worker.recognize(imgPath);
            console.log(`Đã nhận dạng trang ${i+1}. Text: ${text.substring(0, 50)}...`);
            
            // Lấy kích thước hình ảnh
            const dimensions = await getImageDimensions(imgPath);
            
            // Tạo trang mới trong PDF đầu ra
            const newPage = outputPdf.addPage([dimensions.width, dimensions.height]);
            
            // Thêm text từ OCR vào trang mới
            const font = await outputPdf.embedFont('Times-Roman');
            newPage.drawText(text, {
                x: 10,
                y: dimensions.height - 10,
                size: 12,
                font: font,
                color: rgb(0, 0, 0)
            });
        }
        
        // Giải phóng worker
        await worker.terminate();
        
        // Lưu PDF đầu ra
        const pdfBytes = await outputPdf.save();
        fs.writeFileSync(outputPdfPath, pdfBytes);
        
        console.log(`Đã chuyển đổi thành công! File OCR được lưu tại: ${outputPdfPath}`);
        
        // Xóa thư mục tạm
        fs.rmdirSync(tempDir, { recursive: true });
    } catch (error) {
        console.error('Lỗi trong quá trình chuyển đổi:', error);
    }
}

// Hàm lấy kích thước hình ảnh
async function getImageDimensions(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        return {
            width: image.getWidth(),
            height: image.getHeight()
        };
    } catch (err) {
        console.warn('Không thể đọc kích thước hình ảnh:', err.message);
        // Trả về kích thước mặc định A4
        return { width: 595, height: 842 };
    }
}

convertPdfToOcr(); 