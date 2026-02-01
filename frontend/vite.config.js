import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If we're running on Vercel, use '/', otherwise use '/multi-links/' for GitHub Pages
  base: process.env.VERCEL ? '/' : '/multi-links/',
})