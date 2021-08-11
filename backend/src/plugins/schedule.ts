/**
 * What the schedule do:
 * - clean up expired links and tokens in a daily basis
 */

import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { DateTime } from 'luxon'
import { AsyncTask, SimpleIntervalJob, SimpleIntervalSchedule } from 'toad-scheduler'

import { pool } from '../database'

const Daily: SimpleIntervalSchedule = {
  days: 1,
  runImmediately: true
}

const cleanLinks = new SimpleIntervalJob(Daily, new AsyncTask(
  'clean links',
  async () => {
    await pool.query('DELETE FROM urls WHERE expire IS NOT NULL AND expire < ?',
      DateTime.local().toSQL({ includeOffset: false }))
  },
  (err) => {
    console.error(err)
  }
))

const cleanTokens = new SimpleIntervalJob(Daily, new AsyncTask(
  'clean tokens',
  async () => {
    await pool.query('DELETE FROM tokens WHERE expire < ?',
      DateTime.local().toSQL({ includeOffset: false }))
  }
))

const tasks: FastifyPluginAsync = async (server) => {
  server.scheduler.addSimpleIntervalJob(cleanLinks)
  server.scheduler.addSimpleIntervalJob(cleanTokens)
}

export default fp(tasks)