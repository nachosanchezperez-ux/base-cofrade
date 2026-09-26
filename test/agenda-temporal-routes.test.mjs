import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las tres landings temporales reutilizan la misma Agenda pública', () => {
  for (const [slug, period] of [['hoy', 'today'], ['manana', 'tomorrow'], ['fin-de-semana', 'weekend']]) {
    const source = read(`app/agenda-cofrade/${slug}/page.js`)
    assert.match(source, /getAgendaCofrade/)
    assert.match(source, new RegExp(`period: ['"]${period}['"]`))
    assert.match(source, /AgendaTemporalLanding/)
    assert.match(source, /socialMetadata/)
  }
})

test('la Agenda principal enlaza sus landings temporales canónicas', () => {
  const page = read('app/agenda-cofrade/page.js')
  const nav = read('components/AgendaTemporalNav.js')
  assert.match(page, /AgendaTemporalNav/)
  assert.match(nav, /\/agenda-cofrade\/hoy/)
  assert.match(nav, /\/agenda-cofrade\/manana/)
  assert.match(nav, /\/agenda-cofrade\/fin-de-semana/)
})


test('las landings temporales usan cronología propia y navegación responsive', () => {
  const landing = read('components/AgendaTemporalLanding.js')
  const events = read('components/AgendaTemporalEventList.js')
  const landingCss = read('components/AgendaTemporalLanding.module.css')
  const navCss = read('components/AgendaTemporalNav.module.css')

  assert.match(landing, /AgendaTemporalEventList/)
  assert.match(landing, /Ver todas las citas/)
  assert.match(landing, /Organiza tu visita/)
  assert.match(events, /groupByDate/)
  assert.match(events, /Hora/)
  assert.match(events, /Guía local/)
  assert.match(landingCss, /overflow-x:auto/)
  assert.match(navCss, /position:sticky/)
  assert.match(navCss, /overflow-x:auto/)
})


test('la micro UX móvil mantiene targets táctiles y señales de scroll', () => {
  const landing = read('components/AgendaTemporalLanding.js')
  const landingCss = read('components/AgendaTemporalLanding.module.css')
  const navCss = read('components/AgendaTemporalNav.module.css')
  const events = read('components/AgendaTemporalEventList.js')
  const eventCss = read('components/AgendaTemporalEventList.module.css')

  assert.match(landing, /Desliza →/)
  assert.match(landingCss, /min-height:44px/)
  assert.match(landingCss, /scrollbar-width:none/)
  assert.match(navCss, /flex:0 0 108px/)
  assert.match(navCss, /min-height:42px/)
  assert.match(events, /styles\.municipality/)
  assert.match(eventCss, /font-variant-numeric:tabular-nums/)
  assert.match(eventCss, /min-height:40px/)
})


test('la cronología aplica un código visual sobrio por tipo de acto', () => {
  const landing = read('components/AgendaTemporalLanding.js')
  const landingCss = read('components/AgendaTemporalLanding.module.css')
  const events = read('components/AgendaTemporalEventList.js')
  const eventCss = read('components/AgendaTemporalEventList.module.css')

  assert.match(landing, /data-category=\{category\.key\}/)
  assert.match(events, /data-category=\{item\.category \|\| 'other'\}/)
  for (const category of ['processions', 'transfers', 'rosaries', 'romeries', 'devotions', 'concerts']) {
    assert.match(landingCss, new RegExp(`data-category=["']${category}["']`))
    assert.match(eventCss, new RegExp(`data-category=["']${category}["']`))
  }
  assert.match(eventCss, /--event-accent/)
  assert.match(eventCss, /--event-soft/)
  assert.match(eventCss, /width:3px/)
})
