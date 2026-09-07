import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeSourceUrl, sourceUrlVariants } from '../lib/sources/source-url.js'
import { normalizeBulkImportRecord, validateBulkImportRecord, validateBulkImportTableContract } from '../lib/panel/bulk-import-config.js'

test('normaliza una URL de Fuente sin perder parámetros editoriales', () => {
  assert.equal(
    normalizeSourceUrl('HTTPS://Example.com/noticia/?utm_source=x&b=2&a=1#fragmento'),
    'https://example.com/noticia?a=1&b=2',
  )
})

test('considera equivalentes las variantes con y sin barra final', () => {
  assert.deepEqual(
    new Set(sourceUrlVariants('https://example.com/noticia/')),
    new Set(['https://example.com/noticia', 'https://example.com/noticia/']),
  )
})

test('normaliza la URL tanto en sources como en referencias a sources', () => {
  const source = normalizeBulkImportRecord({
    table: 'sources',
    operation: 'insert',
    data: { url: 'example.com/noticia/?utm_medium=social' },
  })
  assert.equal(source.data.url, 'https://example.com/noticia')

  const link = normalizeBulkImportRecord({
    table: 'source_links',
    operation: 'insert',
    data: { scope: 'entity' },
    refs: {
      source_id: { table: 'sources', match: { url: 'https://example.com/noticia/?utm_campaign=test' } },
    },
  })
  assert.equal(link.refs.source_id.match.url, 'https://example.com/noticia')
})

test('una Fuente nueva exige nombre y tipo solo cuando el preflight determina INSERT', () => {
  const record = normalizeBulkImportRecord({ table: 'sources', operation: 'insert', data: { url: 'https://example.com/fuente' } })
  assert.deepEqual(validateBulkImportRecord(record).errors, [])
  assert.deepEqual(
    validateBulkImportTableContract(record, 'insert'),
    [
      'MISSING_REQUIRED_FIELD: sources.name es obligatorio para INSERT.',
      'MISSING_REQUIRED_FIELD: sources.source_type es obligatorio para INSERT.',
    ],
  )
  assert.deepEqual(validateBulkImportTableContract(record, 'reuse'), [])
})

test('rechaza URLs de Fuente no http/https', () => {
  const validation = validateBulkImportRecord({
    table: 'sources',
    operation: 'insert',
    data: { name: 'FTP', source_type: 'web', url: 'ftp://example.com/recurso' },
  })
  assert.ok(validation.errors.some((error) => error.includes('http o https')))
})
