import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las novedades patrimoniales pueden mostrar la imagen documentada de su pieza objetivo', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const page = read('app/hermandades/[slug]/page.js')
  const css = read('app/globals.css')

  assert.match(loader, /public_image_path, public_image_alt, public_image_credit/)
  assert.match(loader, /heritageUpdateTargetById\.get\(update\.target_entity_id\)/)
  assert.match(page, /className="release-card-visual"/)
  assert.match(page, /e\.imagen\.credito/)
  assert.match(css, /\.release-card-visual\s*\{[^}]*aspect-ratio:3\/2/s)
})

test('los estrenos priorizan la lectura rápida y pliegan los equipos extensos', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(loader, /fecha: displayDate\(update\.update_date\)/)
  assert.match(loader, /agentes,/)
  assert.match(page, /className="release-card-facts"/)
  assert.match(page, /className="release-card-team"/)
  assert.match(page, /Equipo responsable/)
})

test('la ficha muestra los nombres documentados de los colores corporativos', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const overview = read('components/BrotherhoodOverviewV2.js')

  assert.match(loader, /nombres: colors\.map\(\(color\) => color\.color_name\)/)
  assert.match(overview, /label: 'Colores', value: colorNames\.join\(' · '\)/)
})
