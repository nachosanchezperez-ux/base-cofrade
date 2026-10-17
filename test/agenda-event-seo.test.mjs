import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  agendaEventLongDate,
  agendaEventPerformers,
  agendaEventSeoDescription,
  agendaEventSeoTitle,
  cleanAgendaEventTitle,
  shortBrotherhoodContext,
} from '../lib/agenda-event-seo.js'
import { gloryDisplayTitle } from '../lib/glory-display.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el título limpio no deja separadores ni el año duplicado', () => {
  assert.equal(cleanAgendaEventTitle('Procesión de Nuestra Señora del Santo Rosario de la Macarena · 2026', 2026), 'Procesión de Nuestra Señora del Santo Rosario de la Macarena')
  assert.equal(cleanAgendaEventTitle('Procesión de San Benito Abad 2026', 2026), 'Procesión de San Benito Abad')
  assert.equal(cleanAgendaEventTitle('Histórico · Procesión extraordinaria del V Centenario fundacional', 2008), 'Procesión extraordinaria del V Centenario fundacional')
  assert.equal(gloryDisplayTitle('Procesión de Nuestra Señora del Santo Rosario de la Macarena · 2026', 2026), 'Nuestra Señora del Santo Rosario de la Macarena')
})

test('el título SEO conserva acto, contexto, municipio y año sin cortar el nombre', () => {
  assert.equal(
    agendaEventSeoTitle({ title: 'Procesión de Nuestra Señora del Santo Rosario de la Macarena · 2026', year: 2026, municipality: 'Sevilla', brotherhoodName: 'La Macarena', prefix: 'Procesión de' }),
    'Procesión de Nuestra Señora del Santo Rosario de la Macarena 2026'
  )
  assert.equal(
    agendaEventSeoTitle({ title: 'Nuestra Señora de los Dolores', year: 2026, municipality: 'Sevilla', brotherhoodName: 'Hermandad del Cerro del Águila', prefix: 'Salida extraordinaria de' }),
    'Nuestra Señora de los Dolores · Cerro del Águila (Sevilla) 2026'
  )
  assert.equal(
    agendaEventSeoTitle({ title: 'Ntra. Sra. de Guaditoca', year: 2026, municipality: 'Guadalcanal', brotherhoodName: 'Hermandad de Nuestra Señora de Guaditoca', prefix: 'Procesión de' }),
    'Procesión de Ntra. Sra. de Guaditoca (Guadalcanal) 2026'
  )
  const long = agendaEventSeoTitle({ title: 'Solemne Procesión de Alabanzas de la Coronación Canónica de Nuestra Señora del Amparo', year: 2026, municipality: 'Sevilla' })
  assert.doesNotMatch(long, /…/)
  for (const value of [long]) assert.ok(value.length <= 90)
})

test('el contexto de Hermandad se omite si repite la advocación o es un marcador', () => {
  assert.equal(shortBrotherhoodContext('Hermandad del Cerro del Águila'), 'Cerro del Águila')
  assert.equal(shortBrotherhoodContext('Hermandad por confirmar'), '')
  assert.equal(
    agendaEventSeoTitle({ title: 'Procesión de Nuestra Señora de la Cabeza de Sevilla · 2026', year: 2026, municipality: 'Sevilla', brotherhoodName: 'Real Cofradía Sevillana de Nuestra Señora de la Cabeza', prefix: 'Procesión de' }),
    'Procesión de Nuestra Señora de la Cabeza de Sevilla 2026'
  )
})

test('la descripción dice qué, quién, dónde y cuándo con fecha completa', () => {
  assert.equal(agendaEventLongDate('2026-10-25'), 'domingo, 25 de octubre de 2026')
  assert.equal(
    agendaEventSeoDescription({ title: 'Nuestra Señora de los Dolores', year: 2026, kindLabel: 'Salida extraordinaria', brotherhoodName: 'Hermandad del Cerro del Águila', municipality: 'Sevilla', date: '2026-09-06', time: '18:00', origin: 'Parroquia de los Dolores', coverage: ['recorrido', 'horarios'] }),
    'Salida extraordinaria de Nuestra Señora de los Dolores (Cerro del Águila) en Sevilla el domingo, 6 de septiembre de 2026, con salida a las 18:00 desde la Parroquia de los Dolores. Recorrido, horarios.'
  )
  assert.equal(
    agendaEventSeoDescription({ title: 'Rosario de la Aurora 2026', year: 2026, kindLabel: 'Rosario de la Aurora', municipality: 'Lebrija' }),
    'Rosario de la Aurora en Lebrija.'
  )
})

test('solo las bandas con ficha se publican como intérpretes, sin duplicados', () => {
  assert.deepEqual(agendaEventPerformers([
    { name: 'Las Cigarreras', href: '/bandas/las-cigarreras' },
    { name: 'Las Cigarreras', href: '/bandas/las-cigarreras' },
    { name: 'Coro sin ficha', href: '' },
    { name: 'Otra', href: '/hermandades/x' },
  ]), [{ '@type': 'MusicGroup', name: 'Las Cigarreras', url: 'https://hilocofrade.es/bandas/las-cigarreras' }])
})

test('Glorias, Rosarios y Extraordinarias usan la regla común y declaran intérpretes', () => {
  for (const path of ['app/procesiones-de-gloria/[slug]/page.js', 'app/agenda-cofrade/rosarios/[slug]/page.js', 'app/extraordinarias/[slug]/page.js']) {
    const page = read(path)
    assert.match(page, /const title = agendaEventSeoTitle\(\{/, path)
    assert.match(page, /seoDescription\(agendaEventSeoDescription\(\{/, path)
    assert.match(page, /performer: agendaEventPerformers\(item\.music\)/, path)
  }
})
