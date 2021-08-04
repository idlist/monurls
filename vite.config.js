import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  root: 'frontend',
  server: {
    port: 16666,
  },
  plugins: [reactRefresh()]
})
