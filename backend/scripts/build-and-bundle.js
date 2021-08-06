/* eslint-disable @typescript-eslint/no-var-requires */

const { rmSync, accessSync } = require('fs')
const { resolve } = require('path')
const { argv } = require('process')

const { build } = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
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
    entryPoints: ['./backend/src/index.ts'],
    outdir: './backend/dist',
    bundle: true,
    platform: 'node',
    target: ['node16'],
    format: 'esm',
    minify: argv.includes('--minify') ? true : false,
    sourcemap: argv.includes('--source-map') ? true : false,
    plugins: [
      nodeExternalsPlugin()
    ]
  })

  console.log(`Backend file has compiled into ${c.green(distDir)}.`)
}

main()