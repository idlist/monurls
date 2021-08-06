import { FastifyRequest } from 'fastify'
import { DateTime } from 'luxon'
import { pool } from '../database'

const verifyCookies = async (request: FastifyRequest): Promise<boolean> => {
  const { cookies, unsignCookie } = request

  if (!('token' in cookies)) {
    return false
  }

  const decodedCookies = unsignCookie(cookies.token)
  if (!decodedCookies.valid) {
    return false
  }

  const res = await pool.query(`
    SELECT * FROM tokens WHERE token = '${decodedCookies.value}'
    AND expire > '${DateTime.local().toFormat('yyyy-MM-dd hh:mm:ss')}';
  `)

  if (!res.length) {
    return false
  }

  return true
}

export default verifyCookies