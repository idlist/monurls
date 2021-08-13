import all from '../../config.yaml'

interface PageConfig {
  port: number
  dev: boolean
  url: string
  title: string
}

const config: PageConfig = {
  port: all.port,
  dev: all.dev,
  url: all.dev ? `https://localhost:${all.port}` : `https://${all.cname}`,
  title: all.title
}

export default config