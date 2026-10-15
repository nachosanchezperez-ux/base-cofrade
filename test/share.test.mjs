import test from 'node:test'
import assert from 'node:assert/strict'
import {
  agendaItemShare,
  agendaItemSharePath,
  composeShareMessage,
  crewEventShare,
  newsShare,
  shareAbsoluteUrl,
  whatsappShareHref,
} from '../lib/share.js'

test('un acto sin página propia se comparte con el ancla de su tarjeta en la Agenda', () => {
  const item = { key: 'devotions:abc-123', category: 'devotions', title: 'Besamanos de la Virgen', href: '/hermandades/la-paz' }
  assert.equal(agendaItemSharePath(item), '/agenda-cofrade#acto-devotions-abc-123')
})

test('una ficha conservada o el ancla ya resuelta se respetan', () => {
  assert.equal(agendaItemSharePath({ key: 'x:1', href: '/extraordinarias/sevilla-regla-coronada-2026' }), '/extraordinarias/sevilla-regla-coronada-2026')
  assert.equal(agendaItemSharePath({ key: 'x:1', href: '/agenda-cofrade#acto-processions-9' }), '/agenda-cofrade#acto-processions-9')
  assert.equal(agendaItemSharePath({ key: 'x:1', href: '/procesiones-de-gloria' }), '/agenda-cofrade#acto-x-1')
})

test('el mensaje de un acto lleva tipo, título, organizador, fecha, hora, lugar y enlace', () => {
  const share = agendaItemShare({
    key: 'concerts:7',
    category: 'concerts',
    categoryLabel: 'Concierto',
    title: 'Concierto de marchas',
    organizer: 'Banda de Música de Las Cigarreras',
    date: '2026-10-23',
    startTime: '20:30:00',
    place: 'Iglesia de San Pedro',
    municipality: 'Sevilla',
  })
  assert.equal(share.url, 'https://hilocofrade.es/agenda-cofrade#acto-concerts-7')
  assert.match(share.text, /^Concierto · Concierto de marchas\n/)
  assert.match(share.text, /Banda de Música de Las Cigarreras/)
  assert.match(share.text, /📅 Viernes, 23 de octubre · 20:30 h/)
  assert.match(share.text, /📍 Iglesia de San Pedro, Sevilla/)
  assert.ok(share.text.endsWith('\nhttps://hilocofrade.es/agenda-cofrade#acto-concerts-7'))
  assert.ok(!share.body.includes('https://'), 'el cuerpo del menú nativo no repite el enlace')
})

test('el horario literal tiene prioridad y no se repite la localidad ya incluida en el lugar', () => {
  const share = agendaItemShare({ key: 'r:1', title: 'Rosario', date: '2026-10-17', timeText: 'Tras la misa de 19:00', place: 'Parroquia de Camas', municipality: 'Camas' })
  assert.match(share.text, /📅 Sábado, 17 de octubre · Tras la misa de 19:00/)
  assert.match(share.text, /📍 Parroquia de Camas\n/)
})

test('sin fecha válida no se inventa la fecha', () => {
  const share = agendaItemShare({ key: 'r:2', title: 'Traslado', date: '' })
  assert.doesNotMatch(share.text, /📅/)
})

test('una igualá sin página propia se comparte con su ancla del calendario', () => {
  const share = crewEventShare({ title: 'Igualá del paso de palio', eventTypeLabel: 'Igualá', brotherhoodName: 'La Paz', anchor: 'convocatoria-iguala-paz-2026', detailHref: '/igualas-y-ensayos/iguala-paz-2026', dateParts: { weekdayLabel: 'Jueves, 29 de octubre' }, startTime: '21:00', municipality: 'Sevilla' })
  assert.equal(share.url, 'https://hilocofrade.es/igualas-y-ensayos#convocatoria-iguala-paz-2026')
  assert.match(share.text, /^Igualá · Igualá del paso de palio\nLa Paz\n📅 Jueves, 29 de octubre · 21:00 h\n📍 Sevilla\n/)
  const preserved = crewEventShare({ title: 'Igualá', anchor: 'a', detailHref: '/igualas-y-ensayos/iguala-santa-lucia-sevilla-2026' }, { hasPage: true })
  assert.equal(preserved.url, 'https://hilocofrade.es/igualas-y-ensayos/iguala-santa-lucia-sevilla-2026')
})

test('las noticias se comparten con su ancla en El Hilo se mueve', () => {
  const share = newsShare({ title: 'Nuevo capataz', summary: 'Resumen', href: '/el-hilo-se-mueve#nuevo-capataz' })
  assert.equal(share.url, 'https://hilocofrade.es/el-hilo-se-mueve#nuevo-capataz')
  assert.equal(newsShare({ title: 'Sin enlace' }), null)
})

test('solo se generan URL internas y el enlace de WhatsApp va codificado', () => {
  assert.equal(shareAbsoluteUrl('//evil.example/x'), '')
  assert.equal(shareAbsoluteUrl('https://evil.example'), '')
  assert.equal(whatsappShareHref('Hola & adiós\nhttps://hilocofrade.es/#a'), 'https://wa.me/?text=Hola%20%26%20adi%C3%B3s%0Ahttps%3A%2F%2Fhilocofrade.es%2F%23a')
  assert.equal(composeShareMessage({ title: 'X' }).url, '')
  assert.equal(agendaItemShare({}), null)
})
