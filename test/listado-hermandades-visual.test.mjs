// Directorio de Hermandades como rejilla de tarjetas (24/11/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { directoryColorMap } from '../lib/brotherhood-directory-color.js'
import { directoryInitials } from '../lib/brotherhood-directory-initials.js'

test('color de la tarjeta: primario, si no el primero de la paleta; claros a azul marino', () => {
  const map = directoryColorMap([
    { brotherhood_entity_id: 'a', hex_value: '#5A1E2E', color_role: 'secondary', sort_order: 1 },
    { brotherhood_entity_id: 'a', hex_value: '#0B3D2E', color_role: 'primary', sort_order: 5 },
    { brotherhood_entity_id: 'b', hex_value: '#F5F1E6', color_role: 'identity', sort_order: 1 },
    { brotherhood_entity_id: 'c', hex_value: 'morado', color_role: 'primary', sort_order: 1 },
  ])
  assert.equal(map.get('a'), '#0B3D2E')
  assert.equal(map.get('b'), '#112339')
  assert.equal(map.has('c'), false)
})

test('iniciales para las tarjetas sin escudo', () => {
  assert.equal(directoryInitials('Esperanza de Triana'), 'ET')
  assert.equal(directoryInitials('Hermandad del Baratillo'), 'B')
  assert.equal(directoryInitials('La Macarena'), 'M')
})

test('la tarjeta lleva escudo o iniciales y el color de la Hermandad', () => {
  const index = readFileSync(new URL('../components/BrotherhoodPublicIndex.js', import.meta.url), 'utf8')
  assert.match(index, /'--hc-card-color': item\.color/)
  assert.match(index, /directoryInitials\(name\)/)
  const css = readFileSync(new URL('../components/BrotherhoodPublicIndex.module.css', import.meta.url), 'utf8')
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(css, /border-top: 4px solid var\(--hc-card-color\)/)
  const loader = readFileSync(new URL('../lib/supabase/brotherhood-directory.js', import.meta.url), 'utf8')
  assert.match(loader, /color: colorByBrotherhood\.get\(entity\.id\) \|\| ''/)
})
