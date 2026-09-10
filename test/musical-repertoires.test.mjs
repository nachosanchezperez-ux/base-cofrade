import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

const migration = source('supabase/migrations/20260910181542_crucetas_musicales.sql')

test('la cruceta modela una banda en una salida y conserva el paso relacionado', () => {
  assert.match(migration, /create table public\.musical_repertoires/)
  assert.match(migration, /outing_id uuid not null references public\.outings/)
  assert.match(migration, /band_entity_id uuid not null references public\.entities/)
  assert.match(migration, /step_entity_id uuid references public\.entities/)
  assert.match(migration, /unique \(outing_id, band_entity_id\)/)
})

test('las cantidades expresan interpretaciones sin inventar consecutividad', () => {
  assert.match(migration, /performance_count integer not null default 1/)
  assert.match(migration, /No expresa si fueron consecutivas/)
  assert.doesNotMatch(migration, /consecutive|consecutivas_count|is_consecutive/i)
  assert.match(migration, /'pasan-los-campanilleros-manuel-lopez-farfan'[^\n]+,2\)/)
  assert.match(migration, /'el-turuta-roman-san-jose-redondo'[^\n]+,4\)/)
})

test('la carga de Pastora 2026 queda cerrada en 48 obras y 60 interpretaciones', () => {
  assert.match(migration, /<> 48/)
  assert.match(migration, /<> 60/)
  assert.match(migration, /'macarena-emilio-cebrian'/)
  assert.match(migration, /'macarena-abel-moreno'/)
  assert.match(migration, /insert into public\.agents \(entity_id, agent_kind, description\)/)
})

test('la lectura pública está protegida y usa el cliente sin sesión', () => {
  const loader = source('lib/supabase/musical-repertoires.js')

  assert.match(migration, /enable row level security/g)
  assert.match(migration, /status = 'published'/)
  assert.match(migration, /band\.entity_type = 'band'/)
  assert.match(loader, /import 'server-only'/)
  assert.match(loader, /createPublicClient/)
  assert.doesNotMatch(loader, /createClient|next\/headers|cookies\(/)
})

test('la sección es descubrible y enlaza las fichas de Hermandad y Banda', () => {
  const header = source('components/HiloHeader.js')
  const sitemap = source('app/sitemap.js')
  const brotherhood = source('app/hermandades/[slug]/page.js')
  const band = source('app/bandas/[slug]/page.js')
  const detail = source('app/crucetas-musicales/[slug]/page.js')

  assert.match(header, /\['\/crucetas-musicales', 'Crucetas musicales'\]/)
  assert.match(sitemap, /getMusicalRepertoires/)
  assert.match(brotherhood, /getMusicalRepertoires\(\{ brotherhoodEntityId: h\.id \}\)/)
  assert.match(band, /getMusicalRepertoires\(\{ bandEntityId: band\.id \}\)/)
  assert.match(detail, /href=\{repertoire\.brotherhood\.href\}/)
  assert.match(detail, /href=\{repertoire\.band\.href\}/)
})
