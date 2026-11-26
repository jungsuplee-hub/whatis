import { cpSync, copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
if (!existsSync(join(dist, 'index.html'))) throw new Error('Build dist/index.html first')
const builtAssets = join(dist, 'assets')
if (!existsSync(builtAssets)) throw new Error('Built assets missing')
const deployedAssets = join(root, 'assets')
rmSync(deployedAssets, { recursive: true, force: true })
mkdirSync(deployedAssets, { recursive: true })
cpSync(builtAssets, deployedAssets, { recursive: true })
copyFileSync(join(dist, 'index.html'), join(root, 'index.html'))
const mes = join(dist, 'mes')
if (existsSync(join(mes, 'index.html'))) cpSync(mes, join(root, 'mes'), { recursive: true })
const favicon = join(dist, 'favicon.svg')
if (existsSync(favicon)) copyFileSync(favicon, join(root, 'favicon.svg'))
console.log('GitHub Pages branch artifacts synced:', readdirSync(deployedAssets).length, 'files')
