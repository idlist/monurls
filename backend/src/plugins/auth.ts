import { FastifyPluginAsync, RequestGenericInterface } from 'fastify'
import fp from 'fastify-plugin'

import config, { ServerState } from '../config'
import pool from '../database'
import randomString from '../utils/random-string'

interface LoginRequest extends RequestGenericInterface {
  Querystring: {
    key: string
  }
  cookies: {
    token: string
  }
}

const isTokenValid = async (token: string) => {
  const res = await pool.query(`SELECT COUNT(*) as count FROM tokens WHERE token = '${token}';`)
  if (res[0].count) return true
  return false
}

const auth: FastifyPluginAsync = async (server) => {
  server.get<LoginRequest>('/api/login', async (request, reply): Promise<ServerState> => {
    const { query, cookies, unsignCookie } = request

    if ('token' in cookies) {
      const decodedToken = unsignCookie(cookies.token)
      if (decodedToken.valid && await isTokenValid(decodedToken.value as string)) {
        return {
          code: 0
        }
      }
    }

    if ('key' in query && config.key.includes(query.key)) {
      const token = randomString(64)
      pool.query(`INSERT INTO tokens (token) VALUES ('${token}');`)
      reply.setCookie('token', token, {
        httpOnly: true,
        signed: true,
        expires: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000)
      })
      return {
        code: 0
      }
    }

    return {
      code: 100,
      message: 'Not authorized.'
    }
  })
}

export default fp(auth)