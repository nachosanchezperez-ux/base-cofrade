import test from 'node:test'
import assert from 'node:assert/strict'
import {
  brotherhoodFigures,
  brotherhoodProcession,
  guideCoversHistory,
  milestonesFromText,
  splitLead,
  usesBrotherhoodMagazine,
  yearOf,
} from '../lib/brotherhood-magazine.js'

test('la cohorte se resuelve por ID, no por slug', () => {
  assert.equal(usesBrotherhoodMagazine('206cf962-fd63-4fae-ad0d-9454554283d8'), true)
  assert.equal(usesBrotherhoodMagazine('san-benito'), false)
  assert.equal(usesBrotherhoodMagazine(undefined), false)
})

test('cifras: años desde la fundación, marchas y cultos; nunca ceros ni pasos', () => {
  const figures = brotherhoodFigures({
    brotherhood: { fundacion: '18 de julio de 1554', cultos: [1, 2, 3, 4, 5, 6, 7], datosJornada: {} },
    marchCount: 86,
    currentYear: 2026,
  })
  assert.deepEqual(figures.map((item) => [item.value, item.label]), [
    [472, 'años desde 1554'],
    [86, 'marchas dedicadas'],
    [7, 'cultos al año'],
  ])
  assert.deepEqual(brotherhoodFigures({ brotherhood: {}, marchCount: 0, currentYear: 2026 }), [])
  assert.equal(brotherhoodFigures({ brotherhood: { datosJornada: { totalNazarenos: '0' } }, currentYear: 2026 }).length, 0)
})

test('cifras: el enlace de la fundación apunta donde se cuenta la historia', () => {
  const [first] = brotherhoodFigures({ brotherhood: { fundacion: '1693' }, currentYear: 2026, foundationHref: '#conoce-hermandad' })
  assert.equal(first.href, '#conoce-hermandad')
})

test('cortejo: música por paso y cruz de guía; lo que no tiene paso ni posición clara no se coloca', () => {
  const procession = brotherhoodProcession({
    steps: [
      { id: 's1', nombre: 'Paso de misterio', tipo: 'Misterio', slug: 'misterio', fichaDisponible: true, imagenes: ['i1'] },
      { id: 's2', nombre: 'Paso de palio', tipo: 'Palio', slug: 'palio', fichaDisponible: false, imagenesDetalle: [{ id: 'i2', nombre: 'Virgen', slug: 'virgen', fichaDisponible: true }] },
    ],
    images: [{ id: 'i1', nombre: 'Señor', slug: 'senor', fichaDisponible: true }],
    acompanamientoActual: [
      { id: 'a1', banda: 'Banda A', bandaSlug: 'banda-a', pasoId: 's1', posicion: 'Tras el paso', periodo: 'Desde 1995' },
      { id: 'a2', banda: 'Juvenil', bandaSlug: '', pasoId: '', posicion: 'Cruz de Guía', periodo: 'Desde 2024' },
      { id: 'a3', banda: 'Sin sitio', pasoId: '', posicion: 'Acompañamiento musical' },
      { id: 'a4', banda: 'Otro paso', pasoId: 'ajeno', posicion: 'Tras el paso' },
    ],
    coverMedia: new Map([['s1', { path: '/f.webp', alt: 'Foto', credit: 'Autor' }]]),
    framing: (slug) => (slug === 'misterio' ? '50% 24%' : ''),
  })
  assert.deepEqual(procession.head.map((item) => item.band), ['Juvenil'])
  assert.equal(procession.steps[0].music[0].since, 'Desde 1995')
  assert.equal(procession.steps[0].music[0].href, '/bandas/banda-a')
  assert.equal(procession.steps[0].photo.position, '50% 24%')
  assert.deepEqual(procession.steps[0].titulars, [{ id: 'i1', name: 'Señor', href: '/imagenes/senor' }])
  assert.equal(procession.steps[1].href, '')
  assert.equal(procession.steps[1].photo, null)
  assert.deepEqual(procession.steps[1].titulars.map((item) => item.href), ['/imagenes/virgen'])
  assert.equal(procession.steps.flatMap((step) => step.music).some((item) => item.band === 'Sin sitio' || item.band === 'Otro paso'), false)
})

test('historia en fechas: frases del propio texto, una por año, sin reescribir', () => {
  const items = milestonesFromText('Las reglas aprobadas en 1921 fijaron la sede en La Calzada. En 1928 se estrenó el misterio y en 1930 regresó la Virgen. La Hermandad adquirió carácter sacramental en 1958; en 1966 fue bendecido el Cristo. Sin año aquí.')
  assert.deepEqual(items.map((item) => item.year), ['1921', '1928', '1930', '1958', '1966'])
  assert.equal(items[0].text, 'Las reglas aprobadas en 1921 fijaron la sede en La Calzada.')
  assert.equal(items[2].text, 'En 1930 regresó la Virgen.')
  assert.deepEqual(milestonesFromText(''), [])
})

test('la guía editorial sustituye a la historia solo si no hay cronología propia', () => {
  assert.equal(guideCoversHistory({ editorialGuide: { body: '### Clave\n\nTexto' } }), true)
  assert.equal(guideCoversHistory({ editorialGuide: { body: '### Clave' }, cronologia: [{ fecha: '1693' }] }), false)
  assert.equal(guideCoversHistory({}), false)
})

test('entradilla de tarjeta: corta en un punto y conserva el resto', () => {
  const long = `${'Primera frase larga de contexto histórico. '.repeat(4)}Final.`
  const { lead, rest } = splitLead(long, 120)
  assert.ok(lead.endsWith('.'))
  assert.equal(`${lead} ${rest}`.replace(/\s+/g, ' ').trim(), long.replace(/\s+/g, ' ').trim())
  assert.deepEqual(splitLead('Corto.'), { lead: 'Corto.', rest: '' })
  assert.equal(yearOf('Siglo XVI'), null)
})

test('musicByDecade agrupa por décadas, rellena huecos y no estima años', async () => {
  const { musicByDecade } = await import('../lib/brotherhood-magazine.js')
  const result = musicByDecade([{ year: '1925' }, { year: 1948 }, { year: 'c. 1949' }, { year: '' }, { year: 'sin fecha' }])
  assert.equal(result.dated, 3)
  assert.deepEqual(result.decades.map((d) => [d.decade, d.count]), [[1920, 1], [1930, 0], [1940, 2]])
  assert.equal(result.max, 2)
  assert.deepEqual(musicByDecade([]).decades, [])
})

test('topComposers solo muestra autores con dos o más obras', async () => {
  const { topComposers } = await import('../lib/brotherhood-magazine.js')
  const a = { name: 'A', slug: 'a' }
  const b = { name: 'B', slug: 'b' }
  const result = topComposers([{ composers: [a] }, { composers: [a, b] }, { composers: [a] }, { composers: [] }])
  assert.deepEqual(result, [{ name: 'A', slug: 'a', count: 3 }])
})

test('listeningPicks reparte la selección a lo largo de la cronología', async () => {
  const { listeningPicks } = await import('../lib/brotherhood-magazine.js')
  const items = Array.from({ length: 10 }, (_, i) => ({ id: i, listening: i % 3 === 1 ? null : { url: `https://example.org/${i}` } }))
  const picks = listeningPicks(items, 4)
  assert.equal(picks.length, 4)
  assert.equal(picks[0].id, 0)
  assert.equal(picks.at(-1).id, 9)
  assert.ok(picks.every((item) => item.listening))
})
