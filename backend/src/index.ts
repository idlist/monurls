import { readFileSync } from 'fs'
import { Server } from 'https'

import fastify, { FastifyHttpsOptions } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'
import fastifyRateLimit from 'fastify-rate-limit'
import c from 'chalk'

import config from './config'
import State from './utils/state-codes'
import './database'

import MainPage from './plugins/main-page'
import Auth from './plugins/auth'
import Shorten from './plugins/shorten'
import Jump from './plugins/jump'
import Manage from './plugins/manage'

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
    methods: 'GET',
  })
}

server.register(fastifyCookie, { secret: config.secret })
server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: 1000,
  errorResponseBuilder: () => State.error(429)
})
server.register(MainPage)
server.register(Auth)
server.register(Shorten)
server.register(Jump)
server.register(Manage)

server.setNotFoundHandler({
  preHandler: () => {
    server.rateLimit({ max: 5 })
  }
}, (_, reply) => {
  reply.code(418)
  return State.error(418)
})

const main = async () => {
  try {
    server.listen(config.port)
    console.log(`Server is listening at ${c.cyan(`https://localhost:${config.port}`)} ...`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()