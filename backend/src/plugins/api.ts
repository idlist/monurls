import { randomInt } from 'crypto'

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import config from '../config'
import pool from '../database'

const dict = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const createShortenedUrl = (length: number): string => {
  let short = ''
  for (let i = 0; i < length; i++) {
    short += dict[randomInt(0, dict.length)]
  }
  return short
}

const checkDuplicate = async (shortened: string): Promise<boolean> => {
  const existed = await pool.query(`SELECT COUNT(*) AS count FROM urls WHERE shortened = '${shortened}'`)
  return existed[0].count ? true : false
}

interface APIQuery {
  key: number
  full: string
  dest: string
}

const api: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: APIQuery }>('/api/shorten', async (request, reply) => {
    const { query } = request

    if (!('key' in query) || query.key != config.key) {
      reply.code(403)
      return {
        errCode: 0,
        error: 'Not authorized.'
      }
    }

    if (!('full' in query)) {
      reply.code(400)
      return {
        errCode: 1,
        error: 'No data sent.'
      }
    }

    let shortened = ''
    if ('dest' in query) {
      const existed = await checkDuplicate(query.dest)
      if (existed) {
        return {
          errCode: 2,
          error: 'The destination URL is duplicated.'
        }
      }
      shortened = query.dest
    } else {
      do {
        shortened = createShortenedUrl(6)
      } while (await checkDuplicate(shortened))
    }

    await pool.query(`INSERT INTO urls (full, shortened) VALUES ('${query.full}', '${shortened}')`)
    return {
      shortened: shortened
    }
  })
}

export default fp(api)