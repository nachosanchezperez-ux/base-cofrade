import assert from 'node:assert/strict'
import test from 'node:test'

import {
  agendaItemMatchesQuery,
  agendaPeriodRange,
  agendaQueryCategory,
  agendaQueryHref,
  agendaQueryPeriod,
} from '../lib/tira-agenda-query.js'
import { freeFactIntent } from '../lib/tira-free-facts.js'
import { publishedContentIntent } from '../lib/tira-published-content.js'

test('las consultas municipales con acto o periodo llegan a la Agenda', () => {
  assert.equal(publishedContentIntent('Rosarios en Utrera')?.kind, 'agenda')
  assert.equal(publishedContentIntent('Procesiones en La Rinconada')?.kind, 'agenda')
  assert.equal(publishedContentIntent('¿Qué hay en Tomares este fin de semana?')?.kind, 'agenda')
  assert.equal(publishedContentIntent('¿Qué hay mañana en Tomares?')?.kind, 'agenda')
})

test('Glorias y extraordinarias conservan su intención especializada', () => {
  assert.equal(publishedContentIntent('Procesiones de Gloria en La Rinconada')?.kind, 'glory_processions')
  assert.equal(publishedContentIntent('Procesiones extraordinarias en Utrera')?.kind, 'extraordinary_outings')
})

test('el resumen municipal general no secuestra consultas temporales de Agenda', () => {
  assert.equal(freeFactIntent('¿Qué hay en Tomares?')?.kind, 'municipality_overview')
  assert.equal(freeFactIntent('¿Qué hay en Tomares este fin de semana?'), null)
  assert.equal(freeFactIntent('¿Qué hay en Tomares hoy?'), null)
  assert.equal(freeFactIntent('¿Qué hay en Utrera de rosarios?'), null)
})

test('detecta categoría y periodo de la consulta', () => {
  assert.equal(agendaQueryCategory('procesiones en La Rinconada'), 'processions')
  assert.equal(agendaQueryCategory('rosarios en Utrera'), 'rosaries')
  assert.equal(agendaQueryCategory('conciertos en Sevilla'), 'concerts')
  assert.equal(agendaQueryPeriod('qué hay en Tomares este fin de semana'), 'weekend')
  assert.equal(agendaQueryPeriod('qué hay mañana en Tomares'), 'tomorrow')
  assert.equal(agendaQueryPeriod('actos esta semana en Utrera'), 'week')
})

test('este fin de semana usa el mismo criterio sábado-domingo de la Agenda', () => {
  assert.deepEqual(agendaPeriodRange('2026-09-17', 'weekend'), ['2026-09-19', '2026-09-20'])
  assert.deepEqual(agendaPeriodRange('2026-09-19', 'weekend'), ['2026-09-19', '2026-09-20'])
  assert.deepEqual(agendaPeriodRange('2026-09-20', 'weekend'), ['2026-09-19', '2026-09-20'])
})

test('combina municipio, categoría y periodo sin mezclar resultados', () => {
  const base = {
    isUpcoming: true,
    isCancelled: false,
    endDate: '',
  }
  const items = [
    { ...base, municipality: 'Tomares', category: 'processions', date: '2026-09-19' },
    { ...base, municipality: 'Tomares', category: 'rosaries', date: '2026-09-19' },
    { ...base, municipality: 'Utrera', category: 'processions', date: '2026-09-19' },
    { ...base, municipality: 'Tomares', category: 'processions', date: '2026-09-26' },
  ]

  const matches = items.filter((item) => agendaItemMatchesQuery(item, {
    today: '2026-09-17',
    municipality: 'Tomares',
    category: 'processions',
    period: 'weekend',
  }))

  assert.equal(matches.length, 1)
  assert.equal(matches[0].municipality, 'Tomares')
  assert.equal(matches[0].category, 'processions')
  assert.equal(matches[0].date, '2026-09-19')
})

test('los actos de varios días cuentan si solapan el periodo consultado', () => {
  const item = {
    municipality: 'Tomares',
    category: 'devotions',
    date: '2026-09-18',
    endDate: '2026-09-20',
    isUpcoming: true,
    isCancelled: false,
  }

  assert.equal(agendaItemMatchesQuery(item, {
    today: '2026-09-17',
    municipality: 'Tomares',
    category: 'devotions',
    period: 'weekend',
  }), true)
})

test('el enlace devuelve la Agenda con los filtros municipales compatibles', () => {
  const utrera = agendaQueryHref({ category: 'rosaries', period: 'weekend', municipality: 'Utrera' })
  assert.match(utrera, /^\/agenda-cofrade\?/)
  assert.match(utrera, /categoria=rosaries/)
  assert.match(utrera, /periodo=weekend/)
  assert.match(utrera, /territorio=province/)
  assert.match(utrera, /municipio=utrera/)
  assert.match(utrera, /#agenda$/)

  const sevilla = agendaQueryHref({ category: 'concerts', period: 'today', municipality: 'Sevilla' })
  assert.match(sevilla, /territorio=capital/)
  assert.doesNotMatch(sevilla, /municipio=/)
})
