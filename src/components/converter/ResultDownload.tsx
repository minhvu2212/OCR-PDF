import { Download, Check, Eye } from 'lucide-react';
import { Button } from '../ui/button';

interface ResultDownloadProps {
  blob: Blob;
  fileName: string;
  title?: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

export default function ResultDownload({
  blob,
  fileName,
  title = 'Chuyển đổi hoàn tất!',
  description = 'PDF của bạn đã được chuyển đổi thành định dạng có thể tìm kiếm.',
  variant = 'primary',
}: ResultDownloadProps) {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openPreview = () => {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  const getBackgroundColor = () => {
    return variant === 'primary' ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100';
  };

  const getIconBackgroundColor = () => {
    return variant === 'primary' ? 'bg-green-100' : 'bg-blue-100';
  };

  const getIconColor = () => {
    return variant === 'primary' ? 'text-green-600' : 'text-blue-600';
  };

  const getPrimaryButtonColor = () => {
    return variant === 'primary'
      ? 'bg-green-600 hover:bg-green-700'
      : 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <div className={`${getBackgroundColor()} border rounded-lg p-6 text-center`}>
      <div
        className={`inline-flex items-center justify-center p-3 ${getIconBackgroundColor()} rounded-full mb-4`}
      >
        <Check className={`h-8 w-8 ${getIconColor()}`} />
      </div>

      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button
          onClick={handleDownload}
          className={`flex items-center justify-center ${getPrimaryButtonColor()}`}
        >
          <Download className="h-5 w-5 mr-2" />
          Tải xuống PDF
        </Button>

        <Button
          onClick={openPreview}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Eye className="h-5 w-5 mr-2" />
          Xem trước
        </Button>
      </div>
    </div>
  );
}
