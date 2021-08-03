import { readFileSync } from 'fs'
import { Server } from 'https'

import fastify, { FastifyHttpsOptions } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'

import config from './config'
import './database'
import mainPage from './plugins/main-page'
import auth from './plugins/auth'
import shorten from './plugins/shorten'
import jump from './plugins/jump'

const HttpsOption: FastifyHttpsOptions<Server> = {
  https: {
    key: readFileSync('./ssl/localhost.key'),
    cert: readFileSync('./ssl/localhost.crt')
  }
}

const server = fastify(config.dev ? HttpsOption : {})

if (config.dev) {
  server.register(fastifyCors, {
    origin: 'http://localhost:16666',
    methods: 'GET'
  })
}

server.register(fastifyCookie, {
  secret: config.secret
})

server.register(mainPage)
server.register(auth)
server.register(shorten)
server.register(jump)

const main = async () => {
  try {
    const address = await server.listen(config.port, '127.0.0.1')
    console.log(`Server is listening at: \x1b[36m${address}\x1b[0m`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()