import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildPlatformUpdates,
  platformUpdateDateLabel,
  selectPlatformUpdatesForHome,
} from '../lib/platform-updates.js'

const now = new Date('2026-10-06T06:00:00Z')

function music(overrides = {}) {
  return {
    id: 'incoming-2027',
    brotherhoodEntityId: 'calle-real',
    brotherhoodName: 'Hermandad de la Calle Real',
    brotherhoodSlug: 'calle-real',
    municipality: 'Castilleja de la Cuesta',
    stepEntityId: 'gran-poder',
    stepName: 'el paso del Señor del Gran Poder',
    position: 'Tras el paso del Señor',
    day: 'Madrugá',
    year: 2027,
    previousBandName: 'A.M. Valme',
    newBandName: 'Banda de Música de Las Cigarreras',
    createdAt: '2026-10-06T05:00:00Z',
    updatedAt: '2026-10-06T05:55:00Z',
    ...overrides,
  }
}

function discovery(overrides = {}) {
  return {
    id: 'band-a:discography',
    rootEntityId: 'band-a',
    activityKind: 'discography',
    activityStatus: 'AMPLIADO',
    title: 'Banda de música',
    summary: 'El catálogo suma una grabación.',
    metric: '10 grabaciones',
    href: '/bandas/banda-a#discografia',
    label: 'Banda → discografía',
    cta: 'Ver la discografía →',
    dateTime: '2026-10-05T16:00:00Z',
    ...overrides,
  }
}

test('el relevo Calle Real se avisa una vez con fecha de incorporación y edición futura separadas', () => {
  const items = buildPlatformUpdates({ musicChanges: [music(), music()], now })
  assert.equal(items.length, 1)
  const item = items[0]
  assert.equal(item.id, 'music-change:incoming-2027')
  assert.equal(item.dateTime, '2026-10-06T05:00:00.000Z')
  assert.equal(item.dateVerb, 'Añadido')
  assert.equal(item.dateLabel, 'Hoy')
  assert.equal(item.categoryLabel, 'Cambios musicales')
  assert.equal(item.href, '/semana-santa/2027/cambios-musicales#cambio-incoming-2027')
  assert.match(item.summary, /Las Cigarreras sustituye a A\.M\. Valme/)
  assert.match(item.summary, /Señor del Gran Poder/)
  assert.match(item.summary, /Madrugá de 2027/)
})

