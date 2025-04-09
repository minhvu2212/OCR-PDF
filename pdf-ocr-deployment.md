# Hướng dẫn triển khai ứng dụng PDF OCR cho môi trường sản xuất

## Mục lục

1. [Chuẩn bị môi trường triển khai](#chuẩn-bị-môi-trường-triển-khai)
2. [Tối ưu hóa trước khi triển khai](#tối-ưu-hóa-trước-khi-triển-khai)
3. [Triển khai lên các nền tảng hosting](#triển-khai-lên-các-nền-tảng-hosting)
4. [Cấu hình CDN và caching](#cấu-hình-cdn-và-caching)
5. [Giám sát và phân tích hiệu suất](#giám-sát-và-phân-tích-hiệu-suất)
6. [Bảo mật ứng dụng](#bảo-mật-ứng-dụng)
7. [Quy trình cập nhật và bảo trì](#quy-trình-cập-nhật-và-bảo-trì)

## Chuẩn bị môi trường triển khai

### Yêu cầu hệ thống

- **Node.js**: v18.0.0 hoặc cao hơn
- **NPM**: v8.0.0 hoặc cao hơn
- **Dung lượng lưu trữ**: Tối thiểu 500MB (bao gồm cả dữ liệu ngôn ngữ cho OCR)

### Cài đặt các dependencies

```bash
# Cài đặt dependencies sản xuất
npm install --production

# Hoặc với Yarn
yarn install --production
```

### Biến môi trường

Tạo file `.env.production` với các cấu hình sau:

```
# Cấu hình chung
VITE_APP_NAME=PDF OCR
VITE_APP_URL=https://your-domain.com

# Cấu hình Analytics (tùy chọn)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Cấu hình caching
VITE_CACHE_VERSION=1.0.0
```

## Tối ưu hóa trước khi triển khai

### 1. Tối ưu build

```bash
# Build sản phẩm với tối ưu hóa
npm run build

# Hoặc với các tùy chọn bổ sung
npm run build -- --mode production
```

### 2. Tối ưu các thư viện OCR

Để giảm kích thước bundle và cải thiện hiệu suất tải, hãy tùy chỉnh dữ liệu ngôn ngữ Tesseract:

1. Chỉ giữ lại các file dữ liệu ngôn ngữ cần thiết trong thư mục `public/lang-data/`
2. Sử dụng phiên bản nhẹ của các model (best hoặc fast thay vì standard)

```bash
# Tải các file ngôn ngữ tối ưu hóa
npx tesseract-downloader --prefix=public/lang-data --type=best vie eng fra
```

### 3. Code splitting và Lazy loading

Cập nhật cấu hình Vite để tối ưu hóa bundle:

```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        tesseract: ['tesseract.js'],
        pdfjs: ['pdfjs-dist'],
        pdflib: ['pdf-lib'],
        react: ['react', 'react-dom'],
        router: ['react-router-dom']
      }
    }
  },
  chunkSizeWarningLimit: 1600,
  sourcemap: false
}
```

### 4. Tối ưu hóa assets

```bash
# Nén hình ảnh
npx imagemin-cli "public/images/**/*.{jpg,png}" --out-dir=public/images/optimized

# Tạo WebP versions
npx imagemin-webp "public/images/**/*.{jpg,png}" -o public/images/webp
```

## Triển khai lên các nền tảng hosting

### 1. Triển khai lên Vercel

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Đăng nhập và triển khai
vercel login
vercel
```

Tạo file `vercel.json` với cấu hình sau:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/lang-data/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Triển khai lên Netlify

Tạo file `netlify.toml` với cấu hình sau:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/lang-data/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    
[[headers]]
  for = "/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
```

Sau đó triển khai:

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Đăng nhập và triển khai
netlify login
netlify deploy --prod
```

### 3. Triển khai lên Firebase Hosting

```bash
# Cài đặt Firebase CLI
npm install -g firebase-tools

# Đăng nhập và khởi tạo
firebase login
firebase init hosting

# Triển khai
firebase deploy --only hosting
```

Tạo file `firebase.json` với cấu hình sau:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/lang-data/**",
        "headers": [
          {
            "key": "Cache-Control", 
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.wasm",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/wasm"
          }
        ]
      }
    ]
  }
}
```

## Cấu hình CDN và caching

### 1. Cấu hình CloudFlare

Đối với các tài nguyên tĩnh và các file ngôn ngữ OCR, thiết lập caching rules trên CloudFlare:

- **Page Rules**:
  - URL pattern: `*your-domain.com/assets/*`
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  
- **Worker Script** để đảm bảo đúng MIME type cho các file WASM:

```js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Lấy response gốc
  let response = await fetch(request)
  
  // Chuẩn hóa URL
  const url = new URL(request.url)
  
  // Xử lý WASM files
  if (url.pathname.endsWith('.wasm')) {
    let newHeaders = new Headers(response.headers)
    newHeaders.set('Content-Type', 'application/wasm')
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
  }
  
  return response
}
```

### 2. Precaching với Service Worker

Sửa đổi cấu hình PWA trong `vite.config.ts` để precache các tài nguyên quan trọng:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: [
      '**/*.{js,css,html,ico,png,svg,woff2}',
      'lang-data/vie.traineddata',
      'lang-data/eng.traineddata'
    ],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'external-libs',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          }
        }
      },
      {
        urlPattern: /\/lang-data\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'ocr-models',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
})
```

## Giám sát và phân tích hiệu suất

### 1. Tích hợp Google Analytics

Thêm vào `index.html`:

```html
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%VITE_GA_MEASUREMENT_ID%');
</script>
```

### 2. Giám sát hiệu suất với Sentry

```bash
# Cài đặt Sentry
npm install @sentry/react @sentry/tracing
```

Thêm vào `main.tsx`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.2,
  });
}
```

### 3. Lighthouse CI

Thiết lập Lighthouse CI để tự động đánh giá hiệu suất:

```bash
# Cài đặt Lighthouse CI
npm install -g @lhci/cli

# Chạy audit
lhci autorun
```

Tạo file `lighthouserc.js`:

```js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'service-worker': 'on',
        'offline-start-url': 'on',
      },
    },
  },
};
```

## Bảo mật ứng dụng

### 1. Cài đặt HTTP Security Headers

Thêm các headers bảo mật vào cấu hình server:

```
# Content-Security-Policy
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://www.google-analytics.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self'; worker-src 'self' blob:; frame-ancestors 'none';

# Các headers bảo mật khác
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 2. Quét mã độc tự động

Thiết lập quét bảo mật tự động với GitHub Actions:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Chạy hàng tuần vào Chủ nhật

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Quét dependencies
        run: |
          npm audit
          
      - name: Quét code với CodeQL
        uses: github/codeql-action/analyze@v2
        with:
          languages: javascript
```

## Quy trình cập nhật và bảo trì

### 1. Cập nhật dependencies

Thiết lập lịch trình cập nhật thường xuyên:

```bash
# Kiểm tra dependencies lỗi thời
npm outdated

# Cập nhật dependencies
npm update

# Kiểm tra các lỗ hổng
npm audit

# Sửa các lỗ hổng bảo mật
npm audit fix
```

### 2. Cập nhật dữ liệu OCR

Tạo quy trình cập nhật dữ liệu OCR:

```bash
# Tạo thư mục script
mkdir -p scripts

# Tạo script cập nhật
cat > scripts/update-ocr-data.sh << 'EOF'
#!/bin/bash
OCR_DATA_DIR="public/lang-data"
TMP_DIR="tmp_ocr_data"

# Tạo thư mục tạm
mkdir -p $TMP_DIR

# Tải data mới
echo "Đang tải dữ liệu OCR mới..."
curl -s -L https://github.com/tesseract-ocr/tessdata_best/raw/main/vie.traineddata -o "$TMP_DIR/vie.traineddata"
curl -s -L https://github.com/tesseract-ocr/tessdata_best/raw/main/eng.traineddata -o "$TMP_DIR/eng.traineddata"
# Thêm các ngôn ngữ khác nếu cần

# Kiểm tra tính toàn vẹn của file
echo "Kiểm tra tính toàn vẹn..."
for file in "$TMP_DIR"/*.traineddata; do
  filename=$(basename "$file")
  if [ ! -s "$file" ]; then
    echo "Lỗi: $filename trống hoặc không tải được"
    exit 1
  fi
done

# Di chuyển dữ liệu mới vào thư mục chính
mkdir -p $OCR_DATA_DIR
mv $TMP_DIR/* $OCR_DATA_DIR/

# Dọn dẹp
rm -rf $TMP_DIR
echo "Cập nhật dữ liệu OCR thành công!"
EOF

# Cấp quyền thực thi
chmod +x scripts/update-ocr-data.sh
```

### 3. Tự động hóa triển khai với GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 4. Kiểm soát phiên bản

Tự động tăng phiên bản khi phát hành:

```yaml
# .github/workflows/versioning.yml
name: Update Version

on:
  workflow_dispatch:
    inputs:
      version_type:
        description: 'Type of version bump (patch|minor|major)'
        required: true
        default: 'patch'

jobs:
  bump-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          token: ${{ secrets.GH_PAT }}
          
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Bump version
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          npm version ${{ github.event.inputs.version_type }} -m "Bump version to %s"
          git push
          git push --tags
```

---

Tài liệu này cung cấp hướng dẫn chi tiết về cách triển khai ứng dụng PDF OCR cho môi trường sản xuất trên các nền tảng phổ biến. Các bước tối ưu hóa và cấu hình được đề xuất giúp ứng dụng đạt hiệu suất cao, an toàn, và dễ dàng bảo trì.