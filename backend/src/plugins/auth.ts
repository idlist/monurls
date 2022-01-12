/**
 * Routes:
 *   /auth/login (GET)
 *   /auth/logout (GET)
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import config from '../config'
import { pool } from '../database'
import randomString from '../utils/random-string'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

interface LoginRequest extends RequestGI {
  Querystring: {
    key: string
  }
  cookies: {
    token: string
  }
}

interface LogoutRequest extends RequestGI {
  cookies: {
    token: string
  }
}

const auth: FastifyPluginAsync = async (server) => {
  server.get<LoginRequest>('/auth/login', async (request, reply): Promise<ServerState> => {
    const isVerified = await verifyCookies(request)
    if (isVerified) return State.success()

    const { query } = request
    const validKeys = config.key.map(key => key.toString())

    if (query.key && validKeys.includes(query.key)) {
      const token = randomString(64)
      const expire = DateTime.local().plus({ days: 90 })

      await pool.query('INSERT INTO tokens (token, expire) VALUES (?, ?)',
        [token, expire.toSQL({ includeOffset: false })])

      reply.clearCookie('token')
      reply.setCookie('token', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(expire.toMillis()),
        path: '/'
      })

      return State.success()
    }

    return State.error(101)
  })

  server.get<LogoutRequest>('/auth/logout', async (request, reply): Promise<ServerState> => {
    const { cookies, unsignCookie } = request

    if ('token' in cookies) {
      const decodedToken = unsignCookie(cookies.token)
      if (decodedToken.valid) {
        await pool.query('DELETE FROM tokens WHERE token = ?', decodedToken.value)
      }
    }

    reply.clearCookie('token')
    return State.success()
  })
}

export default fp(auth)