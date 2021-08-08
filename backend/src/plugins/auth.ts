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
    if (await verifyCookies(request)) return State.success()

    const { query } = request

    if ('key' in query && config.key.includes(query.key)) {
      const token = randomString(64)
      const expire = DateTime.local().plus({ days: 90 })
      const timestamp = expire.toFormat('yyyy-MM-dd hh:mm:ss')

      pool.query('INSERT INTO tokens (token, expire) VALUES (?, ?)',
        [token, timestamp])
      reply.setCookie('token', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(expire.toMillis())
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
        await pool.query(`DELETE FROM tokens WHERE token = ?`, decodedToken.value)
      }
    }

    reply.clearCookie('token')
    return State.success()
  })
}

export default fp(auth)