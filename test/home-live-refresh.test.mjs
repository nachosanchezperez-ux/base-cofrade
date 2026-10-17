import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  EMPTY_HOME_BRIEFING,
  HOME_UPCOMING_AGENDA_LIMIT,
  refreshHomeLive,
  selectBriefingCandidates,
} from '../lib/home-live-refresh.js'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

// 2026-10-11 en Madrid (CEST, UTC+2): las horas locales se pasan a UTC restando 2.
const at = (hhmm) => new Date(`2026-10-11T${hhmm}:00Z`)
const outing = (id, departureTime, returnTime, extra = {}) => ({
  id,
  date: '2026-10-11',
  departureTime,
  returnTime,
  title: id,
  ...extra,
})

const briefing = (label) => ({ schedule: [{ id: label }], bands: [], liturgicalMusic: [], places: [] })

test('una cita pasa a "En curso" aunque el snapshot se guardara antes de empezar', () => {
  const snapshot = {
    agendaPool: [outing('tarde', '18:00', '21:00'), outing('noche', '22:00', '23:30')],
    briefingsByOutingId: { tarde: briefing('tarde'), noche: briefing('noche') },
    editorialHighlights: [],
    upcomingAgenda: [],
    featuredBriefing: EMPTY_HOME_BRIEFING,
  }

  const antes = refreshHomeLive(snapshot, at('14:00')) // 16:00 en Madrid
  assert.equal(antes.upcomingAgenda[0].liveState.state, 'today')
  assert.deepEqual(antes.featuredBriefing, EMPTY_HOME_BRIEFING)

  const durante = refreshHomeLive(snapshot, at('17:00')) // 19:00 en Madrid
  assert.equal(durante.upcomingAgenda[0].id, 'tarde')
  assert.equal(durante.upcomingAgenda[0].liveState.state, 'live')
  assert.equal(durante.featuredBriefing.schedule[0].id, 'tarde')
})

test('las citas terminadas desaparecen y la siguiente en curso toma el relevo', () => {
  const snapshot = {
    agendaPool: [outing('tarde', '18:00', '21:00'), outing('noche', '22:00', '23:30')],
    briefingsByOutingId: { tarde: briefing('tarde'), noche: briefing('noche') },
    editorialHighlights: [],
  }

  const despues = refreshHomeLive(snapshot, at('21:00')) // 23:00 en Madrid
  assert.deepEqual(despues.upcomingAgenda.map((item) => item.id), ['noche'])
  assert.equal(despues.upcomingAgenda[0].liveState.state, 'live')
  assert.equal(despues.featuredBriefing.schedule[0].id, 'noche')
})

test('la cita en curso se ordena antes que las que solo son de hoy', () => {
  const snapshot = {
    agendaPool: [outing('tarde', '19:00', '21:00'), outing('mediodia', '12:00', '15:00')],
    briefingsByOutingId: {},
    editorialHighlights: [],
  }

  const refreshed = refreshHomeLive(snapshot, at('11:00')) // 13:00 en Madrid
  assert.deepEqual(refreshed.upcomingAgenda.map((item) => item.id), ['mediodia', 'tarde'])
  assert.equal(refreshed.upcomingAgenda[0].liveState.state, 'live')
  // Sin briefing guardado para esa cita, la portada recibe uno vacío y no falla.
  assert.deepEqual(refreshed.featuredBriefing, EMPTY_HOME_BRIEFING)
})

test('la lista de próximas citas conserva el recorte de la portada', () => {
  const snapshot = {
    agendaPool: Array.from({ length: 12 }, (_, index) => ({
      id: `futura-${index}`,
      date: `2026-11-${String(index + 1).padStart(2, '0')}`,
      departureTime: '20:00',
    })),
    briefingsByOutingId: {},
    editorialHighlights: [],
  }

  assert.equal(refreshHomeLive(snapshot, at('10:00')).upcomingAgenda.length, HOME_UPCOMING_AGENDA_LIMIT)
})

