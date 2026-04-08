import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import pluginQuery from '@tanstack/eslint-plugin-query'

// https://vite.dev/config/
export default defineConfig({
  ...pluginQuery,
  plugins: [react(), tailwindcss()],
})
