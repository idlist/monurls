import { rmSync, accessSync } from 'fs'
import { resolve } from 'path'
import { argv } from 'process'
import c from 'kleur'
import { build } from 'esbuild'
import glob from 'fast-glob'

const distDir = resolve('./backend/dist')

try {
  accessSync(distDir)
  rmSync(distDir, { recursive: true })
} catch {
  console.log(`${c.green(distDir)} does not exist. Skip emptying directory.`)
}

await build({
  entryPoints: glob.sync('./backend/src/**/*.ts'),
  outdir: './backend/dist',
  target: ['node16'],
  format: 'esm',
  minify: argv.includes('--minify') ? true : false,
  sourcemap: argv.includes('--source-map') ? true : false,
})

console.log(`Backend file has compiled into ${c.green(distDir)}.`)