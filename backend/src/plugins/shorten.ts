/**
 * Routes:
 *   /api/shorten
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import Database, { pool } from '../database'
import randomString from '../utils/random-string'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

interface ShortenRequest extends RequestGI {
  Querystring: {
    full: string
    dest: string
    expire: string
  }
}

interface ShortenReply extends ServerState {
  shortened?: string
}

const shorten: FastifyPluginAsync = async (server) => {
  server.get<ShortenRequest>('/api/shorten', async (request): Promise<ShortenReply> => {
    const isVerified = await verifyCookies(request)
    if (!isVerified) return State.error(101)

    const { query } = request

    if (!('full' in query) || query.full == '') return State.error(102)

    let shortened = ''
    if (query.dest) {
      const existed = await Database.exists('urls', 'shortened', query.dest)
      if (existed) return State.error(103)
      if (!/[0-9a-zA-Z-]/.test(query.dest)) return State.error(105)
      shortened = query.dest
    } else {
      do {
        shortened = randomString(6)
      } while (await Database.exists('urls', 'shortened', shortened))
    }

    let expireTs: number | undefined
    let expire: DateTime | null = null

    if (query.expire) {
      expireTs = parseInt(query.expire)
      if (isNaN(expireTs)) return State.error(105)

      expire = DateTime.fromMillis(expireTs)
      if (expire < DateTime.local()) return State.error(105)
    }

    if (typeof expireTs == 'number') {
      await pool.query('INSERT INTO urls (full, shortened, expire) VALUES (?, ?, ?)',
        [query.full, shortened, expire?.toSQL({ includeOffset: false })])
    } else {
      await pool.query('INSERT INTO urls (full, shortened) VALUES (?, ?)',
        [query.full, shortened])
    }

    return State.success({ shortened: shortened })
  })
}

export default fp(shorten)