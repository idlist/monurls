/**
 * Routes:
 *   /api/shorten (POST)
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import Database, { pool } from '../database'
import randomString from '../utils/random-string'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

interface ShortenRequest extends RequestGI {
  Body: {
    full: string
    dest: string
    expire: string
  }
}

interface ShortenReply extends ServerState {
  shortened?: string
}

const shorten: FastifyPluginAsync = async (server) => {
  server.post<ShortenRequest>('/api/shorten', async (request): Promise<ShortenReply> => {
    const isVerified = await verifyCookies(request)
    if (!isVerified) return State.error(101)

    const { body } = request

    if (!('full' in body) || body.full == '') return State.error(102)

    let shortened = ''
    if (body.dest) {
      const existed = await Database.exists('urls', 'shortened', body.dest)
      if (existed) return State.error(103)
      if (!/[0-9a-zA-Z-]/.test(body.dest)) return State.error(105)
      shortened = body.dest.replace(/ /g, '-')
    } else {
      do {
        shortened = randomString(6)
      } while (await Database.exists('urls', 'shortened', shortened))
    }

    let expireTs: number | undefined
    let expire: DateTime | null = null

    if (body.expire) {
      expireTs = parseInt(body.expire)
      if (isNaN(expireTs)) return State.error(105)

      expire = DateTime.fromMillis(expireTs)
      if (expire < DateTime.local()) return State.error(105)
    }

    if (typeof expireTs == 'number') {
      await pool.query('INSERT INTO urls (full, shortened, expire) VALUES (?, ?, ?)',
        [body.full, shortened, expire?.toSQL({ includeOffset: false })])
    } else {
      await pool.query('INSERT INTO urls (full, shortened) VALUES (?, ?)',
        [body.full, shortened])
    }

    return State.success({ shortened: shortened })
  })
}

export default fp(shorten)