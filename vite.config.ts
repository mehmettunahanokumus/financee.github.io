import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths work on GitHub Pages
  define: {
    // Safely replace process.env to avoid runtime crashes in the browser
    // If you add a .env file later, Vite will handle VITE_ variables automatically via import.meta.env
    'process.env': {} 
  }
})