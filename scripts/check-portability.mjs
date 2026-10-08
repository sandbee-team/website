import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const files = []
function walk(dir) {
  for (const item of readdirSync(path.join(root, dir), {
    withFileTypes: true,
  })) {
    const name = `${dir}/${item.name}`
    if (item.isSymbolicLink())
      throw new Error(`Unexpected source symlink: ${name}`)
    if (item.isDirectory()) walk(name)
    else files.push(name)
  }
}
walk('src')
walk('public')
const exact = new Set(files)
const lower = new Map(files.map((file) => [file.toLowerCase(), file]))
let checked = 0
for (const file of files.filter((file) => /\.[cm]?[jt]sx?$/.test(file))) {
  const source = readFileSync(path.join(root, file), 'utf8')
  const imports = source.matchAll(
    /(?:from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g,
  )
  for (const [, specifier] of imports) {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue
    const base = specifier.startsWith('@/')
      ? `src/${specifier.slice(2)}`
      : path.posix.normalize(
          path.posix.join(path.posix.dirname(file), specifier),
        )
    const options = [
      '',
      '.ts',
      '.tsx',
      '.js',
      '.mjs',
      '.json',
      '.mdx',
      '/index.ts',
      '/index.tsx',
    ].map((ext) => base + ext)
    if (!options.some((option) => exact.has(option))) {
      const mismatch = options
        .map((option) => lower.get(option.toLowerCase()))
        .find(Boolean)
      throw new Error(
        `${file}: ${specifier} ${mismatch ? `has incorrect case; use ${mismatch}` : 'does not resolve'}`,
      )
    }
    checked++
  }
}
console.log(
  `Portable paths: ${checked} local imports resolve with exact filename casing.`,
)
