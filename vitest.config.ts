import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Use jsdom for React component tests
    setupFiles: ['./src/test/setup.ts'],
    globals: true, // Enable global test functions
  },
})