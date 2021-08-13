import { readFileSync } from 'fs'

import { defineConfig } from 'vite'
import yaml from 'js-yaml'
import reactRefresh from '@vitejs/plugin-react-refresh'
import pluginYaml from '@rollup/plugin-yaml'

const config = yaml.load(readFileSync('config.yaml', 'utf-8'))

export default defineConfig({
  root: 'frontend',
  server: {
    port: config.devport,
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
    pluginYaml()
  ]
})
