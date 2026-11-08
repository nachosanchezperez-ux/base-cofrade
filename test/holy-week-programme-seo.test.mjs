import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { PROGRAMME_DAYS, dayPath, daySeo, programmeDay } from '../lib/holy-week-programme.js'
import {
  programmeDayJsonLd,
  programmeEventDescription,
  programmeEventJsonLd,
  programmeEventName,
  programmeItemListJsonLd,
} from '../lib/holy-week-programme-jsonld.js'
import { holyWeekSocialConfig } from '../lib/holy-week-social-copy.js'
import { sectionTitleFontSize } from '../lib/section-social-copy.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const miercoles = { ...programmeDay('miercoles-santo') }
const baratillo = {
  key: 'el-baratillo',
  slug: 'el-baratillo',
  name: 'El Baratillo',
  officialName: 'Hermandad del Baratillo',
  sentenceName: 'el Baratillo',
  href: '/hermandades/el-baratillo',
  crestPath: '/escudos/baratillo.png',
  departure: '15:45',
  arrival: '23:30',
  timesSource: 'hilo',
  origin: 'Capilla de la Piedad',
  position: 8,
  cortejo: [
    { bands: [{ slug: 'banda-a', name: 'Banda A', href: '/bandas/banda-a' }] },
    { bands: [{ slug: 'banda-a', name: 'Banda A', href: '/bandas/banda-a' }, { slug: 'banda-b', name: 'Banda B', href: '/bandas/banda-b' }] },
  ],
}

test('cada jornada tiene su URL bajo el programa', () => {
  assert.equal(dayPath('miercoles-santo'), '/semana-santa-sevilla-2027/miercoles-santo')
  assert.equal(dayPath(''), '/semana-santa-sevilla-2027')
  assert.equal(new Set(PROGRAMME_DAYS.map((day) => dayPath(day.id))).size, 11)
})

test('título y descripción propios por jornada, sin duplicados', () => {
  const titles = PROGRAMME_DAYS.map((day) => daySeo(day).title)
  const descriptions = PROGRAMME_DAYS.map((day) => daySeo(day).description)
  assert.equal(new Set(titles).size, 11)
  assert.equal(new Set(descriptions).size, 11)
  for (const day of PROGRAMME_DAYS) {
    assert.ok(daySeo(day).title.includes(`${day.name} 2027`), day.id)
    assert.doesNotMatch(daySeo(day).description, /Aprobado por el Consejo/)
  }
  assert.match(daySeo(programmeDay('lunes-santo')).description, /aún no ha aprobado/)
  assert.match(daySeo(programmeDay('viernes-de-dolores')).title, /hora de salida/)
})

test('el Event lleva solo la fecha de 2027 y dice que el horario está pendiente', () => {
  const event = programmeEventJsonLd(miercoles, baratillo)
  assert.equal(event['@type'], 'Event')
  assert.equal(event.startDate, '2027-03-24')
  assert.doesNotMatch(event.startDate, /T/)
  assert.match(event.description, /Horario de 2027 pendiente de publicación/)
  assert.match(event.description, /Referencia 2026: salida a las 15:45 y entrada a las 23:30/)
  assert.equal(event.organizer.name, 'Hermandad del Baratillo')
  assert.equal(event.organizer.url, 'https://hilocofrade.es/hermandades/el-baratillo')
  assert.equal(event.location.address.addressLocality, 'Sevilla')
  assert.equal(event.location.name, 'Capilla de la Piedad')
  assert.deepEqual(event.performer.map((band) => band.url), ['https://hilocofrade.es/bandas/banda-a', 'https://hilocofrade.es/bandas/banda-b'])
  assert.equal(event.url, 'https://hilocofrade.es/semana-santa-sevilla-2027/miercoles-santo#miercoles-santo--el-baratillo')
  assert.equal(programmeEventName(miercoles, baratillo), 'Estación de penitencia del Baratillo · Miércoles Santo 2027')
})

