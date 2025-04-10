import { Seo } from '../components/seo/Seo';
import { Lightbulb, FileUp, Type, Play, Download, BookOpen } from 'lucide-react';

export default function GuidePage() {
  const guideSteps = [
    {
      icon: <FileUp className="h-6 w-6 text-blue-500" />,
      title: 'Bước 1: Tải PDF lên',
      content:
        'Vào trang Chuyển đổi, bạn có thể kéo thả file PDF hoặc nhấp vào khu vực tải lên để chọn file từ máy tính. Chỉ chấp nhận file định dạng PDF.',
    },
    {
      icon: <Type className="h-6 w-6 text-blue-500" />,
      title: 'Bước 2: Chọn ngôn ngữ và thiết lập',
      content:
        'Sau khi tải file lên, chọn ngôn ngữ chính có trong tài liệu PDF của bạn. Việc chọn đúng ngôn ngữ sẽ cải thiện đáng kể độ chính xác của OCR. Bạn cũng có thể điều chỉnh chất lượng OCR, tùy chọn cao hơn sẽ chính xác hơn nhưng mất nhiều thời gian xử lý hơn.',
    },
    {
      icon: <Play className="h-6 w-6 text-blue-500" />,
      title: 'Bước 3: Bắt đầu chuyển đổi',
      content:
        'Nhấn nút "Bắt đầu chuyển đổi" để khởi động quá trình OCR. Toàn bộ quá trình xử lý diễn ra ngay trên trình duyệt web của bạn, không có dữ liệu nào được tải lên máy chủ. Thời gian xử lý phụ thuộc vào kích thước của file PDF và hiệu suất của thiết bị bạn đang sử dụng.',
    },
    {
      icon: <Download className="h-6 w-6 text-blue-500" />,
      title: 'Bước 4: Tải xuống kết quả',
      content:
        'Sau khi quá trình chuyển đổi hoàn tất, bạn có thể tải xuống PDF mới có thể tìm kiếm và sao chép văn bản. Bạn cũng có thể xem trước kết quả trước khi tải xuống.',
    },
  ];

  const tips = [
    {
      title: 'Chọn đúng ngôn ngữ',
      content:
        'Việc chọn đúng ngôn ngữ trong tài liệu của bạn sẽ cải thiện đáng kể độ chính xác của OCR.',
    },
    {
      title: 'Tối ưu chất lượng ảnh',
      content:
        'OCR hoạt động tốt nhất với các tài liệu scan có độ phân giải cao và độ tương phản tốt. Nếu có thể, hãy đảm bảo PDF của bạn có chất lượng cao.',
    },
    {
      title: 'Xử lý nhiều ngôn ngữ',
      content:
        'Nếu tài liệu của bạn chứa nhiều ngôn ngữ, bạn có thể chọn chế độ "Tiếng Việt + Tiếng Anh" hoặc thử chuyển đổi với từng ngôn ngữ riêng biệt.',
    },
    {
      title: 'Kiểm tra kết quả',
      content:
        'Luôn kiểm tra kết quả sau khi chuyển đổi, đặc biệt là với tài liệu quan trọng. OCR không phải lúc nào cũng hoàn hảo 100%.',
    },
  ];

  return (
    <>
      <Seo
        title="Hướng dẫn sử dụng - PDF OCR"
        description="Hướng dẫn chi tiết cách chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm với công cụ PDF OCR miễn phí."
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Hướng dẫn sử dụng PDF OCR</h1>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-blue-500" />
              Hướng dẫn từng bước
            </h2>

            <div className="space-y-8">
              {guideSteps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="bg-blue-100 p-2 rounded-full">{step.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-100 p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-yellow-500" />
              Mẹo và thủ thuật
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-medium mb-2">{tip.title}</h3>
                  <p className="text-gray-600">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
