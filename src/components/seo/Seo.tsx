import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export function Seo({
  title = 'PDF OCR - Chuyển đổi PDF dạng ảnh thành PDF có thể tìm kiếm',
  description = 'Công cụ miễn phí chuyển đổi PDF dạng ảnh thành PDF có thể tìm kiếm và sao chép, hoạt động hoàn toàn trên trình duyệt.',
  canonical = 'https://pdf-ocr-app.com'
}: SeoProps) {
  const siteTitle = title.includes('PDF OCR') ? title : `${title} - PDF OCR`;
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://pdf-ocr-app.com/images/og-image.png" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="https://pdf-ocr-app.com/images/og-image.png" />
    </Helmet>
  );
} 