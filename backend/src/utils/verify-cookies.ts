import { FastifyRequest } from 'fastify'
import Database from '../database'

const verifyCookies = async (request: FastifyRequest): Promise<boolean> => {
  const { cookies, unsignCookie } = request

  if (!('token' in cookies)) {
    return false
  }

  const decodedCookies = unsignCookie(cookies.token)
  if (!decodedCookies.valid) {
    return false
  }

  if (!await Database.exists('tokens', 'token', decodedCookies.value as string)) {
    return false
  }

  return true
}

export default verifyCookies