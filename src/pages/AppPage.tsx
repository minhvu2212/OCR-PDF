import { useState, useCallback } from 'react';
import { Seo } from '../components/seo/Seo';
import FileUploader from '../components/converter/FileUploader';
import ConversionSettings from '../components/converter/ConversionSettings';
import ConversionProgress from '../components/converter/ConversionProgress';
import ResultDownload from '../components/converter/ResultDownload';
import { PdfOcrService } from '../lib/pdf/pdfOcrService';
import { ConversionProgress as Progress } from '../types/pdf.types';
import { OcrOptions } from '../types/ocr.types';
import { useToast } from '../hooks/useToast';

export default function AppPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [resultBlobs, setResultBlobs] = useState<{
    searchablePdf: Blob | null;
    textOnlyPdf: Blob | null;
  }>({ searchablePdf: null, textOnlyPdf: null });
  const [options, setOptions] = useState<OcrOptions>({
    language: 'vie',
    quality: 'medium'
  });
  
  const { toast } = useToast();
  const pdfOcrService = new PdfOcrService();
  
  const handleFileChange = useCallback((file: File | null) => {
    setFile(file);
    setResultBlobs({ searchablePdf: null, textOnlyPdf: null });
  }, []);
  
  const handleOptionChange = useCallback((newOptions: Partial<OcrOptions>) => {
    setOptions((prev: OcrOptions) => ({ ...prev, ...newOptions }));
  }, []);
  
  const startConversion = useCallback(async () => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(null);
      setResultBlobs({ searchablePdf: null, textOnlyPdf: null });
      
      const result = await pdfOcrService.convertPdfToSearchable(
        file,
        options,
        setProgress
      );
      
      setResultBlobs({
        searchablePdf: result.searchablePdf,
        textOnlyPdf: result.textOnlyPdf
      });
      
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
          
          {file && !resultBlobs.searchablePdf && !isProcessing && (
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
          
          {resultBlobs.searchablePdf && (
            <div className="space-y-6">
              <ResultDownload
                blob={resultBlobs.searchablePdf}
                fileName={file ? `searchable_${file.name}` : 'searchable_document.pdf'}
                title="PDF Có thể tìm kiếm"
                description="PDF gốc với lớp văn bản ẩn hỗ trợ tìm kiếm và sao chép."
              />
              
              {resultBlobs.textOnlyPdf && (
                <ResultDownload
                  blob={resultBlobs.textOnlyPdf}
                  fileName={file ? `text_only_${file.name}` : 'text_only_document.pdf'}
                  title="PDF Chỉ văn bản"
                  description="PDF chỉ chứa văn bản OCR để kiểm tra kết quả nhận dạng."
                  variant="secondary"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 