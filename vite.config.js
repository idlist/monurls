import { readFileSync } from 'fs'

import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  root: 'frontend',
  server: {
    port: 16666,
    host: '0.0.0.0',
    https: {
      key: readFileSync('./ssl/localhost.key'),
      cert: readFileSync('./ssl/localhost.crt')
    }
  },
  build: {
    brotliSize: false
  },
  plugins: [
    reactRefresh(),
    yaml()
  ]
})
