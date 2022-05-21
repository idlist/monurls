import { readFileSync } from 'fs'

import { defineConfig } from 'vite'
import yaml from 'js-yaml'
import reactRefresh from '@vitejs/plugin-react-refresh'
import pluginYaml from '@rollup/plugin-yaml'

interface UserConfig {
  devport: number
}

const config = yaml.load(readFileSync('config.yaml', 'utf-8')) as UserConfig

export default defineConfig({
  root: 'frontend',
  server: {
    port: config.devport,
    host: '0.0.0.0',
  },
  build: {
    brotliSize: false,
  },
  plugins: [
    reactRefresh(),
    pluginYaml(),
  ],
})
