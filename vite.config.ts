import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'seo/sitemap.xml', 'seo/robots.txt', 'seo/README.md', 'LICENSE', 'seo/manifest.json', 'lang-data/*.traineddata'],
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