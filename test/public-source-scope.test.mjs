import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { publicSourceScope } from '../lib/public-source-scope.js'

test('las marcas internas de trabajo no se muestran como ámbito de la fuente', () => {
  assert.equal(publicSourceScope('outing'), '')
  assert.equal(publicSourceScope('outings'), '')
  assert.equal(publicSourceScope('documentación'), '')
  assert.equal(publicSourceScope('relation:band'), '')
  assert.equal(publicSourceScope('Evidencia posterior de celebración · held'), 'Evidencia posterior de celebración')
  assert.equal(publicSourceScope('Salida 2026 y cierre held-ready según autoridad documental'), 'Salida 2026')
})

test('los ámbitos editoriales se conservan tal cual', () => {
  assert.equal(publicSourceScope('Horario, itinerario y celebración en 2026'), 'Horario, itinerario y celebración en 2026')
  assert.equal(publicSourceScope('Evidencia posterior de celebración · 2026'), 'Evidencia posterior de celebración · 2026')
  assert.equal(publicSourceScope(null), '')
})

test('Glorias, Rosarios y Extraordinarias filtran el ámbito; sin fecha se muestra el año', () => {
  for (const path of ['lib/supabase/glory-directory.js', 'lib/supabase/rosary-outings.js', 'lib/supabase/extraordinary-detail.js']) {
    assert.match(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'), /scope: publicSourceScope\(link\.scope\)/, path)
  }
  const page = readFileSync(new URL('../app/extraordinarias/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /\{dateLabel \|\| item\.year \? \(/)
  assert.match(page, /<span>\{dateLabel \? 'Fecha' : 'Año'\}<\/span>/)
})
