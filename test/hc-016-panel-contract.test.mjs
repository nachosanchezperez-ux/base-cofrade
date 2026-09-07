import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const actions = await readFile(new URL('../app/panel/(protected)/datos/importar/actions.js', import.meta.url), 'utf8')
const workspace = await readFile(new URL('../app/panel/(protected)/datos/importar/ImportWorkspace.js', import.meta.url), 'utf8')
const detail = await readFile(new URL('../app/panel/(protected)/datos/importar/[id]/page.js', import.meta.url), 'utf8')
const moduleIndex = await readFile(new URL('../app/panel/(protected)/datos/page.js', import.meta.url), 'utf8')

test('Apply repite la barrera global antes de cambiar el lote a processing', () => {
  const applyStart = actions.indexOf("export async function applyBulkImportChunkAction")
  const preflight = actions.indexOf('runStoredBatchPreflight(supabase, batch)', applyStart)
  const barrier = actions.indexOf('assertBulkImportBatchCanApply(preflight)', preflight)
  const processing = actions.indexOf("status: 'processing'", applyStart)
  assert.ok(applyStart >= 0 && preflight > applyStart && barrier > preflight && processing > barrier)
})

test('el Panel comunica el bloqueo global y no promete aplicación parcial', () => {
  assert.match(workspace, /mientras exista un solo registro inválido no se escribirá ninguno/)
  assert.match(workspace, /La barrera completa se comprobará otra vez antes de la primera escritura/)
  assert.doesNotMatch(`${workspace}\n${moduleIndex}`, /aplicación parcial/)
})

test('el detalle muestra operación solicitada, efectiva, referencias y estado por fila', () => {
  assert.match(detail, /Plan efectivo por registro/)
  assert.match(detail, /requested_operation/)
  assert.match(detail, /effective_operation/)
  assert.match(detail, /resolved_references/)
  assert.match(detail, /item\.result\?\.state/)
})
