import { DateTime } from 'luxon'

import { pool } from '../database'
import randomString from '../utils/random-string'

const main = async () => {
  for (let i = 0; i < 100; i++) {
    await pool.query('INSERT INTO urls (full, shortened, expire) VALUES (?, ?, ?)',
      [
        `https://${randomString(20)}.com`,
        randomString(6),
        Math.random() < 0.3 ? null : DateTime.fromMillis(DateTime.local().toMillis() + (Math.random() - 0.5) * 1e6).toFormat('yyyy-MM-dd hh:mm:ss')
      ])
  }
  pool.end()
}

main()