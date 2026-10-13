import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

function datalistOptions(source, id) {
  const block = source.match(new RegExp(`<datalist id="${id}">([\\s\\S]*?)</datalist>`))
  assert.ok(block, `no existe el datalist ${id}`)
  return [...block[1].matchAll(/<option value="([^"]+)"/g)].map((match) => match[1])
}

test('el Panel sugiere todos los subtipos de la lista cerrada', () => {
  const page = read('app/panel/(protected)/hermandades/[id]/salidas/page.js')
  const subtypes = datalistOptions(page, 'outing-subtypes')

  for (const subtype of [
    'del Consejo de Hermandades y Cofradías',
    'de regreso', 'en Vía Crucis', 'colectivo', 'misional',
    'Corpus Christi', 'Resurrección',
    'gloriosa', 'de alabanza', 'histórica', 'solemne', 'de penitencia', 'magna', 'coronación canónica',
  ]) {
    assert.ok(subtypes.includes(subtype), `falta el subtipo «${subtype}»`)
  }
  assert.ok(datalistOptions(page, 'outing-types').includes('Otra salida pública'))
})

test('una Procesión de Gloria sin Hermandad vinculada muestra el organizador', () => {
  const loader = read('lib/supabase/glory-directory.js')

  assert.match(loader, /\.select\('id, slug, brotherhood_entity_id, organizer_name,/)
  assert.match(loader, /brotherhood\?\.name \|\| row\.organizer_name \|\| 'Hermandad por confirmar'/)
})

test('la documentación recoge la lista cerrada con los subtipos nuevos y el tipo para actos sin procesión', () => {
  const doc = read('docs/NORMALIZACION-TIPOS-DE-SALIDA-2026-10-10.md')

  assert.match(doc, /\| Procesión \| gloriosa, de alabanza, histórica, solemne, de penitencia, magna, coronación canónica \|/)
  assert.match(doc, /\| Otra salida pública \|/)
  assert.match(doc, /## Cierre de la lista · 13\/10\/2026/)
})
