import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la ficha pública usa módulos propios para cultos y Simpecados', async () => {
  const page = await source('app/hermandades/[slug]/page.js')

  assert.match(page, /BrotherhoodCultsSection/)
  assert.match(page, /BrotherhoodSimpecadosSection/)
  assert.match(page, /href: '#simpecados'/)
  assert.match(page, /@\/lib\/supabase\/brotherhood-page/)
  assert.doesNotMatch(page, /bc-cult-grid/)
})

test('los carteles respetan la proporción real de su imagen', async () => {
  const component = await source('components/FestivalPostersSection.js')
  const visualLoader = await source('lib/supabase/brotherhood-visual-sections.js')

  assert.match(component, /image\.width/)
  assert.match(component, /image\.height/)
  assert.match(component, /style=\{\{ aspectRatio:/)
  assert.match(visualLoader, /getPublishedEntityCoverMediaMap/)
})

test('los Simpecados salen del patrimonio genérico y obtienen sección propia', async () => {
  const loader = await source('lib/supabase/brotherhood-visual-sections.js')

  assert.match(loader, /function isSimpecado/)
  assert.match(loader, /simpecados: simpecados\.map/)
  assert.match(loader, /patrimonio: patrimonioGeneral/)
})

test('las fotografías de cultos tienen lectura pública y subida editorial propia', async () => {
  const publicLoader = await source('lib/supabase/cult-media.js')
  const panelAction = await source('app/panel/(protected)/hermandades/[id]/multimedia/actions.js')
  const panelPage = await source('app/panel/(protected)/hermandades/[id]/multimedia/page.js')
  const migration = await source('supabase/migrations/20260824164500_cult_media.sql')

  assert.match(publicLoader, /createPublicClient/)
  assert.match(publicLoader, /PUBLIC_RIGHTS_STATUSES/)
  assert.match(panelAction, /targetKind === 'cult'/)
  assert.match(panelAction, /relationTable = targetKind === 'cult' \? 'cult_media'/)
  assert.match(panelPage, /Fotos de portada para los Cultos/)
  assert.match(migration, /create table if not exists public\.cult_media/)
  assert.match(migration, /cult_media_single_cover_idx/)
  assert.match(migration, /Public cult media/)
})
