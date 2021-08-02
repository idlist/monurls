import fastify from 'fastify'
import fastifyCors from 'fastify-cors'

import config from './config'
import './database'
import mainPage from './plugins/main-page'
import auth from './plugins/auth'
import shorten from './plugins/shorten'
import jump from './plugins/jump'

const server = fastify()

server.register(fastifyCors, {
  origin: 'http://localhost:16666',
  methods: 'GET'
})

server.register(mainPage)
server.register(auth)
server.register(shorten)
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