import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import config, { ServerState } from '../config'

interface AuthQuery {
  key: string
}

const auth: FastifyPluginAsync = async (server) => {
  server.get<{ Querystring: AuthQuery }>('/api/auth', async (request): Promise<ServerState> => {
    const { query } = request

    if (!('key' in query) || !config.key.includes(query.key)) {
      return {
        code: 100,
        message: 'Not authorized.'
      }
    }

    return {
      code: 0
    }
  })
}

export default fp(auth)