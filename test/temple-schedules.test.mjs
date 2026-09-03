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

test('la ficha presenta los horarios con lectura editorial y sin pastillas', async () => {
  const [overview, scheduleStyles, overviewStyles, balanceStyles] = await Promise.all([
    source('components/BrotherhoodOverviewV2.js'),
    source('components/BrotherhoodOverviewSchedule.module.css'),
    source('components/BrotherhoodOverviewV2.module.css'),
    source('components/BrotherhoodOverviewBalance.module.css'),
  ])

  assert.match(overview, /Horarios del templo/)
  assert.match(overview, /Sede y visita/)
  assert.match(overview, /Sede canónica, horarios y visita/)
  assert.match(overview, /Sede · Horarios del templo/)
  assert.match(overview, /Planifica tu visita/)
  assert.match(overview, /Revisado · \{verified\}/)
  assert.match(overview, /Cómo llegar/)
  assert.match(overview, /seat\.horarioApertura/)
  assert.match(overview, /scheduleLines\(seat\?\.horarioApertura\)/)
  assert.match(overview, /scheduleEntries/)
  assert.match(overview, /scheduleLineParts/)
  assert.match(overview, /highlightedSchedule/)
  assert.match(overview, /scheduleStyles\.days/)
  assert.match(overview, /scheduleStyles\.time/)
  assert.match(overview, /BrotherhoodOverviewBalance\.module\.css/)
  assert.match(overview, /balanceStyles\.balancedGrid/)
  assert.match(overview, /balanceStyles\.identityFactsBalanced/)
  assert.match(overview, /balanceStyles\.seatActionsBalanced/)
  assert.doesNotMatch(overview, /styles\.timeChip|scheduleStyles\.timeChip/)
  assert.doesNotMatch(overview, /styles\.closedChip|scheduleStyles\.closedChip/)
  assert.match(overview, /!publicText\(seat\.direccion\) && seat\.localidad/)

  assert.match(scheduleStyles, /\.hero \{[\s\S]*?background: #17324d/)
  assert.match(scheduleStyles, /\.hero \{[\s\S]*?inset 3px 0 var\(--brotherhood-secondary/)
  assert.match(scheduleStyles, /\.row \{[\s\S]*?grid-template-columns: minmax\(128px, \.58fr\) minmax\(0, 1\.82fr\)/)
  assert.match(scheduleStyles, /\.entry \{[\s\S]*?grid-template-columns: minmax\(108px, \.7fr\) minmax\(0, 1\.5fr\)/)
  assert.match(scheduleStyles, /\.time \{[^}]*font-weight: 850/)
  assert.doesNotMatch(scheduleStyles, /\.time \{[^}]*(?:background|border-radius|display:\s*inline-flex)/)
  assert.match(scheduleStyles, /@media \(max-width: 620px\)[\s\S]*?\.row \{[\s\S]*?grid-template-columns: 1fr/)
  assert.match(scheduleStyles, /@media \(max-width: 620px\)[\s\S]*?\.entry \{[\s\S]*?grid-template-columns: 1fr/)
  assert.match(overviewStyles, /\.seatActions a \{[\s\S]*?min-height: 44px/)
  assert.match(overviewStyles, /\.seatActions a:focus-visible/)

  assert.match(balanceStyles, /\.balancedGrid \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(balanceStyles, /\.seatBalanced \{[\s\S]*?display: flex[\s\S]*?flex-direction: column/)
  assert.match(balanceStyles, /\.seatActionsBalanced \{[\s\S]*?margin-top: auto/)
  assert.match(balanceStyles, /\.identityFactsBalanced\[data-count='2'\][\s\S]*?1\.7fr/)
  assert.match(balanceStyles, /@media \(min-width: 1120px\)[\s\S]*?\.seatHistoryBalanced > div[\s\S]*?repeat\(2/)
  assert.match(balanceStyles, /@media \(max-width: 900px\)[\s\S]*?\.seatBalanced \{[\s\S]*?display: block/)
})

test('un rango compacto no se confunde con una etiqueta de días', async () => {
  const overview = await source('components/BrotherhoodOverviewV2.js')
  const start = overview.indexOf('function scheduleEntries')
  const end = overview.indexOf('\n\nfunction scheduleLineParts', start)
  const scheduleEntries = runInNewContext(`(${overview.slice(start, end)})`)

  assert.equal(
    JSON.stringify(scheduleEntries('18:30–20:30').map(({ days, detail }) => ({ days, detail }))),
    JSON.stringify([{ days: '', detail: '18:30–20:30' }]),
  )
})

test('misas conserva la temporada dentro del nombre del bloque', async () => {
  const overview = await source('components/BrotherhoodOverviewV2.js')
  const start = overview.indexOf('function scheduleLineParts')
  const end = overview.indexOf('\n\nfunction scheduleLines', start)
  const scheduleLineParts = runInNewContext(`(${overview.slice(start, end)})`)

  assert.deepEqual(
    JSON.parse(JSON.stringify(scheduleLineParts('Misas · invierno · L–S: 09:00 · 12:00 · 18:30 · 20:00'))),
    {
      label: 'Misas · invierno',
      value: 'L–S: 09:00 · 12:00 · 18:30 · 20:00',
    },
  )
})

test('el horario elimina etiquetas repetidas sin perder días ni horas', async () => {
  const overview = await source('components/BrotherhoodOverviewV2.js')
  const start = overview.indexOf('function scheduleLineParts')
  const end = overview.indexOf('\n\nfunction scheduleLines', start)
  const scheduleLineParts = runInNewContext(`(${overview.slice(start, end)})`)

  assert.deepEqual(
    JSON.parse(JSON.stringify(scheduleLineParts('Apertura · Apertura: L–S: 08:00–13:00'))),
    {
      label: 'Apertura',
      value: 'L–S: 08:00–13:00',
    },
  )

  assert.deepEqual(
    JSON.parse(JSON.stringify(scheduleLineParts('Misas · Misas: D: 10:00 · 12:00'))),
    {
      label: 'Misas',
      value: 'D: 10:00 · 12:00',
    },
  )
})