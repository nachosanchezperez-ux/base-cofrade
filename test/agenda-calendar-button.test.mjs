import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las tarjetas de la Agenda ponen «Añadir al calendario» como acción principal', () => {
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  assert.match(directory, /<ShareActions compact calendarFirst [^>]*calendarHref=\{item\.date \? `\/calendario\/acto\//)

  const share = read('components/ShareActions.js')
  assert.match(share, /calendarLead \? 'Añadir al calendario' : 'Calendario'/)
  // Los iconos sin texto conservan un nombre accesible.
  assert.match(share, /aria-label=\{calendarLead \? 'Compartir por WhatsApp' : undefined\}/)
  assert.match(share, /aria-label=\{calendarLead \? nativeLabel : undefined\}/)
  // Va delante de WhatsApp y Compartir.
  assert.ok(share.indexOf('{calendarLead ? calendarLink : null}') < share.indexOf('whatsappShareHref('))
})

test('el botón principal es de borde azul marino, sin relleno', () => {
  const css = read('components/ShareActions.module.css')
  const rule = /\.share \.calendarLead \{([^}]*)\}/.exec(css)?.[1] || ''
  assert.match(rule, /border-color: #112339/)
  assert.match(rule, /color: #112339/)
  assert.doesNotMatch(rule, /background/)
})

test('la Agenda no baja de 11px en los textos que antes eran diminutos', () => {
  const css = read('components/AgendaCofradeDirectoryV4.module.css')
  const tail = css.slice(css.lastIndexOf('Tamaño mínimo de letra'))
  for (const selector of ['.liveItem>div:first-child>span', '.liveTimes span', '.liveTimes strong', '.liveItem p', '.liveAction', '.cardActions a', '.monthNavigation strong']) {
    const size = Number(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\>]/g, '\\$&')}\\{font-size:(\\d+)px`).exec(tail)?.[1])
    assert.ok(size >= 11, `${selector} tiene ${size}px`)
  }
})
