import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  accompanimentIdsShownInSteps,
  crossGuideAccompaniments,
  crossGuideDetail,
  habitFields,
  isGenericCultDescription,
  stepAccompaniments,
  visibleCultDescription,
} from '../lib/brotherhood-ficha-content.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('oculta las coletillas genéricas de los cultos y conserva las descripciones con contenido', () => {
  assert.equal(isGenericCultDescription('Culto anual documentado por la corporación.'), true)
  assert.equal(isGenericCultDescription('  culto anual documentado por la Corporacion. '), true)
  assert.equal(visibleCultDescription('Culto anual documentado por la Hermandad.'), '')
  assert.equal(visibleCultDescription('Culto de cinco días que culmina el primer sábado de Cuaresma.'), 'Culto de cinco días que culmina el primer sábado de Cuaresma.')
  assert.equal(visibleCultDescription('Culto documentado en la historia de la corporación; calendario actual no fijado.'), 'Culto documentado en la historia de la corporación; calendario actual no fijado.')
  assert.equal(visibleCultDescription(null), '')
})

const music = [
  { id: 'p1', pasoId: 's1', banda: 'Banda del Sol', bandaSlug: 'banda-del-sol', posicion: 'Tras Nuestro Padre Jesús Nazareno' },
  { id: 'p2', pasoId: 's2', banda: 'Carmen de Salteras', bandaSlug: 'carmen-de-salteras', posicion: 'Tras el paso de palio' },
  { id: 'p3', pasoId: null, banda: 'Agrupación Juvenil', bandaSlug: 'agrupacion', posicion: 'Cruz de Guía · sección juvenil' },
  { id: 'p4', pasoId: null, banda: 'Banda de la Gloria', bandaSlug: 'gloria', posicion: 'Tras el paso', salida: 'Gloria' },
]
const steps = [{ id: 's1' }, { id: 's2' }]

test('cada banda actual va a su paso y la Cruz de Guía al frente del cortejo', () => {
  assert.deepEqual(stepAccompaniments(music, 's1').map((item) => item.id), ['p1'])
  assert.deepEqual(crossGuideAccompaniments(music).map((item) => item.id), ['p3'])
  assert.equal(crossGuideDetail(music[2]), 'sección juvenil')
  assert.equal(crossGuideDetail({ posicion: 'Cruz de Guía' }), '')
})

test('«Acompañamiento musical» solo conserva lo que no se muestra en los pasos', () => {
  assert.deepEqual(accompanimentIdsShownInSteps(music, steps), ['p1', 'p2', 'p3'])
  // Sin sección de pasos no se excluye nada: la música no puede desaparecer.
  assert.deepEqual(accompanimentIdsShownInSteps(music, []), [])
})

test('la túnica solo muestra campos con dato', () => {
  const fields = habitFields({ tunica: 'Raso morado', antifaz: 'Morado', cordon: 'Seda', botonadura: '', calzado: null, guantes: '  ' })
  assert.deepEqual(fields.map((field) => field.label), ['Túnica', 'Antifaz', 'Cíngulo'])
  assert.deepEqual(habitFields({}), [])
})

test('la ficha no pinta huecos de foto, campos vacíos ni entradillas internas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  for (const text of ['Fotografía del paso', 'council-photo-placeholder', 'news-image-placeholder', 'heritage-work-placeholder', '{imagen.iniciales}', '<dt>Botonadura</dt>', '<dt>Calzado</dt>', 'solo se publicarán cuando estén documentados']) {
    assert.ok(!page.includes(text), `sigue presente: ${text}`)
  }
  assert.match(page, /stepAccompaniments\(currentMusicItems, paso\.id\)/)
  assert.match(page, /excludeAccompanimentIds=\{accompanimentIdsInSteps\}/)

  const extras = read('components/BrotherhoodRelationalExtras.js')
  assert.doesNotMatch(extras, /no confundir pertenencia con contrato procesional/)
  const cults = read('components/BrotherhoodCultsSection.js')
  assert.match(cults, /visibleCultDescription\(cult\.descripcion\)/)
  const outings = read('components/BrotherhoodOutingsSection.js')
  assert.doesNotMatch(outings, /se presentan como ámbitos distintos/)
})
