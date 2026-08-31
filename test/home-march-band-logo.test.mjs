import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la marcha del día enriquece la grabación con el logo de la banda intérprete', () => {
  const source = read('lib/supabase/home-effective-visual.js')

  assert.match(source, /function bandSlugFromHref/)
  assert.match(source, /\.from\('bands'\)/)
  assert.match(source, /\.select\('logo_path'\)/)
  assert.match(source, /bandLogoPath: bandResult\.data\.logo_path/)
  assert.match(source, /bandLogoAlt:/)
})

test('la marcha del día prioriza el escudo de la banda frente a la portada', () => {
  const component = read('components/HomeTodayV2.js')

  assert.match(component, /const bandLogoPath = march\.bandLogoPath \|\| ''/)
  assert.match(component, /const visualPath = bandLogoPath \|\| march\.coverImagePath \|\| ''/)
  assert.match(component, /bandLogoPath \? styles\.visualIdentityImage : styles\.musicCover/)
})

test('la identidad musical conserva una caché pública versionada junto al contrato diario', () => {
  const snapshot = read('lib/supabase/home-snapshot.js')

  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v12/)
})