test('vísperas: salida procesional; jornada pendiente: lo dice', () => {
  const vd = programmeDay('viernes-de-dolores')
  assert.match(programmeEventName(vd, { ...baratillo, sentenceName: 'la Hermandad de Pino Montano' }), /^Salida procesional de la Hermandad de Pino Montano/)
  const sinHora = programmeEventDescription(vd, { ...baratillo, departure: '', arrival: '', position: null })
  assert.equal(sinHora, 'Horario de 2027 pendiente de publicación.')
  const lunes = programmeDay('lunes-santo')
  assert.match(programmeEventDescription(lunes, { ...baratillo, position: null }), /aún no ha aprobado el orden de paso/)
  assert.match(programmeEventDescription(programmeDay('martes-santo'), baratillo), /orden de 2026, a falta del de 2027/)
})

test('ItemList del orden de paso por jornada, sin orden en la jornada pendiente', () => {
  const list = programmeItemListJsonLd(miercoles, [baratillo])
  assert.equal(list.itemListOrder, 'https://schema.org/ItemListOrderAscending')
  assert.equal(list.itemListElement[0].position, 1)
  assert.equal(list.name, 'Orden de paso del Miércoles Santo 2027')
  assert.equal(programmeItemListJsonLd(programmeDay('lunes-santo'), []).itemListOrder, 'https://schema.org/ItemListUnordered')
  const graph = programmeDayJsonLd(miercoles, [baratillo])['@graph']
  assert.deepEqual(graph.map((node) => node['@type']), ['ItemList', 'Event'])
})

test('la página de cada jornada: canonical, imagen propia, migas y datos estructurados', () => {
  const page = read('app/semana-santa-sevilla-2027/[jornada]/page.js')
  assert.match(page, /alternates: \{ canonical: path \}/)
  assert.match(page, /images: null/)
  assert.match(page, /dynamicParams = false/)
  assert.match(page, /breadcrumbJsonLd/)
  assert.match(page, /programmeDayJsonLd/)
  assert.ok(page.indexOf('await connection()') < page.indexOf('await getHolyWeekProgramme()'))
  assert.match(read('app/semana-santa-sevilla-2027/page.js'), /images: null/)
  for (const file of ['opengraph-image.js', 'twitter-image.js', '[jornada]/opengraph-image.js', '[jornada]/twitter-image.js']) {
    assert.match(read(`app/semana-santa-sevilla-2027/${file}`), /renderHolyWeekSocialImage/, file)
  }
})

test('las jornadas están en el sitemap', () => {
  assert.match(read('app/sitemap.js'), /PROGRAMME_DAYS\.map\(\(day\) => \(\{\n    url: absoluteUrl\(dayPath\(day\.id\)\)/)
})

test('las pestañas y el paginador son enlaces rastreables y la ficha va siempre en el HTML', () => {
  const component = read('components/HolyWeekProgramme.js')
  assert.match(component, /<Link\n              href=\{dayPath\(tabDay\.id\)\}/)
  assert.match(component, /<Link href=\{dayPath\(days\[dayIndex \+ 1\]\.id\)\}/)
  assert.ok(component.indexOf('</> : null}') < component.indexOf('className={styles.fichaLink}'))
  assert.match(component, /<h3 className=\{styles\.itemTitle\}>/)
  assert.match(read('app/semana-santa-sevilla-2027/ProgrammeShell.js'), /\/semana-santa\/2027\/cambios-musicales/)
})

test('imagen para compartir: marca, «Programa de mano» y las fechas', () => {
  const hub = holyWeekSocialConfig()
  assert.match([hub.kicker, ...hub.title, hub.subtitle].join(' '), /Programa de mano.*Semana Santa.*Sevilla 2027.*19 al 28 de marzo de 2027/)
  for (const day of PROGRAMME_DAYS) {
    const config = holyWeekSocialConfig(day)
    assert.equal(config.kicker, 'Semana Santa de Sevilla 2027 · Programa de mano')
    assert.match(config.subtitle, /marzo de 2027/)
    assert.ok(config.title.length <= 2 && sectionTitleFontSize(config.title) >= 100, day.id)
    assert.ok(config.title.every((line) => line.length <= 12 || config.title.length === 2), day.id)
  }
  assert.equal(holyWeekSocialConfig(programmeDay('miercoles-santo')).subtitle, 'Miércoles, 24 de marzo de 2027')
  assert.equal(holyWeekSocialConfig(programmeDay('madrugada')).subtitle, 'Noche del 25 al 26 de marzo de 2027')
})
