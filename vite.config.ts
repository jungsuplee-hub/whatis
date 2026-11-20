import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], root: 'site', publicDir: '../public', base: '/whatis/', build: { outDir: '../dist', emptyOutDir: true } })
