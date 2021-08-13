/**
 * Routes:
 *   /api/get-list  (including searching)
 *   /api/update
 *   /api/delete
 */

import { FastifyPluginAsync, RequestGenericInterface as RequestGI } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'

import Database, { pool, OkPacket } from '../database'
import State, { ServerState } from '../utils/state-codes'
import verifyCookies from '../utils/verify-cookies'

type GetListQuery = {
  [property in 'page' | 'limit' | 'keyword']?: string
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

type UpdateQuery = {
  [property in 'id' | 'expire' | 'dest']?: string
}

interface UpdateRequest extends RequestGI {
  Querystring: UpdateQuery
}

type DeleteQuery = {
  [property in 'id']?: string
}

interface DeleteRequest extends RequestGI {
  Querystring: DeleteQuery
}

const validateInteger = <T extends Record<string, string>>(query: T, property: keyof T, fallback: number): number => {
  let validated = fallback
  if (property in query) {
    validated = parseInt(query[property])
    if (isNaN(validated)) validated = fallback
  }
  return validated
}

let lastKeyword: string = ''

const manage: FastifyPluginAsync = async (server) => {
  server.get<GetListRequest>('/api/get-list', async (request): Promise<GetListReply> => {
    if (!await verifyCookies(request)) return State.error(101)

    const { query } = request

    let page = validateInteger(query, 'page', 1) - 1
    if (page <= 0 || lastKeyword != query.keyword) page = 0

    let limit = validateInteger(query, 'limit', 20)
    const keywordNumber = validateInteger(query, 'keyword', 0)
    lastKeyword = query.keyword ?? ''

    const countQueue = query.keyword
      ? await pool.query(`
          SELECT COUNT(*) as count FROM urls
          WHERE id = ? OR full LIKE ? OR shortened LIKE ?
        `, [keywordNumber, `http%${query.keyword}%`, `%${query.keyword}`])
      : await pool.query('SELECT COUNT(*) as count FROM urls')
    const count = countQueue[0].count

    if (!count && query.keyword) return State.error(106)

    const length = Math.ceil(count / limit)

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

  server.get<UpdateRequest>('/api/update', async (request): Promise<ServerState> => {
    if (!await verifyCookies(request)) return State.error(101)

    const { query } = request

    const index = validateInteger(query, 'id', 0)
    if (index < 1) return State.error(105)

    if (query.dest) {
      const existed = await Database.exists('urls', 'shortened', '')
      if (existed) return State.error(103)
    }

    let expire: DateTime | null = null, expireTs = 0
    if (query.expire) {
      expireTs = validateInteger(query, 'expire', 0)
      if (expireTs) {
        expire = DateTime.fromMillis(expireTs)
        if (expire < DateTime.local()) return State.error(105)
      }
    }

    let res: OkPacket
    if (query.dest && expireTs) {
      res = await pool.query('UPDATE urls SET shortened = ?, expire = ? WHERE id = ?',
        [query.dest, expireTs ? expire?.toSQL({ includeOffset: false }) : null, index])
    } else if (query.dest && !expireTs) {
      res = await pool.query('UPDATE urls SET shortened = ? WHERE id = ?',
        [query.dest, index])
    } else {
      res = await pool.query('UPDATE urls SET expire = ? WHERE id = ?',
        [expireTs ? expire?.toSQL({ includeOffset: false }) : null, index])
    }

    if (res.affectedRows) return State.success()
    else return State.error(104)
  })

  server.get<DeleteRequest>('/api/delete', async (request): Promise<ServerState> => {
    if (!await verifyCookies(request)) return State.error(101)

    const { query } = request

    const index = validateInteger(query, 'id', 0)
    if (index < 1) return State.error(105)

    const res: OkPacket = await pool.query('DELETE FROM urls WHERE id = ?', index)
    if (res.affectedRows) return State.success()
    else return State.error(104)
  })
}

export default fp(manage)