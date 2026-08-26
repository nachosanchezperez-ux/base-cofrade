import assert from 'node:assert/strict'
import test from 'node:test'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])

async function source(path) {
  return readFile(join(ROOT, path), 'utf8')
}

async function walk(directory) {
  const absolute = join(ROOT, directory)
  const entries = await readdir(absolute, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(absolute, entry.name)
    if (entry.isDirectory()) files.push(...await walk(relative(ROOT, path)))
    else if (SOURCE_EXTENSIONS.has(extname(entry.name))) files.push(relative(ROOT, path))
  }

  return files
}

test('el layout raíz conserva el único landmark main de la aplicación', async () => {
  const layout = await source('app/layout.js')
  assert.equal((layout.match(/<main(?=[\s>])/g) || []).length, 1)
  assert.equal((layout.match(/<\/main>/g) || []).length, 1)

  const files = [...await walk('app'), ...await walk('components')]
    .filter((path) => path !== 'app/layout.js')
  const offenders = []

  for (const path of files) {
    const code = await source(path)
    if (/<main(?=[\s>])|<\/main>/.test(code)) offenders.push(path)
  }

  assert.deepEqual(offenders, [])
})

test('la ficha de Hermandad publica un solo acompañamiento musical', async () => {
  const page = await source('app/hermandades/[slug]/page.js')
  const relational = await source('components/BrotherhoodRelationalExtras.js')

  assert.doesNotMatch(page, /acompanamientoMusicalCopy/)
  assert.doesNotMatch(page, /h\.acompanamientoActual\.map/)
  assert.equal((page.match(/id="acompanamiento-musical"/g) || []).length, 0)
  assert.equal((relational.match(/id="acompanamiento-musical"/g) || []).length, 1)
  assert.match(page, /href:\s*'#acompanamiento-musical'/)
})

test('Web y redes usa la misma ancla que OfficialLinks', async () => {
  const officialLinks = await source('components/OfficialLinks.js')
  const brotherhood = await source('app/hermandades/[slug]/page.js')
  const files = [...await walk('app'), ...await walk('components')]
  const legacyAnchors = []

  assert.match(officialLinks, /id="enlaces-de-interes"/)
  assert.match(brotherhood, /href:\s*'#enlaces-de-interes'/)

  for (const path of files) {
    const code = await source(path)
    if (code.includes('#enlaces-oficiales')) legacyAnchors.push(path)
  }

  assert.deepEqual(legacyAnchors, [])
})

test('las fuentes sin URL se renderizan como filas no interactivas', async () => {
  const block = await source('components/SourcesBlock.js')
  const css = await source('app/globals.css')

  assert.match(block, /const isExternal = Boolean\(fuente\.url\)/)
  assert.match(block, /const Row = isExternal \? 'a' : 'div'/)
  assert.match(block, /data-source-static/)
  assert.match(block, /'data-hilo-scope': 'internal'/)
  assert.match(css, /\.source-row-static\{cursor:default\}/)
})
