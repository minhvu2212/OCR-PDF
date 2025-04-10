import { Helmet } from 'react-helmet-async';

export const SchemaMarkup = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm',
    url: 'https://www.pdf-ocr-app.com',
    description:
      'Công cụ miễn phí chuyển đổi PDF dạng scan, ảnh sang PDF có thể tìm kiếm, sao chép. Hỗ trợ tiếng Việt.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '156',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
