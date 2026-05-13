import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx'
    })
  ],
  build: {
    target: 'node20',
    lib: {
      entry: 'src/index.tsx',
      name: 'app',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames: '_worker.js'
      }
    }
  }
})
