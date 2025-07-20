import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  base: './', // Use relative paths for GitHub Pages
})
