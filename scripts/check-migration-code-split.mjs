#!/usr/bin/env node
// Comprobación de CI: una PR no debe crear un elemento de esquema y empezar a
// usarlo en el código en el mismo cambio. Ver supabase/migrations/README.md
// («Migraciones en dos fases») y scripts/lib/migration-code-split.mjs.
//
// Uso: node scripts/check-migration-code-split.mjs --base origin/main [--head HEAD]
// Solo lee el repositorio git; no accede a Supabase ni a Vercel.

import { execFileSync } from 'node:child_process'
import { evaluateSplit, extractSchemaIdentifiers, isMigrationPath, parseAddedLines } from './lib/migration-code-split.mjs'

const RUNTIME_ROOTS = ['app', 'components', 'lib', 'proxy.js']

function argument(name, fallback) {
  const index = process.argv.indexOf(name)
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback
}

function git(args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  } catch (error) {
    if (allowFailure) return ''
    throw error
  }
}

const base = argument('--base', 'origin/main')
const head = argument('--head', 'HEAD')
const mergeBase = git(['merge-base', base, head]).trim()

const added = git(['diff', '--name-only', '--diff-filter=A', mergeBase, head])
  .split('\n')
  .filter(isMigrationPath)

if (added.length === 0) {
  console.log('Migraciones en dos fases: la PR no añade migraciones. Nada que comprobar.')
  process.exit(0)
}

const migrations = added.map((path) => ({ path, sql: git(['show', `${head}:${path}`]) }))
const addedLinesByFile = parseAddedLines(git(['diff', '-U0', '--no-color', mergeBase, head, '--', ...RUNTIME_ROOTS]))

// Un identificador que ya aparecía en el código antes de la PR (p. ej. `slug`) no es nuevo.
function existsInBaseCode(identifier) {
  try {
    execFileSync('git', ['grep', '-q', '-i', '-w', identifier, mergeBase, '--', ...RUNTIME_ROOTS], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const candidates = [...new Set(migrations.flatMap((migration) => extractSchemaIdentifiers(migration.sql)))]
const existingIdentifiers = new Set(candidates.filter(existsInBaseCode))

const result = evaluateSplit({ migrations, addedLinesByFile, existingIdentifiers })

console.log(`Migraciones añadidas: ${added.join(', ')}`)
if (result.tolerant.length) console.log(`Marcadas como «hc-despliegue: tolerante»: ${result.tolerant.join(', ')}`)
console.log(`Elementos nuevos vigilados: ${result.watched.map((entry) => entry.identifier).join(', ') || 'ninguno'}`)

if (result.ok) {
  console.log('Migraciones en dos fases: correcto. El código de la PR no usa los elementos nuevos.')
  process.exit(0)
}

console.error('\nMigraciones en dos fases: esta PR crea elementos de esquema y el código ya los usa.')
console.error('Al fusionar, Vercel puede publicar el código antes de que Supabase aplique la migración.\n')
const byFile = new Map()
for (const usage of result.usages) {
  if (!byFile.has(usage.file)) byFile.set(usage.file, new Set())
  byFile.get(usage.file).add(usage.identifier)
}
for (const [file, identifiers] of byFile) console.error(`  ${file} → ${[...identifiers].join(', ')}`)
console.error('\nOpciones:')
console.error('  1. Separar en dos PR: primero solo la migración; cuando conste aplicada en producción, la PR con el código.')
console.error('  2. Si el código funciona aunque la migración aún no exista, añadir en la migración la línea')
console.error('     «-- hc-despliegue: tolerante» y explicar en la PR por qué.')
process.exit(1)
