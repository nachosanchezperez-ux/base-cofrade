// Utilidades puras de la comprobación «migraciones en dos fases»
// (probadas en test/migration-code-split.test.mjs).
//
// Al fusionar en main, Vercel despliega el código y la integración de Supabase
// aplica las migraciones a la vez, sin orden garantizado. Si una misma PR añade
// una columna y el código que la lee, el código puede llegar antes que la columna
// (ocurrió el 12/10/2026 con outings.home_featured_starts_on, #1144).
//
// Esta comprobación detecta ese caso: identificadores que una migración nueva
// crea (columnas, tablas, vistas, funciones) y que el código de la misma PR
// empieza a usar.

// Marca para declarar, en la propia migración, que el código de la PR funciona
// aunque la migración aún no esté aplicada (por ejemplo, porque solo escribe en
// el Panel tras comprobar la columna, o porque la lectura degrada sin error).
export const TOLERANT_MARKER = /^\s*--\s*hc-despliegue:\s*tolerante\b/im

const IDENTIFIER = '"?([a-z_][a-z0-9_]*)"?'
const QUALIFIED = `(?:"?[a-z_][a-z0-9_]*"?\\.)?${IDENTIFIER}`
const IF_NOT_EXISTS = '(?:if\\s+not\\s+exists\\s+)?'

const DEFINITION_PATTERNS = [
  // alter table … add column [if not exists] nombre (también varias en la misma sentencia)
  new RegExp(`\\badd\\s+column\\s+${IF_NOT_EXISTS}${IDENTIFIER}`, 'gi'),
  // create table [if not exists] [esquema.]nombre
  new RegExp(`\\bcreate\\s+(?:unlogged\\s+)?table\\s+${IF_NOT_EXISTS}${QUALIFIED}`, 'gi'),
  // create [or replace] [materialized] view [esquema.]nombre
  new RegExp(`\\bcreate\\s+(?:or\\s+replace\\s+)?(?:materialized\\s+)?view\\s+${IF_NOT_EXISTS}${QUALIFIED}`, 'gi'),
  // create [or replace] function [esquema.]nombre (llamable por RPC)
  new RegExp(`\\bcreate\\s+(?:or\\s+replace\\s+)?function\\s+${QUALIFIED}`, 'gi'),
]

function stripSqlComments(sql = '') {
  return String(sql)
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--[^\n]*/g, ' ')
}

// Identificadores que define una migración, en minúsculas y sin duplicados.
export function extractSchemaIdentifiers(sql = '') {
  const clean = stripSqlComments(sql)
  const found = new Set()
  for (const pattern of DEFINITION_PATTERNS) {
    for (const match of clean.matchAll(pattern)) found.add(match[1].toLowerCase())
  }
  return [...found].sort()
}

export function isTolerantMigration(sql = '') {
  return TOLERANT_MARKER.test(String(sql))
}

export function isMigrationPath(path = '') {
  return /^supabase\/migrations\/[^/]+\.sql$/.test(path)
}

// Código que se ejecuta en Vercel. Los tests, scripts y documentación no cuentan.
export function isRuntimeCodePath(path = '') {
  if (!/\.(?:m?js|cjs|jsx|ts|tsx)$/.test(path)) return false
  if (/(?:^|\/)(?:test|tests|test-support)\//.test(path)) return false
  if (/\.test\.[a-z]+$/.test(path)) return false
  return /^(?:app|components|lib)\//.test(path) || /^(?:proxy|middleware|instrumentation)\.[a-z]+$/.test(path)
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Busca los identificadores en las líneas añadidas del código.
// addedLinesByFile: { 'lib/x.js': ['línea añadida', …] }
// Devuelve [{ file, identifier, line }] ordenado.
export function findIdentifierUsages(addedLinesByFile = {}, identifiers = []) {
  const patterns = identifiers.map((identifier) => ({
    identifier,
    pattern: new RegExp(`(?<![A-Za-z0-9_])${escapeRegExp(identifier)}(?![A-Za-z0-9_])`, 'i'),
  }))
  const usages = []
  for (const [file, lines] of Object.entries(addedLinesByFile)) {
    for (const line of lines) {
      for (const { identifier, pattern } of patterns) {
        if (pattern.test(line)) usages.push({ file, identifier, line: line.trim().slice(0, 160) })
      }
    }
  }
  return usages.sort((a, b) => a.file.localeCompare(b.file) || a.identifier.localeCompare(b.identifier))
}

// Reparte la salida de `git diff -U0` en líneas añadidas por fichero.
export function parseAddedLines(unifiedDiff = '') {
  const result = {}
  let current = null
  for (const line of String(unifiedDiff).split('\n')) {
    if (line.startsWith('+++ ')) {
      const path = line.slice(4).trim()
      current = path === '/dev/null' ? null : path.replace(/^b\//, '')
      if (current && !result[current]) result[current] = []
      continue
    }
    if (current && line.startsWith('+') && !line.startsWith('+++')) result[current].push(line.slice(1))
  }
  return result
}

// Decide el resultado a partir de los datos ya reunidos.
// migrations: [{ path, sql }] añadidas en la PR
// existingIdentifiers: Set de identificadores que ya aparecían en el código antes de la PR
//   (un nombre reutilizado, como `slug`, no es nuevo y no se vigila).
export function evaluateSplit({ migrations = [], addedLinesByFile = {}, existingIdentifiers = new Set() }) {
  const watched = []
  const tolerant = []
  for (const migration of migrations) {
    const identifiers = extractSchemaIdentifiers(migration.sql)
    if (isTolerantMigration(migration.sql)) {
      tolerant.push(migration.path)
      continue
    }
    for (const identifier of identifiers) {
      if (!existingIdentifiers.has(identifier)) watched.push({ identifier, migration: migration.path })
    }
  }

  const runtimeLines = Object.fromEntries(
    Object.entries(addedLinesByFile).filter(([path]) => isRuntimeCodePath(path)),
  )
  const usages = findIdentifierUsages(runtimeLines, [...new Set(watched.map((entry) => entry.identifier))])
  return { ok: usages.length === 0, watched, tolerant, usages }
}
