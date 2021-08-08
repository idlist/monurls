import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'

import { pool } from '../database'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

type GetListQuery = {
  [property in 'page' | 'limit']?: string
}

interface GetListRequest extends RequestGI {
  Querystring: GetListQuery
}

interface LinkData {
  id: number
  full: string
  shortened: string
  expire: string
  [property: string]: any
}

interface GetListReply extends ServerState {
  list?: LinkData[]
}

type DeleteQuery = {
  [property in 'id']?: string
}

interface DeleteRequest extends RequestGI {
  Querystring: DeleteQuery
}

const validateQuery = <T extends Record<string, string>>(query: T, property: keyof T, fallback: number): number => {
  let validated = fallback
  if (property in query) {
    validated = parseInt(query[property])
    if (isNaN(validated)) validated = fallback
    else if (validated <= 0) validated = fallback
  }
  return validated
}

const manage: FastifyPluginAsync = async (server) => {
  server.get<GetListRequest>('/api/get-list', async (request): Promise<GetListReply> => {
    const isVerified = verifyCookies(request)
    if (!isVerified) return State.error(101)

    const { query } = request

    let page = validateQuery(query, 'page', 1) - 1
    let limit = validateQuery(query, 'limit', 20)

    const lengthQuery = await pool.query('SELECT COUNT(*) as count FROM urls')
    const length = lengthQuery[0].count

    const maxPage = Math.floor(length / limit)
    if (page > maxPage) page = maxPage

    const listQuery = await pool.query('SELECT * FROM urls ORDER BY id LIMIT ? OFFSET ?',
      [limit, page * limit]) as LinkData[]
    let list: LinkData[] = []

    for (const { id, full, shortened, expire } of listQuery) {
      list.push({
        id,
        full,
        shortened,
        expire // TODO: May need to adjust format of 'expire' when 'expire' is installed
      })
    }

    return State.success({ length, list })
  })

  server.get<DeleteRequest>('/api/delete', async (request): Promise<ServerState> => {
    return State.success()
  })
}

export default fp(manage)