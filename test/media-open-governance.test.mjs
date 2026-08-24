import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Git representa las migraciones remotas previas sin una versión duplicada de la Pastora', async () => {
  const pastora = await read('supabase/migrations/20260823232704_pastora_cantillana_identidad_cromatica.sql')
  const sourceLinks = await read('supabase/migrations/20260823234637_harden_public_source_link_targets.sql')

  assert.match(pastora, /pastora-de-cantillana/)
  assert.match(pastora, /#257FA1/)
  assert.match(sourceLinks, /create policy "Public source links"/)
  assert.match(sourceLinks, /num_nonnulls\(/)
  assert.match(sourceLinks, /brotherhood_habit_id/)

  await assert.rejects(
    read('supabase/migrations/20260824012800_pastora_cantillana_identidad_cromatica.sql'),
    /ENOENT/,
  )
})

test('Supabase exige licencia abierta admitida y procedencia completa', async () => {
  const migration = await read('supabase/migrations/20260824015300_guard_open_media_provenance.sql')

  assert.match(migration, /open_media_provenance_is_valid/)
  assert.match(migration, /media_assets_open_provenance_check/)
  assert.match(migration, /CC BY-SA 4\.0/)
  assert.match(migration, /'cc0 1\.0'/)
  assert.match(migration, /rights_holder/)
  assert.match(migration, /permission_notes/)
  assert.match(migration, /commons\[\.\]wikimedia\[\.\]org\/wiki\/\(File\|Archivo\):/)
  assert.match(migration, /create policy "Publishable media assets"/)
})

test('el Panel explica y valida el mismo contrato antes de enviar', async () => {
  const component = await read('components/panel/MediaRightsGovernance.js')
  const layout = await read('app/panel/(protected)/layout.js')

  assert.match(component, /OPEN_RIGHTS/)
  assert.match(component, /REQUIRED_OPEN_FIELDS/)
  assert.match(component, /author_name/)
  assert.match(component, /rights_holder/)
  assert.match(component, /source_url/)
  assert.match(component, /permission_notes/)
  assert.match(component, /reportValidity\(\)/)
  assert.match(component, /File:/)
  assert.match(layout, /<MediaRightsGovernance canEdit=\{canEdit\} \/>/)
})

test('el protocolo documenta licencias admitidas, exclusiones y reacción ante faltas', async () => {
  const protocol = await read('docs/MEDIA-ABIERTA.md')

  assert.match(protocol, /CC BY-SA 1\.0, 2\.0, 2\.5, 3\.0 o 4\.0/)
  assert.match(protocol, /CC0 1\.0/)
  assert.match(protocol, /licencias NC/)
  assert.match(protocol, /licencias ND/)
  assert.match(protocol, /Todos los derechos reservados/)
  assert.match(protocol, /Panel:/)
  assert.match(protocol, /Supabase:/)
  assert.match(protocol, /Front \/ RLS:/)
  assert.match(protocol, /5 de 5/)
})