test('los destacados editoriales se actualizan y se retiran al terminar', () => {
  const snapshot = {
    agendaPool: [],
    briefingsByOutingId: {},
    editorialHighlights: [
      { outing: outing('destacada', '18:00', '21:00'), briefing: briefing('destacada') },
      { outing: outing('terminada', '09:00', '10:00'), briefing: briefing('terminada') },
    ],
  }

  const refreshed = refreshHomeLive(snapshot, at('17:00'))
  assert.deepEqual(refreshed.editorialHighlights.map((item) => item.outing.id), ['destacada'])
  assert.equal(refreshed.editorialHighlights[0].outing.liveState.state, 'live')
  assert.equal(refreshed.editorialHighlights[0].briefing.schedule[0].id, 'destacada')
})

test('un snapshot de una versión anterior, sin agendaPool, se devuelve sin tocar', () => {
  const legacy = { upcomingAgenda: [{ id: 'x' }], featuredBriefing: EMPTY_HOME_BRIEFING }
  assert.equal(refreshHomeLive(legacy, at('12:00')), legacy)
  assert.equal(refreshHomeLive(null, at('12:00')), null)
})

test('no muta el snapshot cacheado', () => {
  const snapshot = {
    agendaPool: [outing('tarde', '18:00', '21:00')],
    briefingsByOutingId: {},
    editorialHighlights: [],
  }
  const copia = JSON.parse(JSON.stringify(snapshot))
  refreshHomeLive(snapshot, at('17:00'))
  assert.deepEqual(snapshot, copia)
})

test('solo se guardan los briefings de lo que puede pasar a "En curso"', () => {
  const pool = [
    { id: 'hoy', date: '2026-10-11', liveState: { state: 'today' } },
    { id: 'en-curso', date: '2026-10-10', liveState: { state: 'live' } },
    { id: 'futura-1', date: '2026-10-20', liveState: { state: 'upcoming' } },
    { id: 'futura-2', date: '2026-10-21', liveState: { state: 'upcoming' } },
  ]
  assert.deepEqual(selectBriefingCandidates(pool, '2026-10-11').map((item) => item.id), ['hoy', 'en-curso'])

  const muchas = Array.from({ length: 9 }, (_, index) => ({ id: `h${index}`, date: '2026-10-11', liveState: { state: 'today' } }))
  assert.equal(selectBriefingCandidates(muchas, '2026-10-11').length, 4)
  assert.deepEqual(selectBriefingCandidates(undefined, ''), [])
})

test('la portada cachea 5 minutos, recalcula lo horario por petición y se invalida desde el Panel', () => {
  const snapshot = read('lib/supabase/home-snapshot.js')

  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v26-igualas/)
  assert.match(snapshot, /revalidate: 300/)
  assert.doesNotMatch(snapshot, /revalidate: 60\b/)
  assert.match(snapshot, /tags: \['home-public'\]/)
  assert.match(snapshot, /refreshHomeLive\(snapshot, now\)/)
  assert.match(snapshot, /buildHomeTemporalAgenda\(\{[\s\S]{0,120}now,/)
  assert.match(snapshot, /agendaPool: remainingCandidates/)
  assert.match(snapshot, /briefingsByOutingId/)
})

test('las ediciones de salidas del Panel invalidan el snapshot de la portada', () => {
  const sources = {
    helper: read('lib/panel/revalidate-outings.js'),
    horarios: read('app/panel/(protected)/extraordinarias/[id]/horarios/actions.js'),
    general: read('app/panel/(protected)/extraordinarias/[id]/general/actions.js'),
    musica: read('app/panel/(protected)/extraordinarias/[id]/musica/actions.js'),
    extraordinaria: read('app/panel/(protected)/extraordinarias/[id]/actions.js'),
    importar: read('app/panel/(protected)/datos/importar/actions.js'),
    bandas: read('app/panel/(protected)/bandas/[id]/actions.js'),
  }

  for (const [name, source] of Object.entries(sources)) {
    assert.match(source, /revalidateTag\('home-public', \{ expire: 0 \}\)/, `${name} debe invalidar home-public`)
    assert.match(source, /import \{[^}]*revalidateTag[^}]*\} from 'next\/cache'/, `${name} debe importar revalidateTag`)
  }
})
