import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { imageRestorationCards } from '../lib/image-restoration-display.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la lectura pública de la Imagen conserva el slug de autores y responsables publicados', () => {
  const pages = read('lib/supabase/public-entity-pages.js')
  assert.match(pages, /async function loadImageAuthors\(supabase, imageId\)/)
  assert.match(pages, /\.select\('id, name, slug'\)\s*\.eq\('entity_type', 'agent'\)\s*\.eq\('status', 'published'\)\s*\.in\('id', agentIds\),\s*'No se pudieron consultar los Agentes de autoría'/)
  assert.match(pages, /return \{ label, name: agent\?\.name \|\| '', slug: agent\?\.slug \|\| '' \}/)
  assert.match(pages, /autor: authors\.map\(\(author\) => author\.label\)\.join\(' · '\),\s*autores: authors,/)
  assert.match(pages, /responsableSlug: item\.agent_entity_id \? agentById\.get\(item\.agent_entity_id\)\?\.slug \|\| '' : ''/)
})

test('las restauraciones conservan el enlace al responsable solo si hay responsable', () => {
  const [linked, plain] = imageRestorationCards([
    { id: 'a', titulo: 'Restauración', responsable: 'Pedro Manzano', responsableSlug: 'pedro-manzano' },
    { id: 'b', titulo: 'Restauración', responsable: '', responsableSlug: 'huerfano' },
  ])
  assert.equal(linked.responsableSlug, 'pedro-manzano')
  assert.equal(plain.responsableSlug, '')
})

test('la ficha de Imagen enlaza a las fichas de autor sin inventar enlaces', () => {
  const page = read('app/imagenes/[slug]/page.js')
  assert.match(page, /author\.slug \? <Link href=\{`\/autores\/\$\{author\.slug\}`\} prefetch=\{false\}>\{author\.label\}<\/Link> : author\.label/)
  assert.match(page, /href: singleLinkedAuthor \? `\/autores\/\$\{singleLinkedAuthor\.slug\}` : undefined/)
  assert.match(page, /url: absoluteUrl\(`\/autores\/\$\{singleLinkedAuthor\.slug\}`\)/)
  assert.match(page, /linkedAuthors\[0\]\.label === linkedAuthors\[0\]\.name/)

  const restorations = read('components/ImageRestorationsSection.js')
  assert.match(restorations, /item\.responsableSlug \? <Link href=\{`\/autores\/\$\{item\.responsableSlug\}`\} prefetch=\{false\}>/)
})

test('la ficha de Paso enlaza a los responsables de cada fase con ficha pública', () => {
  const page = read('app/pasos/[slug]/page.js')
  assert.match(page, /person\.slug \? <Link href=\{`\/autores\/\$\{person\.slug\}`\} prefetch=\{false\}>\{person\.name\}<\/Link> : person\.name/)
  const heritage = read('lib/supabase/step-heritage.js')
  assert.match(heritage, /\.select\('id, name, slug'\)/)
})
