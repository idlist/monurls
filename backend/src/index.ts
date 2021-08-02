import { readFile } from 'fs/promises'

import fastify from 'fastify'
import yaml from 'js-yaml'

import mainPage from './plugins/main-page'

const server = fastify()

server.register(mainPage)

interface ServerConfig {
  port: number
}

const main = async () => {
  try {
    const secrets = yaml.load(await readFile('./secrets.yaml', 'utf-8')) as ServerConfig
    const address = await server.listen(secrets.port)
    console.log(`Server is listening at: \x1b[36m${address}\x1b[0m`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()