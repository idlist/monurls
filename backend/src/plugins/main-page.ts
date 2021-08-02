import { resolve } from 'path'

import { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import fastifyStatic from 'fastify-static'

const mainPage: FastifyPluginAsync = async (server) => {
  server.register(fastifyStatic, {
    root: resolve(process.cwd(), './frontend/dist/')
  })

  server.get('/', async (_, reply) => {
    return reply.sendFile('index.html')
  })
}

export default fastifyPlugin(mainPage)