import { DateTime } from 'luxon'

import { pool } from '../database'
import randomString from '../utils/random-string'

const main = async () => {
  for (let i = 0; i < 100; i++) {
    let mockExpire = DateTime.local()
    if (Math.random() < 0.5) mockExpire = mockExpire.plus({ days: Math.random() * 90 })
    else mockExpire = mockExpire.minus({ days: Math.random() * 90 })

    await pool.query('INSERT INTO urls (full, shortened, expire) VALUES (?, ?, ?)',
      [
        `https://${randomString(20)}.com`,
        randomString(6),
        Math.random() < 0.3 ? null : mockExpire.toSQL({ includeOffset: false })
      ])
  }
  pool.end()
}

main()