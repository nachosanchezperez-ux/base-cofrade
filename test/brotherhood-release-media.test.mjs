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
  assert.match(page, /h\.estrenos\.length === 1[\s\S]*1158px[\s\S]*370px/)
  assert.match(css, /\.release-card-visual\s*\{[^}]*aspect-ratio:3\/2/s)
  assert.match(css, /\.release-card:only-child \.release-card-visual\{[^}]*aspect-ratio:3\/2/s)
  assert.match(css, /\.release-card:only-child \.release-card-visual img\{object-fit:contain\}/)
  assert.doesNotMatch(css, /\.release-card:only-child \.release-card-visual\{aspect-ratio:(?:4\/3|1\/1)\}/)
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

test('la ficha aplica los colores corporativos como tema sin mostrarlos como dato', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  const page = read('app/hermandades/[slug]/page.js')
  const overview = read('components/BrotherhoodOverviewV2.js')

  assert.match(loader, /colores: colorTheme\(remote\.colors, base\.colores\)/)
  assert.match(page, /'--brotherhood-primary': h\.colores\?\.primario/)
  assert.match(page, /'--brotherhood-secondary': h\.colores\?\.secundario/)
  assert.doesNotMatch(overview, /label: 'Colores'/)
  assert.doesNotMatch(overview, /colorNames\.join/)
})
