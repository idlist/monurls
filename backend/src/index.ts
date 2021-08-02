import fastify from 'fastify'

import config from './config'
import './database'
import mainPage from './plugins/main-page'
import api from './plugins/api'
import jump from './plugins/jump'

const server = fastify()

server.register(mainPage)
server.register(api)
server.register(jump)

const main = async () => {
  try {
    const address = await server.listen(config.port)
    console.log(`Server is listening at: \x1b[36m${address}\x1b[0m`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()