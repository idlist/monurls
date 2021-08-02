/* eslint-disable @typescript-eslint/no-var-requires */

const { buildSync } = require('esbuild')
const globSync = require('glob').sync

buildSync({
  entryPoints: globSync('./backend/src/**/*.ts'),
  outdir: './backend/dist',
  platform: 'node',
  target: ['node16'],
  format: 'cjs',
})