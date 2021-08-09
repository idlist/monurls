/**
 * Routes:
 *   /:shortenedId  (Site redirection)
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import { pool } from '../database'

interface JumpRequest extends RequestGI {
  Params: {
    shortenedId: string
  }
}

const jump: FastifyPluginAsync = async (server) => {
  server.get<JumpRequest>('/:shortenedId', {
    config: {
      rateLimit: { max: 5 }
    }
  }, async (request, reply) => {
    const { params } = request
    const res = await pool.query('SELECT full FROM urls WHERE shortened = ? AND expire > ?',
      [params.shortenedId, DateTime.local().toSQL({ includeOffset: false })])
    if (!res.length) {
      reply.redirect(303, '/')
    } else {
      reply.redirect(303, res[0].full)
    }
  })
}

export default fp(jump)