test('las fichas de Hermandad sin publicar no ocultan un periodo musical público con snapshot', () => {
  const [item] = buildPlatformUpdates({
    musicChanges: [music({ brotherhoodHref: '', newBandHref: '' })], now,
  })
  assert.equal(item.title, 'Cambio musical en Castilleja de la Cuesta')
  assert.match(item.href, /^\/semana-santa\//)
  assert.equal(item.brotherhoodHref, undefined)
})

test('el aviso conserva el nombre público reconocible sin modificar los nombres canónicos', () => {
  const source = music({ newBandName: 'Banda de Música María Santísima de la Victoria', newBandDisplayName: 'Banda de Música María Santísima de la Victoria (Las Cigarreras)' })
  const [item] = buildPlatformUpdates({ musicChanges: [source], now })
  assert.match(item.summary, /\(Las Cigarreras\) sustituye/)
  assert.equal(source.newBandName, 'Banda de Música María Santísima de la Victoria')
})

test('los duplicados de un periodo y los cambios distintos de una Hermandad se distinguen', () => {
  const items = buildPlatformUpdates({
    musicChanges: [
      music({ id: 'duplicate', createdAt: '2026-10-05T04:00:00Z' }),
      music(),
      music({ id: 'palio', stepEntityId: 'dolores', stepName: 'el palio de los Dolores', position: 'Palio' }),
    ], now,
  })
  assert.equal(items.length, 2)
  assert.ok(items.some((item) => item.id === 'music-change:incoming-2027'))
  assert.ok(items.some((item) => item.id === 'music-change:palio'))
})

test('el feed mezcla fuentes, conserva orden cronológico y no supera diez avisos', () => {
  const threads = Array.from({ length: 14 }, (_, index) => discovery({
    id: `band-${index}:discography`,
    rootEntityId: `band-${index}`,
    dateTime: new Date(now.getTime() - (index + 2) * 3600000).toISOString(),
  }))
  const items = buildPlatformUpdates({ discoveryThreads: threads, musicChanges: [music()], limit: 50, now })
  assert.equal(items.length, 10)
  assert.equal(items[0].id, 'music-change:incoming-2027')
  assert.equal(items[1].dateVerb, 'Actualizado')
  assert.ok(items.every((item, index) => !index || item.dateTime <= items[index - 1].dateTime))
})

test('las crucetas usan su alta y distinguen Hermandad, banda y procesión', () => {
  const [item] = buildPlatformUpdates({
    repertoires: [{
      id: 'cruceta-1', slug: 'san-gonzalo-2026', status: 'published',
      displayTitle: 'San Gonzalo · Lunes Santo 2026',
      bandName: 'Banda de Santa Ana', bandEntityId: 'santa-ana',
      outingId: 'san-gonzalo-2026', brotherhoodEntityId: 'san-gonzalo',
      createdAt: '2026-10-05T13:00:00Z', updatedAt: '2026-10-06T04:00:00Z',
    }], now,
  })
  assert.equal(item.title, 'San Gonzalo · Lunes Santo 2026')
  assert.equal(item.metric, 'Banda de Santa Ana')
  assert.equal(item.dateLabel, 'Ayer')
  assert.equal(item.dateTime, '2026-10-05T13:00:00.000Z')
  assert.equal(item.href, '/crucetas-musicales/san-gonzalo-2026')
})

test('los retoques técnicos no vuelven a marcar la misma noticia como no leída', () => {
  const [first] = buildPlatformUpdates({ discoveryThreads: [discovery()], now })
  const [technical] = buildPlatformUpdates({
    discoveryThreads: [discovery({
      dateTime: '2026-10-06T05:00:00Z', dateLabel: 'Hoy', visual: { path: '/foto-nueva.png' },
    })], now,
  })
  const [changed] = buildPlatformUpdates({
    discoveryThreads: [discovery({ metric: '11 grabaciones', summary: 'El catálogo suma dos grabaciones.' })], now,
  })
  assert.equal(technical.revisionKey, first.revisionKey)
  assert.notEqual(changed.revisionKey, first.revisionKey)
  const [oldMusic] = buildPlatformUpdates({ musicChanges: [music()], now })
  const [touchedMusic] = buildPlatformUpdates({ musicChanges: [music({ updatedAt: '2030-01-01T00:00:00Z' })], now })
  assert.equal(touchedMusic.revisionKey, oldMusic.revisionKey)
  assert.equal(touchedMusic.dateTime, oldMusic.dateTime)
})

test('no inventa fecha desde updated_at, ni anuncia fechas futuras o contenido no público', () => {
  const items = buildPlatformUpdates({
    discoveryThreads: [
      discovery({ status: 'draft' }),
      discovery({ activityKind: 'entity_new' }),
      discovery({ dateTime: 'no-es-fecha' }),
      discovery({ dateTime: '2026-12-01T12:00:00Z' }),
      discovery({ href: 'https://example.com' }),
      discovery({ href: '//example.com' }),
      discovery({ href: '/\\example.com' }),
    ],
    musicChanges: [music({ createdAt: '' }), music({ status: 'review' })],
    repertoires: [{ id: 'draft', status: 'draft' }], now,
  })
  assert.deepEqual(items, [])
})

test('el envejecimiento del grupo de Marchas no se presenta como otra incorporación', () => {
  const batch = discovery({ id: 'march-publications:latest:march_publications', activityKind: 'march_publications', title: '3 nuevas marchas' })
  const [first] = buildPlatformUpdates({ discoveryThreads: [batch], now })
  const [aged] = buildPlatformUpdates({ discoveryThreads: [{ ...batch, title: '2 nuevas marchas', metric: '2 fichas incorporadas' }], now })
  const [newest] = buildPlatformUpdates({ discoveryThreads: [{ ...batch, id: 'march-publications:next:march_publications' }], now })
  assert.equal(aged.revisionKey, first.revisionKey)
  assert.notEqual(newest.revisionKey, first.revisionKey)
})

test('selección de portada conserva la más reciente y diversifica dentro de su feed compartido', () => {
  const updates = [
    { id: 'music-new', familyId: 'brotherhood:one', activityKind: 'music_change' },
    { id: 'same-brotherhood', familyId: 'brotherhood:one', activityKind: 'posters' },
    { id: 'discography', familyId: 'band:two', activityKind: 'discography' },
    { id: 'cruceta', familyId: 'brotherhood:three', activityKind: 'musical_repertoire' },
    { id: 'march', familyId: 'march:four', activityKind: 'march_publications' },
  ]
  assert.deepEqual(selectPlatformUpdatesForHome(updates).map((item) => item.id), ['music-new', 'discography', 'cruceta'])
  assert.equal(selectPlatformUpdatesForHome(updates, 4).length, 4)
  assert.deepEqual(selectPlatformUpdatesForHome(updates, 0), [])
})

test('las fechas relativas siguen el calendario de Madrid, incluso en los cambios de hora', () => {
  assert.equal(platformUpdateDateLabel('2026-10-05T22:30:00Z', now), 'Hoy')
  assert.equal(platformUpdateDateLabel('2026-10-24T22:30:00Z', '2026-10-26T00:15:00Z'), 'Ayer')
  assert.equal(platformUpdateDateLabel('2026-03-28T22:30:00Z', '2026-03-29T22:15:00Z'), '28 mar')
  assert.equal(platformUpdateDateLabel('2025-12-31T23:30:00Z', '2026-01-01T01:00:00Z'), 'Hoy')
})
