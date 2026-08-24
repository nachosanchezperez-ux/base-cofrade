import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la fuente de Salve Pastora se conserva como anuncio previo y no como prueba del estreno', async () => {
  const migration = await source(
    'supabase/migrations/20260824003035_reconcile_salve_pastora_premiere_evidence.sql',
  )

  assert.match(
    migration,
    /https:\/\/cantillanaysupastora\.blogspot\.com\/2013\/06\/nueva-marcha-dedicada-la-divina-pastora\.html/,
  )
  assert.match(migration, /Patrimonio musical · anuncio de estreno/)
  assert.match(migration, /Fuente contemporánea previa al acto/)
  assert.match(migration, /No acredita por sí sola que el estreno llegara a celebrarse/)
  assert.doesNotMatch(
    migration,
    /Fuente específica para la relación[^\n]+y su estreno del 8 de septiembre de 2013/,
  )
})

test('los campos canónicos de estreno efectivo vuelven a quedar abiertos hasta disponer de confirmación posterior', async () => {
  const migration = await source(
    'supabase/migrations/20260824003035_reconcile_salve_pastora_premiere_evidence.sql',
  )

  assert.match(migration, /premiere_date = null/)
  assert.match(migration, /premiere_date_text = null/)
  assert.match(migration, /premiered_by_band_entity_id = null/)
  assert.match(migration, /la celebración efectiva queda pendiente de confirmación documental/)
  assert.match(migration, /march\.premiere_date = date '2013-09-08'/)
  assert.match(migration, /work\.slug = 'salve-pastora-david-alvarez'/)
  assert.match(migration, /band\.slug = 'banda-del-sol'/)
})

test('la corrección se ejecuta después de las migraciones reproducibles que introdujeron la inferencia', async () => {
  const structured = await source(
    'supabase/migrations/20260824002000_structured_simpecados_and_musical_work_types.sql',
  )
  const sourceMigration = await source(
    'supabase/migrations/20260824002500_source_salve_pastora_premiere.sql',
  )
  const correction = await source(
    'supabase/migrations/20260824003035_reconcile_salve_pastora_premiere_evidence.sql',
  )

  assert.match(structured, /premiere_date='2013-09-08'/)
  assert.match(sourceMigration, /estreno previsto/)
  assert.match(correction, /premiere_date = null/)
  assert.ok('20260824003035' > '20260824002500')
})
