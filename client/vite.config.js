import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuração do Vite
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
