import { Link } from 'react-router-dom';
import { Seo } from '../components/seo/Seo';
import { Button } from '../components/ui/button';
import { FileSearch, Lock, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <FileSearch className="h-8 w-8 text-blue-500" />,
      title: 'Tìm kiếm trong PDF',
      description:
        'Chuyển đổi PDF scan thành dạng có thể tìm kiếm để dễ dàng tìm kiếm và sao chép nội dung.',
    },
    {
      icon: <Lock className="h-8 w-8 text-blue-500" />,
      title: 'An toàn & riêng tư',
      description:
        'Tất cả quá trình xử lý diễn ra ngay trên trình duyệt của bạn, không cần tải lên máy chủ.',
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: 'Tốc độ nhanh',
      description: 'Xử lý OCR hiệu quả với thuật toán tối ưu, cho kết quả nhanh chóng.',
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Hỗ trợ đa ngôn ngữ',
      description:
        'Nhận dạng văn bản bằng nhiều ngôn ngữ, bao gồm Tiếng Việt, Anh, và nhiều ngôn ngữ khác.',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Tải PDF lên',
      description: 'Kéo thả hoặc chọn file PDF dạng ảnh cần chuyển đổi.',
    },
    {
      number: 2,
      title: 'Chọn ngôn ngữ',
      description: 'Chọn ngôn ngữ văn bản trong PDF để tăng độ chính xác của OCR.',
    },
    {
      number: 3,
      title: 'Bắt đầu chuyển đổi',
      description: 'Nhấn nút chuyển đổi và chờ quá trình OCR hoàn tất.',
    },
    {
      number: 4,
      title: 'Tải xuống kết quả',
      description: 'Tải xuống PDF mới có thể tìm kiếm và sao chép văn bản.',
    },
  ];

  return (
    <>
      <Seo />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Công cụ OCR miễn phí, hoạt động ngay trên trình duyệt của bạn, không cần tải lên máy
            chủ.
          </p>
          <Link to="/app">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Bắt đầu ngay
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 rounded-xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Công cụ hiện đại giúp bạn chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm một cách dễ
              dàng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-transform hover:translate-y-[-5px]"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Cách sử dụng</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chỉ với vài bước đơn giản để chuyển đổi PDF scan thành PDF có thể tìm kiếm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-blue-200 -z-10 transform -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-50 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Bắt đầu chuyển đổi PDF ngay hôm nay</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Không cần đăng ký tài khoản, miễn phí 100% và bảo mật tuyệt đối
          </p>
          <Link to="/app">
            <Button size="lg">Chuyển đổi PDF ngay</Button>
          </Link>
        </section>
      </div>
    </>
  );
}
