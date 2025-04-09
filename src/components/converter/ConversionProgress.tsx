import { ConversionProgress as Progress } from '../../types/pdf.types';

interface ConversionProgressProps {
  progress: Progress;
}

export default function ConversionProgress({ progress }: ConversionProgressProps) {
  const getStageLabel = () => {
    switch (progress.stage) {
      case 'extracting':
        return 'Đang trích xuất trang từ PDF';
      case 'ocr':
        return progress.page && progress.totalPages
          ? `Đang nhận dạng văn bản (Trang ${progress.page}/${progress.totalPages})`
          : 'Đang nhận dạng văn bản';
      case 'creating':
        return 'Đang tạo PDF có thể tìm kiếm';
      case 'complete':
        return 'Hoàn tất';
      default:
        return 'Đang xử lý';
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{getStageLabel()}</span>
        <span className="text-sm text-gray-500">{Math.round(progress.percent)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${Math.max(5, progress.percent)}%` }}
        />
      </div>
      
      {progress.status && (
        <p className="text-xs text-gray-500 mt-2">{progress.status}</p>
      )}
    </div>
  );
} 