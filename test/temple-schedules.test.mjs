import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { runInNewContext } from 'node:vm'

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
  assert.match(overview, /scheduleEntries/)
  assert.match(overview, /highlightedSchedule/)
  assert.match(overview, /styles\.hoursDays/)
  assert.match(overview, /styles\.timeChip/)
  assert.match(overview, /!publicText\(seat\.direccion\) && seat\.localidad/)
  assert.match(styles, /\.hoursHero[\s\S]*linear-gradient/)
  assert.match(styles, /\.hoursList/)
  assert.match(styles, /\.hoursRow/)
  assert.match(styles, /\.hoursMarker svg/)
  assert.match(styles, /\.hoursEntry/)
  assert.match(styles, /\.hoursContent > b \{[\s\S]*?font-size: 12px/)
  assert.match(styles, /\.hoursDays \{[\s\S]*?font-size: 12px/)
  assert.match(styles, /\.hoursDetail \{[\s\S]*?font-size: 13px/)
  assert.match(styles, /\.timeChip \{[\s\S]*?font-size: 12px/)
  assert.match(styles, /\.seatActions a \{[\s\S]*?min-height: 44px/)
  assert.match(styles, /\.seatActions a:focus-visible/)
})

test('un rango compacto no se confunde con una etiqueta de días', async () => {
  const overview = await source('components/BrotherhoodOverviewV2.js')
  const start = overview.indexOf('function scheduleEntries')
  const end = overview.indexOf('\n\nfunction scheduleLines', start)
  const scheduleEntries = runInNewContext(`(${overview.slice(start, end)})`)

  assert.equal(
    JSON.stringify(scheduleEntries('18:30–20:30').map(({ days, detail }) => ({ days, detail }))),
    JSON.stringify([{ days: '', detail: '18:30–20:30' }]),
  )
})
