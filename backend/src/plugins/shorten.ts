import { randomInt } from 'crypto'

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import config, { ServerState } from '../config'
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
  key: string
  full: string
  dest: string
}

interface APIReply extends ServerState {
  shortened?: string
}

const api: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: APIQuery }>('/api/shorten', async (request): Promise<APIReply> => {
    const { query } = request

    if (!('key' in query) || !config.key.includes(query.key)) {
      return {
        code: 100,
        message: 'Not authorized.'
      }
    }

    if (!('full' in query)) {
      return {
        code: 101,
        message: 'No data sent.'
      }
    }

    let shortened = ''
    if ('dest' in query && query.dest) {
      const existed = await checkDuplicate(query.dest)
      if (existed) {
        return {
          code: 102,
          message: 'The destination URL is duplicated.'
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
      code: 0,
      shortened: shortened
    }
  })
}

export default fp(api)