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
  assert.match(share, /aria-label=\{icons \? 'Compartir por WhatsApp' : undefined\}/)
  assert.match(share, /aria-label=\{icons \? nativeLabel : undefined\}/)
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
    const size = Number(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\>]/g, '\\$&')}\\{[^}]*font-size:(\\d+)px`).exec(tail)?.[1])
    assert.ok(size >= 11, `${selector} tiene ${size}px`)
  }
})

test('el pie de la Agenda y la etiqueta «Extraordinario» no bajan de 11px', () => {
  const v4 = read('components/AgendaCofradeDirectoryV4.module.css')
  assert.match(v4.slice(v4.lastIndexOf('Tamaño mínimo de letra')), /\.cardTopline>b,\.cardTopline>small\{font-size:11px\}/)
  const page = read('app/agenda-cofrade/agenda-cofrade.module.css')
  const tail = page.slice(page.lastIndexOf('Tamaño mínimo de letra'))
  assert.match(tail, /\.seoCopy>span,\.relatedCalendar>div>span\{font-size:11px\}/)
  assert.match(tail, /\.relatedCalendar>a\{font-size:13px\}/)
  assert.match(tail, /\.relatedLinks\{font-size:13px\}/)
  assert.match(tail, /\.relatedLinks>span\{font-size:11px\}/)
})

test('las listas de periodo llevan «Calendario» junto a la acción y compartir en iconos', () => {
  const list = read('components/AgendaTemporalEventList.js')
  assert.match(list, /<CalendarAddLink\s+href=\{item\.date \? `\/calendario\/acto\//)
  assert.match(list, /iconsOnly/)
  const share = read('components/ShareActions.js')
  assert.match(share, /export function CalendarAddLink/)
  assert.match(share, /aria-label=\{`Añadir al calendario: \$\{title\}`\}/)
  assert.match(share, /trackEvent\('calendar_add'/)
})
