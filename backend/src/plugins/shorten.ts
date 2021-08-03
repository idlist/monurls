import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import Database, { pool } from '../database'
import randomString from '../utils/random-string'
import State, { ServerState } from '../utils/state-codes'

interface APIQuery {
  full: string
  dest: string
}

interface APIReply extends ServerState {
  shortened?: string
}

const api: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: APIQuery }>('/api/shorten', async (request): Promise<APIReply> => {
    const { query, cookies, unsignCookie } = request

    if (!('token' in cookies)) {
      return State.error(101)
    }

    const decodedCookies = unsignCookie(cookies.token)
    if (!decodedCookies.valid) {
      return State.error(101)
    }

    if (!await Database.exists('tokens', 'token', decodedCookies.value as string)) {
      return State.error(101)
    }

    if (!('full' in query)) {
      return State.error(102)
    }

    let shortened = ''
    if ('dest' in query && query.dest) {
      const existed = await Database.exists('tokens', 'urls', query.dest)
      if (existed) {
        return State.error(103)
      }
      shortened = query.dest
    } else {
      do {
        shortened = randomString(6)
      } while (await Database.exists('tokens', 'urls', shortened))
    }

    await pool.query(
      `INSERT INTO urls (full, shortened) VALUES ('${query.full}', '${shortened}');`
    )
    return State.success({ shortened: shortened })
  })
}

export default fp(api)