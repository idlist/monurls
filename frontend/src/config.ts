import all from '../../config.yaml'

interface PageConfig {
  port: number
  dev: boolean
  title: string
}

const config = all as PageConfig

export default config