import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = (path) => fs.readFileSync(path, 'utf8')

test('las rutas legales públicas existen y leen solo documentos listos', () => {
  for (const path of ['app/aviso-legal/page.js', 'app/privacidad/page.js', 'app/cookies/page.js']) {
    assert.ok(fs.existsSync(path), `${path} debe existir`)
  }
  const loader = read('lib/supabase/public-legal.js')
  assert.match(loader, /\.eq\('status', 'ready'\)/)
  assert.match(loader, /select\('document_key, title, body, updated_at'\)/)
  assert.doesNotMatch(loader, /internal_notes|updated_by|direction_sheet/)
})

test('RLS limita el acceso público a los tres documentos aprobados', () => {
  const migration = read('supabase/migrations_archive/first-edition/20260828212940_publish_ready_legal_documents.sql')
  assert.match(migration, /status = 'ready'/)
  assert.match(migration, /'legal_notice', 'privacy_policy', 'storage_policy'/)
  assert.doesNotMatch(migration, /direction_sheet/)
  assert.match(migration, /grant select \(document_key, title, body, status, updated_at\)/)
})

test('el Footer enlaza las tres páginas legales', () => {
  const footer = read('components/HiloFooter.js')
  for (const href of ['/aviso-legal', '/privacidad', '/cookies']) {
    assert.match(footer, new RegExp(`href=["']${href}["']`))
  }
})

test('el sitemap incorpora la superficie legal pública', () => {
  const sitemap = read('app/sitemap.js')
  for (const path of ['/aviso-legal', '/privacidad', '/cookies']) {
    assert.match(sitemap, new RegExp(`absoluteUrl\\('${path}'\\)`))
  }
})
