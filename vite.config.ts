import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(
    {
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{html,js,css,png,json}']
      },
    }
  )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for faster loading
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Better chunking for caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['sonner']
        }
      }
    }
  }
})
