import { readFileSync } from 'fs'

import yaml from 'js-yaml'

interface ServerConfig {
  port: number
  homepage: number
  dev: boolean
  db: {
    host: string
    port: number
    database: string
    user: string
    password: string
  }
  key: string[]
  secret: string
}

const config = yaml.load(readFileSync('./config.yaml', 'utf-8')) as ServerConfig

export default config