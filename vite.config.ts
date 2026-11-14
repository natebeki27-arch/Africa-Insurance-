import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'aic-favicon.ico',
          'aic-favicon-32.png',
          'aic-favicon-64.png',
          'favicon.ico',
          'favicon.png',
          'favicon-32x32.png',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
          'assets/opt/aic_logo-240w.webp',
          'assets/opt/aic_logo-240w.jpg'
        ],
        manifest: {
          id: '/',
          name: 'Africa Insurance Company (AIC)',
          short_name: 'AIC Portal',
          description:
            'Digital insurance platform for Africa Insurance Company S.C., Ethiopia. Manage policies, quotes, claims, and verify coverage anywhere.',
          theme_color: '#12366e',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          ignoreURLParametersMatching: [/^v$/],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          globIgnores: ['**/assets/*.mp4', '**/assets/*.webm', '**/assets/*.gif', '**/assets/*.jpg', '**/assets/opt/*', '**/assets/aistudio/**'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/__/, /^\/api/, /firebaseapp\.com/, /googleapis\.com/],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/(identitytoolkit|securetoken|firestore)\.googleapis\.com\/.*/i,
              handler: 'NetworkOnly'
            },
            {
              urlPattern: /^https:\/\/(accounts|apis)\.google\.com\/.*/i,
              handler: 'NetworkOnly'
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'aic-google-fonts-stylesheets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'aic-google-fonts-webfonts',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\/assets\/.*\.(?:jpg|jpeg|png|svg|webp)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'aic-static-images-v3',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.')
      }
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/@firebase/auth') || id.includes('node_modules/firebase/auth')) {
              return 'firebase-auth-vendor';
            }
            if (
              id.includes('node_modules/@firebase/firestore') ||
              id.includes('node_modules/firebase/firestore')
            ) {
              return 'firebase-firestore-vendor';
            }
            if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
              return 'firebase-core-vendor';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons-vendor';
            }
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {}
    }
  };
});
