import all from '../../config.yaml'

interface PageConfig {
  port: number
  dev: boolean
}

const config: PageConfig = {
  port: all.port,
  dev: all.dev
}

export default config