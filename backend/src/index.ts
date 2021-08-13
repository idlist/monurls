import { readFileSync } from 'fs'
import { Server } from 'https'

import fastify, { FastifyHttpsOptions, FastifyServerOptions } from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyCookie from 'fastify-cookie'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifySchedule from 'fastify-schedule'
import c from 'chalk'

import config from './config'
import State from './utils/state-codes'
import './database'

import mainPage from './plugins/main-page'
import auth from './plugins/auth'
import shorten from './plugins/shorten'
import jump from './plugins/jump'
import manage from './plugins/manage'
import tasks from './plugins/schedule'

let serverOption: FastifyHttpsOptions<Server> | FastifyServerOptions = {}

if (config.dev) {
  serverOption = {
    https: {
      key: readFileSync('./ssl/localhost.key'),
      cert: readFileSync('./ssl/localhost.crt')
    }
  }
}

const server = fastify(serverOption)

if (config.dev) {
  server.register(fastifyCors, {
    origin: [
      `http://localhost:${config.devport}`,
      `https://localhost:${config.devport}`
    ],
    methods: 'GET',
    credentials: true
  })
}

server.register(fastifyCookie, { secret: config.secret })
server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: 1000,
  errorResponseBuilder: () => State.error(429)
})
server.register(fastifySchedule)

server.register(mainPage)
server.register(auth)
server.register(shorten)
server.register(jump)
server.register(manage)
server.register(tasks)

server.setNotFoundHandler({
  preHandler: () => {
    server.rateLimit({ max: 5 })
  }
}, () => {
  return State.error(404)
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