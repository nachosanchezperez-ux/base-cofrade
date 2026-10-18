import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import test from 'node:test'

// Guardia contra código muerto (auditoría 18/10/2026): todo módulo de
// components/ y lib/ debe importarse desde el código de la aplicación.
// Los tests no cuentan como uso.
const ROOT = new URL('..', import.meta.url).pathname
const SOURCE_DIRS = ['app', 'components', 'lib', 'scripts', '.github']
const SOURCE_FILES = ['proxy.js', 'next.config.mjs', 'package.json']
const CODE = /\.(?:m?jsx?|tsx?|ya?ml|json)$/

// Sin uso en la aplicación pero con tests que los fijan. Revisar uno a uno
// antes de retirarlos; no añadir nuevos aquí.
const PENDING_REVIEW = new Set([
  'components/AgendaCofradeDirectory.js',
  'components/AgendaCofradeNavFromUrl.js',
  'components/BrotherhoodSeatSection.js',
  'components/HermandadesDirectory.js',
  'components/RelatedExtraordinaryOutings.js',
  'lib/brotherhood-source-import-plan.js',
  'lib/home-temporal-complement.js',
  'lib/supabase/extraordinary-links.js',
])

function walk(dir, out = []) {
  let entries = []
  try { entries = readdirSync(join(ROOT, dir)) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.next')) continue
    const rel = join(dir, name)
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out)
    else if (CODE.test(name)) out.push(rel)
  }
  return out
}

test('no hay módulos de components/ y lib/ sin importar', () => {
  const files = [...SOURCE_DIRS.flatMap((dir) => walk(dir)), ...SOURCE_FILES]
  const texts = new Map(files.map((file) => {
    try { return [file, readFileSync(join(ROOT, file), 'utf8')] } catch { return [file, ''] }
  }))
  const candidates = files.filter((file) => /^(?:components|lib)\//.test(file) && /\.m?jsx?$/.test(file) && !/\.test\.m?js$/.test(file))
  const unused = candidates.filter((file) => {
    const base = basename(file, extname(file)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`['"\`](?:[^'"\`\\n]*/)?${base}(?:\\.m?jsx?)?['"\`]`)
    return ![...texts].some(([other, text]) => other !== file && pattern.test(text))
  })
  const unexpected = unused.filter((file) => !PENDING_REVIEW.has(file))
  assert.deepEqual(unexpected, [], `Módulos sin uso: ${unexpected.join(', ')}`)
  // Si uno de la lista pendiente vuelve a usarse o se retira, hay que quitarlo de la lista.
  const stale = [...PENDING_REVIEW].filter((file) => !unused.includes(file))
  assert.deepEqual(stale, [], `Quitar de PENDING_REVIEW: ${stale.join(', ')}`)
})
