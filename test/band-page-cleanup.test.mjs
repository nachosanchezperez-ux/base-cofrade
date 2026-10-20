import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const page = read('app/bandas/[slug]/page.js')

test('la ficha de banda muestra cada relación una sola vez', () => {
  // Sin «Conexiones»: hermandades, pasos, crucetas y marchas ya tienen su sección.
  assert.doesNotMatch(page, /<RelationalThread/)
  assert.doesNotMatch(page, /Conexiones de esta Banda/)
  // Formación, localidad y hermandad solo en la cabecera.
  assert.doesNotMatch(page, /styles\.roleGrid/)
  assert.doesNotMatch(page, /badges=\{\[publicText\(band\.type\)/)
  // Las extraordinarias van en «Próximas actuaciones», sin sección duplicada.
  assert.doesNotMatch(page, /id="extraordinarias"/)
  assert.match(page, /maxItems=\{upcomingAgendaItems\.length\}/)
})

test('un solo foco en «De un vistazo» y sin textos internos', () => {
  assert.doesNotMatch(page, /styles\.impactPanel/)
  for (const text of ['ordenados por fecha y conectados con cada calendario', 'Salta a las Hermandades y pasos que acompaña', '<span>Ámbito</span>', '<span>Periodo histórico</span>', 'identificadas según su naturaleza documental']) {
    assert.ok(!page.includes(text), `sigue presente: ${text}`)
  }
  assert.match(page, /item\.count === 1 \? item\.type : item\.label/)
})

test('la agenda de la banda usa los colores de la entidad', () => {
  const css = read('components/ContextAgendaSection.module.css')
  assert.doesNotMatch(css, /:#a51d34[;}]/)
  assert.match(css, /var\(--brotherhood-secondary,#a51d34\)/)
})
