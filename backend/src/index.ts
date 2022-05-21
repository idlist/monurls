import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySchedule from 'fastify-schedule'
import c from 'kleur'

import config from './config.js'
import State from './utils/state-codes.js'
import './database.js'

import mainPage from './plugins/main-page.js'
import auth from './plugins/auth.js'
import shorten from './plugins/shorten.js'
import jump from './plugins/jump.js'
import manage from './plugins/manage.js'
import tasks from './plugins/schedule.js'

const server = fastify({
  logger: {
    level: config.logger,
  },
})

if (config.dev) {
  server.register(fastifyCors, {
    origin: [
      `http://localhost:${config.devport}`,
    ],
    methods: 'GET',
    credentials: true,
  })
}

server.register(fastifyCookie, { secret: config.secret })
server.register(fastifyRateLimit, {
  max: 100,
  timeWindow: 1000,
  errorResponseBuilder: () => State.error(429),
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
  },
}, () => {
  return State.error(404)
})

const main = async () => {
  try {
    server.listen(config.port)
    console.log(`Server is listening at ${c.cyan(`http://localhost:${config.port}`)} ...`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()