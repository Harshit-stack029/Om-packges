import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { compression } from 'vite-plugin-compression2';

// Hostinger deploys to public_html/ompack/ on disk. URL path depends on the
// mapping:
//   • subdomain (ompack.rhobel.com → public_html/ompack/)  →  base '/'  (default)
//   • main domain at /ompack/                              →  base '/ompack/'
// Override at build time: `VITE_BASE=/ompack/ npm run build`
export default defineConfig(({ command }) => ({
  base: process.env.VITE_BASE ?? '/',

  plugins: [
    react(),
    tailwindcss(),
    compression({ algorithm: 'gzip', exclude: [/\.(br|gz)$/, /\.(png|jpe?g|webp|avif|woff2?)$/i] }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(br|gz)$/, /\.(png|jpe?g|webp|avif|woff2?)$/i] }),
  ],

  server: {
    port: 5173,
    proxy: {
      '/api': { target: `http://localhost:${process.env.VITE_PROXY_PORT || 5001}`, changeOrigin: true },
    },
  },

  // Strip console.* and debugger from production bundles (no-op in dev).
  esbuild: command === 'build' ? { drop: ['console', 'debugger'] } : {},

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('react-router') || id.includes('history')) return 'router';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('swiper')) return 'swiper';
          if (id.includes('yet-another-react-lightbox')) return 'lightbox';
          if (id.includes('react-hook-form') || id.includes('yup') || id.includes('@hookform')) return 'forms';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('@dnd-kit')) return 'dndkit';
          if (id.includes('axios')) return 'axios';
          if (id.includes('react') || id.includes('scheduler')) return 'react';
          return 'vendor';
        },
      },
    },
  },
}));
