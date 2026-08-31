import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const migration = read('supabase/migrations_archive/first-edition/20260827001549_panel_legal_drafts.sql')
const page = read('app/panel/(protected)/legal/page.js')
const actions = read('app/panel/(protected)/legal/actions.js')
const navigation = read('lib/panel/navigation.js')

test('los borradores legales quedan privados y protegidos por RLS', () => {
  assert.match(migration, /alter table public\.legal_drafts enable row level security/)
  assert.match(migration, /revoke all on table public\.legal_drafts from public, anon/)
  assert.match(migration, /for select to authenticated[\s\S]*public\.is_panel_member/)
  assert.match(migration, /for update to authenticated[\s\S]*public\.can_edit_panel/)
  assert.doesNotMatch(migration, /to anon[\s\S]*using/)
})

test('el Panel mantiene privada la ficha de Dirección y controla los documentos públicos', () => {
  for (const key of ['direction_sheet', 'legal_notice', 'privacy_policy', 'storage_policy']) {
    assert.match(migration, new RegExp(`'${key}'`))
  }
  assert.match(page, /La ficha de Dirección siempre es privada/)
  assert.match(page, /«Listo internamente» publica los tres textos legales/)
  assert.match(navigation, /href: '\/panel\/legal'/)
})

test('solo un editor autenticado puede guardar y la edición queda auditada', () => {
  assert.match(actions, /requirePanelEditor/)
  assert.match(actions, /from\('legal_drafts'\)[\s\S]*\.update\(payload\)/)
  assert.match(actions, /object_type: 'legal_draft'/)
  assert.match(actions, /revalidatePath\('\/panel\/legal'\)/)
})
