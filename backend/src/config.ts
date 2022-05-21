import { readFileSync } from 'fs'

import yaml from 'js-yaml'

interface AllConfig {
  port: number
  dev: boolean
  devport: boolean
}

interface BackendConfig {
  db: {
    host: string
    port: number
    database: string
    user: string
    password: string
  }
  key: string[]
  secret: string
  logger: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'
}

type ServerConfig = AllConfig & BackendConfig

const all = yaml.load(readFileSync('./config.yaml', 'utf-8')) as AllConfig
const backend = yaml.load(readFileSync('./config.backend.yaml', 'utf-8')) as BackendConfig

const config: ServerConfig = {
  ...all,
  ...backend,
}

export default config