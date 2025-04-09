import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { FileUp, X } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isProcessing: boolean;
}

export default function FileUploader({
  file,
  onFileChange,
  isProcessing
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  
  // Xử lý kéo thả file
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  // Xử lý khi thả file
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isProcessing) {
      const uploadedFile = e.dataTransfer.files[0];
      validateAndSetFile(uploadedFile);
    }
  }, [isProcessing]);
  
  // Xử lý khi chọn file qua input
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isProcessing) {
      const uploadedFile = e.target.files[0];
      validateAndSetFile(uploadedFile);
    }
  }, [isProcessing]);
  
  // Kiểm tra và thiết lập file
  const validateAndSetFile = (uploadedFile: File) => {
    if (uploadedFile.type !== 'application/pdf') {
      alert('Chỉ chấp nhận file PDF. Vui lòng chọn lại.');
      return;
    }
    
    if (uploadedFile.size > 50 * 1024 * 1024) { // 50MB limit
      alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 50MB.');
      return;
    }
    
    onFileChange(uploadedFile);
  };
  
  // Xóa file đã chọn
  const handleRemoveFile = useCallback(() => {
    if (!isProcessing) {
      onFileChange(null);
    }
  }, [isProcessing, onFileChange]);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <FileUp className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">Kéo và thả file PDF vào đây</h3>
            <p className="text-gray-500 mb-4">Hoặc nhấp để chọn file từ máy tính</p>
            <Button
              type="button"
              disabled={isProcessing}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Chọn file PDF
            </Button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-400 mt-3">
              Tối đa 50MB. Chỉ chấp nhận file PDF.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-3">
              <FileUp className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          {!isProcessing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 