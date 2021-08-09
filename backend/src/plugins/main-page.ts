/*

Routes:
  /  (SPA homepage)

*/

import { resolve } from 'path'

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import fastifyStatic from 'fastify-static'

const mainPage: FastifyPluginAsync = async (server) => {
  server.register(fastifyStatic, {
    root: resolve('./frontend/dist/')
  })

  server.get('/', async (_, reply) => {
    return reply.sendFile('index.html')
  })
}

export default fp(mainPage)