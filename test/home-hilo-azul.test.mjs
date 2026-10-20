// Portada (20/10/2026): noticia principal de «El Hilo se mueve» en azul, escudo
// de la ficha del día en PC y grabación de la marcha del día sin repeticiones.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { informativeReleaseTitle } from '../lib/home-march-text.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la grabación no repite «marcha · banda»', () => {
  assert.equal(informativeReleaseTitle('La Borriquita · Banda del Sol', 'La Borriquita', 'Banda del Sol'), '')
  assert.equal(informativeReleaseTitle('La Borriquita', 'La Borriquita', 'Banda del Sol'), '')
  assert.equal(informativeReleaseTitle('Banda del Sol - La Borriquita', 'La Borriquita', 'Banda del Sol'), '')
  assert.equal(informativeReleaseTitle('Marchas de Pasión', 'La Borriquita', 'Banda del Sol'), 'Marchas de Pasión')
  assert.equal(informativeReleaseTitle('', 'La Borriquita', 'Banda del Sol'), '')
  assert.equal(informativeReleaseTitle('Esperanza de Triana', 'Esperanza de Triana Coronada', ''), 'Esperanza de Triana')
  assert.match(read('lib/supabase/home-v2.js'), /releaseTitle: informativeReleaseTitle\(release\?\.title \|\| recording\?\.title, entity\.name, band\?\.name\)/)
})

test('El Hilo se mueve: la principal en azul, con etiquetas en rosa', () => {
  const css = read('components/HomeUpdatesLink.module.css')
  assert.match(css, /\.lead \{\s*border-color: var\(--home-ink\);\s*background: linear-gradient\(140deg, var\(--home-blue\) 0%, var\(--home-ink\) 100%\);/)
  assert.match(css, /\.lead \.meta b \{\s*color: var\(--home-pink\);/)
  assert.match(css, /\.lead \.discover::after \{\s*color: var\(--home-pink\);/)
})

test('Hoy en Hilo Cofrade: sin segunda etiqueta y con escudo en PC', () => {
  assert.match(read('components/HomeTodayV2.js'), /\{embedded \? null : <RelationshipTrail value=\{card\.kicker\} \/>\}/)
  assert.match(read('components/HomeTodayV2.module.css'), /\.embedded \.featureCardSlot\.discoveryCard:not\(:has\(\[data-home-visual-kind="photo"\]\)\) > \[data-home-visual-kind\]:not\(\[data-home-visual-kind="photo"\]\) \{\s*position: absolute !important;/)
})
