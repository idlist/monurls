import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import pool from '../database'

interface JumpParams {
  shortenedId: string
}

const jump: FastifyPluginAsync = async (server) => {
  server.get<{ Params: JumpParams }>('/:shortenedId', async (request, reply) => {
    const { params } = request
    const res = await pool.query(`SELECT full FROM urls WHERE shortened = '${params.shortenedId}'`)
    if (!res.length) {
      reply.redirect(301, '/')
    } else {
      reply.redirect(303, res[0].full)
    }
  })
}

export default fp(jump)