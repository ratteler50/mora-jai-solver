import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node', // Use node for pure logic tests
    setupFiles: ['./src/test/setup.ts'],
  },
})