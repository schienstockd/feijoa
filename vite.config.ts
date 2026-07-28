import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  return {
    plugins: [vue()],
    // public/ holds the site favicon only — keep it out of the library build's dist.
    publicDir: isLib ? false : 'public',
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/lib/index.ts'),
            name: 'Feijoa',
            fileName: () => 'feijoa.js',
            formats: ['es'],
          },
          rollupOptions: {
            external: ['vue'],
            output: { globals: { vue: 'Vue' }, assetFileNames: 'feijoa.[ext]' },
          },
          sourcemap: true,
          emptyOutDir: true,
        }
      : {
          outDir: 'dist-site',
          sourcemap: true,
        },
  }
})
