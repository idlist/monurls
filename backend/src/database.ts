import { createPool } from 'mariadb'

import config from './config'

const pool = createPool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  connectionLimit: 5
})

const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS urls (
    id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    full      TEXT NOT NULL,
    shortened VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id));`)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
    token  VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (token));`)
}
initDatabase()

export default pool