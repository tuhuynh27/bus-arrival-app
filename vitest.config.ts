import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'virtual:pwa-register/react': path.resolve(__dirname, 'src/__mocks__/pwa-register-react.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    tsconfig: './tsconfig.vitest.json',
  },
})
