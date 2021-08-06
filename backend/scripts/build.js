/* eslint-disable @typescript-eslint/no-var-requires */

const { rmSync, accessSync } = require('fs')
const { resolve } = require('path')
const { argv } = require('process')

const { build } = require('esbuild')
const glob = require('glob')
const c = require('chalk')

const distDir = resolve('./backend/dist')
console.log('')

try {
  accessSync(distDir)
  rmSync(distDir, { recursive: true })
} catch {
  console.log(`${c.green(distDir)} does not exist. Skip emptying directory.`)
}

const main = async () => {
  await build({
    entryPoints: glob.sync('./backend/src/**/*.ts'),
    outdir: './backend/dist',
    bundle: false,
    platform: 'node',
    target: ['node16'],
    format: 'cjs',
    minify: argv.includes('--minify') ? true : false,
    sourcemap: argv.includes('--source-map') ? true : false,
  })

  console.log(`Backend file has compiled into ${c.green(distDir)}.`)
}

main()