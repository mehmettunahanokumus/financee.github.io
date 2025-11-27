import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths work on GitHub Pages
  define: {
    // Load environment variables from .env file
    // NOTE: You must create a .env file with VITE_API_KEY=your_key and map it here, 
    // or manually replace this string for the build.
    'process.env.API_KEY': JSON.stringify(process.env.VITE_API_KEY) 
  }
})