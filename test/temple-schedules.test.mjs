import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const migrationUrl = new URL(
  '../supabase/migrations/20260901135411_documenta_horarios_templos_septiembre_2026.sql',
  import.meta.url,
)

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('los cuatro horarios quedan documentados sin abrir esquema nuevo', async () => {
  const migration = await readFile(migrationUrl, 'utf8')

  for (const slug of [
    'parroquia-de-la-milagrosa-sevilla',
    'capilla-de-la-piedad-sevilla',
    'capilla-virgen-de-la-estrella-sevilla',
    'basilica-del-santisimo-cristo-de-la-expiracion-sevilla',
  ]) {
    assert.match(migration, new RegExp(slug))
  }

  assert.match(migration, /opening_hours_verified_at/)
  assert.match(migration, /date '2026-09-01'/)
  assert.match(migration, /Despacho parroquial/)
  assert.match(migration, /Exposición del Santísimo/)
  assert.match(migration, /source_links/)
  assert.doesNotMatch(migration, /\b(create|alter|drop)\s+(table|policy|view|function|index)\b/i)
  assert.doesNotMatch(migration, /update\s+public\.entities[\s\S]*?set[\s\S]*?status\s*=/i)
})

test('la ficha presenta el campo libre como horarios del templo y respeta sus saltos', async () => {
  const [overview, styles] = await Promise.all([
    source('components/BrotherhoodOverviewV2.js'),
    source('components/BrotherhoodOverviewV2.module.css'),
  ])

  assert.match(overview, /Horarios del templo/)
  assert.match(overview, /Sede y visita/)
  assert.match(overview, /Sede canónica, horarios y visita/)
  assert.match(overview, /Sede · Horarios del templo/)
  assert.match(overview, /Planifica tu visita/)
  assert.match(overview, /seat\.horarioApertura/)
  assert.match(overview, /scheduleLines\(seat\?\.horarioApertura\)/)
  assert.match(styles, /\.hoursHero[\s\S]*linear-gradient/)
  assert.match(styles, /\.hoursList/)
  assert.match(styles, /\.hoursRow/)
  assert.match(styles, /\.hours_mass/)
})
