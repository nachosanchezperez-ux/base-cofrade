import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  groupGloryAccompaniments,
  pluralizeOutingType,
  presentAccompanimentNotes,
  summarizeGloryTypes,
  withoutInternalNotes,
} from '../lib/bands/accompaniments.js'

const page = readFileSync(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8')

test('retira las frases de control interno y conserva el contexto útil', () => {
  assert.equal(withoutInternalNotes('Vigencia constatada para 2026; no presupone continuidad posterior.'), '')
  assert.equal(
    withoutInternalNotes('Acompañamiento musical renovado para los Miércoles Santos de 2027, 2028 y 2029. No implica pertenencia ni asociación institucional con el Baratillo.\n\nLa Hermandad del Baratillo ratificó esta continuidad en su comunicado del 24 de septiembre de 2026.'),
    'Acompañamiento musical renovado para los Miércoles Santos de 2027, 2028 y 2029. La Hermandad del Baratillo ratificó esta continuidad en su comunicado del 24 de septiembre de 2026.'
  )
  assert.equal(
    withoutInternalNotes('Acompañamiento ininterrumpido desde 1980. Es un contrato musical y no una asociación institucional con el Baratillo.'),
    'Acompañamiento ininterrumpido desde 1980.'
  )
  assert.equal(
    withoutInternalNotes('Acompañamiento constatado en la procesión celebrada el 12 de septiembre de 2026; no presupone continuidad posterior.'),
    'Acompañamiento constatado en la procesión celebrada el 12 de septiembre de 2026.'
  )
  assert.equal(
    withoutInternalNotes('La banda nació en Sevilla en 1975 y está asociada a la Hermandad del Sol. Estos contratos musicales se documentan como acompañamientos y no como pertenencia a las hermandades.'),
    'La banda nació en Sevilla en 1975 y está asociada a la Hermandad del Sol.'
  )
  // Texto sin frases internas: intacto.
  const plain = 'Vinculación documentada desde 2010. En 2013 se formalizó el contrato.'
  assert.equal(withoutInternalNotes(plain), plain)
})

test('las notas de acompañamiento visibles pasan por el mismo filtro', () => {
  assert.equal(presentAccompanimentNotes({ notes: 'Vigencia constatada para 2026; no presupone continuidad posterior.', outingType: 'Viernes Santo' }), '')
})

test('un grupo de glorias con un solo acompañamiento se pinta sin capa de grupo', () => {
  assert.match(page, /group\.items\.length === 1 \?/)
  assert.match(page, /gloryAccompaniments\.length > 1 \? <div className=\{styles\.gloryTypeSummary\}/)
  const groups = groupGloryAccompaniments([
    { id: 'a', municipalitySlug: 'sevilla', province: 'Sevilla', outingType: 'Procesión de gloria' },
    { id: 'b', municipalitySlug: 'cantillana', province: 'Sevilla', outingType: 'Romería' },
  ])
  assert.deepEqual(groups.map((group) => group.items.length), [1, 1])
})

test('los tipos de salida concuerdan en singular y plural', () => {
  assert.equal(pluralizeOutingType('Procesión triunfal y Romería'), 'Procesiones triunfales y Romerías')
  assert.equal(pluralizeOutingType('Procesión de gloria'), 'Procesiones de gloria')
  assert.equal(pluralizeOutingType('Corpus Christi'), 'Corpus Christi')
  assert.equal(pluralizeOutingType('Gloria / procesión eucarística'), 'Glorias / procesiones eucarísticas')
  assert.equal(pluralizeOutingType('Cruz de Mayo'), 'Cruces de Mayo')
  const summary = summarizeGloryTypes([
    { outingType: 'Procesión triunfal y Romería' },
    { outingType: 'Procesión triunfal y Romería' },
  ])
  assert.equal(summary[0].count, 2)
  assert.equal(summary[0].label, pluralizeOutingType(summary[0].type))
  assert.match(summary[0].label, /^Procesiones triunfales y /i)
  assert.match(page, /item\.count === 1 \? item\.type : item\.label/)
})

test('la hermandad asociada se distingue con una etiqueta, no con un aviso', () => {
  assert.match(page, /styles\.relationshipBond/)
  assert.match(page, /withoutInternalNotes\(publicText\(band\.description\)\)/)
})
