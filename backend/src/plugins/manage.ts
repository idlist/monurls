/**
 * Routes:
 *   /api/get-list  (including searching)
 *   /api/delete
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import { pool, OkPacket } from '../database'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

type GetListProps = 'page' | 'limit' | 'keyword'

type GetListQuery = {
  [property in GetListProps]?: string
}

interface GetListRequest extends RequestGI {
  Querystring: GetListQuery
}

interface RawLinkData {
  id: number
  full: string
  shortened: string
  expire: Date | null
}

interface LinkData extends Omit<RawLinkData, 'expire'> {
  expire: number | null
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
  }
  return validated
}

const manage: FastifyPluginAsync = async (server) => {
  server.get<GetListRequest>('/api/get-list', async (request): Promise<GetListReply> => {
    const isVerified = verifyCookies(request)
    if (!isVerified) return State.error(101)

    const { query } = request

    let page = validateQuery(query, 'page', 1) - 1
    if (page <= 0) page = 0
    let limit = validateQuery(query, 'limit', 20)
    const keywordNumber = validateQuery(query, 'keyword', 0)

    const countQueue = query.keyword
      ? await pool.query(`
          SELECT COUNT(*) as count FROM urls
          WHERE id = ? OR full LIKE ? OR shortened LIKE ?
        `, [keywordNumber, `http%${query.keyword}%`, `%${query.keyword}`])
      : await pool.query('SELECT COUNT(*) as count FROM urls')
    const count = countQueue[0].count

    if (!count) return State.error(106)

    const length = Math.ceil(count / limit)
    if (page >= length) page = length

    const listQuery: RawLinkData[] = query.keyword
      ? await pool.query(`
          SELECT * FROM urls
          WHERE id = ? OR full LIKE ? OR shortened LIKE ?
          ORDER BY id LIMIT ? OFFSET ?
        `, [keywordNumber, `http%${query.keyword}%`, `%${query.keyword}`, limit, page * limit])
      : await pool.query('SELECT * FROM urls ORDER BY id LIMIT ? OFFSET ?',
        [limit, page * limit])
    let list: LinkData[] = []

    for (const { id, full, shortened, expire } of listQuery) {
      list.push({
        id,
        full,
        shortened,
        expire: expire ? DateTime.fromJSDate(expire).toMillis() : null
      })
    }

    return State.success({ count, length, page: page + 1, list })
  })

  server.get<DeleteRequest>('/api/delete', async (request): Promise<ServerState> => {
    const isVerified = verifyCookies(request)
    if (!isVerified) return State.error(101)

    const { query } = request
    let index = validateQuery(query, 'id', 0)
    if (index < 1) return State.error(105)

    const res: OkPacket = await pool.query('DELETE FROM urls WHERE id = ?', index)
    if (res.affectedRows) return State.success()
    else return State.error(104)
  })
}

export default fp(manage)