import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Bandas no vuelve a ofrecer plataformas que ya tienen un enlace', async () => {
  const page = await readFile(new URL('../app/panel/(protected)/bandas/[id]/canales/page.js', import.meta.url), 'utf8')

  assert.match(page, /SOCIAL_PLATFORMS\.filter\(\(\[value\]\) => !excludedPlatforms\.includes\(value\)\)/)
  assert.match(page, /const usedPlatforms = data\.socialLinks\.map\(\(item\) => item\.platform\)/)
  assert.match(page, /excludedPlatforms=\{usedPlatforms\}/)
  assert.match(page, /usedPlatforms\.length < SOCIAL_PLATFORMS\.length/)
  assert.match(page, /<option value="">Selecciona una plataforma<\/option>/)
  assert.doesNotMatch(page, /defaultValue=\{item\?\.platform \|\| 'website'\}/)
})

test('PostgreSQL conserva una sola plataforma por entidad como última barrera', async () => {
  const migration = await readFile(new URL('../supabase/migrations/20260813090020_enlaces_oficiales_entidades.sql', import.meta.url), 'utf8')

  assert.match(migration, /unique\s*\(entity_id,\s*platform\)/i)
})
