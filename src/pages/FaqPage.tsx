import { Seo } from '../components/seo/Seo';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'privacy';
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FaqItem[] = [
    {
      question: 'PDF OCR là gì?',
      answer: 'PDF OCR là công cụ chuyển đổi PDF dạng ảnh (scan, chụp) thành PDF có thể tìm kiếm và sao chép văn bản. Công cụ sử dụng công nghệ OCR (Optical Character Recognition) để nhận dạng văn bản trong hình ảnh.',
      category: 'general'
    },
    {
      question: 'Tôi có cần đăng ký tài khoản để sử dụng PDF OCR không?',
      answer: 'Không, bạn không cần đăng ký tài khoản để sử dụng PDF OCR. Công cụ hoàn toàn miễn phí và có thể sử dụng ngay trên trình duyệt web.',
      category: 'general'
    },
    {
      question: 'PDF OCR có hỗ trợ tiếng Việt không?',
      answer: 'Có, PDF OCR hỗ trợ đầy đủ tiếng Việt và nhiều ngôn ngữ khác như tiếng Anh, Pháp, Đức, Nhật, Trung, v.v. Bạn có thể chọn ngôn ngữ phù hợp với nội dung của tài liệu để tăng độ chính xác của OCR.',
      category: 'technical'
    },
    {
      question: 'Kích thước file PDF tối đa có thể xử lý là bao nhiêu?',
      answer: 'Công cụ PDF OCR có thể xử lý các file PDF với kích thước lên đến 50MB. Tuy nhiên, thời gian xử lý sẽ phụ thuộc vào kích thước file và hiệu suất của thiết bị bạn đang sử dụng.',
      category: 'technical'
    },
    {
      question: 'PDF OCR có an toàn không? Dữ liệu của tôi có bị chia sẻ?',
      answer: 'PDF OCR hoạt động hoàn toàn trên trình duyệt của bạn, không có dữ liệu nào được tải lên máy chủ. Điều này đảm bảo tính riêng tư và bảo mật tuyệt đối cho tài liệu của bạn.',
      category: 'privacy'
    },
    {
      question: 'Tôi có thể dùng PDF OCR trên điện thoại di động không?',
      answer: 'Có, PDF OCR có giao diện thích ứng và hoạt động tốt trên điện thoại di động và máy tính bảng. Tuy nhiên, quá trình xử lý OCR có thể mất nhiều thời gian hơn trên thiết bị di động do giới hạn về hiệu suất.',
      category: 'general'
    },
    {
      question: 'Độ chính xác của OCR như thế nào?',
      answer: 'Độ chính xác của OCR phụ thuộc vào nhiều yếu tố như chất lượng của file PDF gốc, độ phân giải, độ tương phản và độ phức tạp của font chữ. Với các tài liệu scan chất lượng tốt, độ chính xác có thể đạt trên 95%. Bạn có thể chọn chế độ chất lượng cao để cải thiện kết quả nhận dạng.',
      category: 'technical'
    },
    {
      question: 'Tôi có thể sử dụng PDF OCR cho mục đích thương mại không?',
      answer: 'Có, bạn có thể sử dụng PDF OCR cho cả mục đích cá nhân và thương mại mà không mất phí. Tuy nhiên, chúng tôi không chịu trách nhiệm về kết quả OCR cuối cùng hoặc bất kỳ quyết định nào dựa trên kết quả này.',
      category: 'general'
    }
  ];

  const generalFaqs = faqs.filter(faq => faq.category === 'general');
  const technicalFaqs = faqs.filter(faq => faq.category === 'technical');
  const privacyFaqs = faqs.filter(faq => faq.category === 'privacy');

  const renderFaqSection = (items: FaqItem[], startIndex: number, title: string) => (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="space-y-4">
        {items.map((faq, idx) => {
          const index = startIndex + idx;
          return (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center bg-white p-5 text-left"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <Seo 
        title="Câu hỏi thường gặp - PDF OCR" 
        description="Các câu hỏi thường gặp và trả lời về công cụ chuyển đổi PDF OCR miễn phí." 
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <HelpCircle className="h-10 w-10 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold">Câu hỏi thường gặp</h1>
          </div>
          
          <p className="text-center text-lg text-gray-600 mb-12">
            Tìm câu trả lời cho các câu hỏi phổ biến về công cụ chuyển đổi PDF OCR
          </p>
          
          {renderFaqSection(generalFaqs, 0, "Câu hỏi chung")}
          {renderFaqSection(technicalFaqs, generalFaqs.length, "Câu hỏi kỹ thuật")}
          {renderFaqSection(privacyFaqs, generalFaqs.length + technicalFaqs.length, "Quyền riêng tư & Bảo mật")}
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-12 text-center">
            <h2 className="text-xl font-semibold mb-3">Bạn vẫn còn thắc mắc?</h2>
            <p className="mb-4">Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với chúng tôi.</p>
            <a 
              href="mailto:contact@pdf-ocr-app.com" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 