// Cấu trúc thư mục và file chính cho dự án PDF OCR

// 1. Cấu trúc dự án
/**
pdf-ocr-app/
├── public/                  # Tài nguyên tĩnh
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── lang-data/           # Dữ liệu ngôn ngữ Tesseract
│   │   ├── vie.traineddata
│   │   └── eng.traineddata
│   └── images/              # Hình ảnh
│       ├── logo.svg
│       └── screenshots/
├── src/
│   ├── assets/              # Tài nguyên được import trong mã nguồn
│   │   ├── icons/
│   │   └── styles/
│   ├── components/          # React components
│   │   ├── landing/         # Landing page components
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   └── ...
│   │   ├── converter/       # OCR converter components
│   │   │   ├── FileUploader.tsx
│   │   │   ├── ConversionSettings.tsx 
│   │   │   └── ...
│   │   ├── shared/          # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   └── ui/              # UI components (shadcn/ui)
│   │       ├── button.tsx
│   │       └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useOcr.ts
│   │   ├── usePdfProcessing.ts
│   │   └── ...
│   ├── lib/                 # Utilities và business logic
│   │   ├── ocr/             # OCR processing 
│   │   │   ├── ocrService.ts
│   │   │   └── ...
│   │   ├── pdf/             # PDF processing
│   │   │   ├── pdfReader.ts
│   │   │   ├── pdfCreator.ts
│   │   │   └── ...
│   │   ├── seo/             # SEO utilities
│   │   │   ├── SchemaMarkup.tsx
│   │   │   └── ...
│   │   └── utils.ts         # General utilities
│   ├── workers/             # Web Workers
│   │   └── ocrWorker.ts     # OCR worker
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── AppPage.tsx
│   │   ├── GuidePage.tsx
│   │   └── ...
│   ├── types/               # TypeScript types và interfaces
│   │   ├── pdf.types.ts
│   │   ├── ocr.types.ts
│   │   └── ...
│   ├── config/              # Cấu hình ứng dụng
│   │   ├── constants.ts
│   │   └── ...
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts
├── .env                     # Environment variables cho development
├── .env.production          # Environment variables cho production
├── index.html               # HTML entry với SEO tags
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind CSS config
├── package.json
└── README.md
**/

// 2. File cấu hình TypeScript (tsconfig.json)
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client", "vite-plugin-pwa/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

// 3. File cấu hình Vite (vite.config.ts)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'lang-data/*.traineddata'],
      manifest: {
        name: 'PDF OCR - Chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm',
        short_name: 'PDF OCR',
        description: 'Công cụ miễn phí chuyển đổi PDF dạng ảnh thành PDF có thể tìm kiếm',
        theme_color: '#3498db',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
            urlPattern: /\/lang-data\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ocr-models',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['pdf-lib', 'tesseract.js', 'pdfjs-dist'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tesseract: ['tesseract.js'],
          pdfjs: ['pdfjs-dist'],
          pdflib: ['pdf-lib'],
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});

// 4. File cấu hình Tailwind CSS (tailwind.config.js)
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(