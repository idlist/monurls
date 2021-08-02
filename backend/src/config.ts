import { readFileSync } from 'fs'

import yaml from 'js-yaml'

interface ServerConfig {
  port: number
  db: {
    host: string
    port: number
    database: string
    user: string
    password: string
  }
  key: string[]
}

const config = yaml.load(readFileSync('./config.yaml', 'utf-8')) as ServerConfig

interface ServerState {
  code: number
  message?: string
}

export default config
export type { ServerState }