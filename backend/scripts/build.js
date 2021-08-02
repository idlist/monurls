/* eslint-disable @typescript-eslint/no-var-requires */

const esbuild = require('esbuild')
const globSync = require('glob').sync

esbuild.buildSync({
  entryPoints: globSync('./backend/src/**/*.ts'),
  outdir: './backend/dist',
  platform: 'node',
  target: ['node16'],
  bundle: false,
  format: 'cjs'
})