import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el title municipal combina intención cofradías y agenda', () => {
  const page = read('app/agenda-cofrade/localidad/[localidad]/page.js')

  assert.match(page, /Cofradías de \$\{hub\.label\}: hermandades y agenda cofrade/)
  assert.match(page, /hermandades, procesiones, agenda, bandas, imágenes y pasos/)
  assert.match(page, /socialMetadata\(\{ title, description, path \}\)/)
})

test('el H1 presenta el hub como guía cofrade evergreen', () => {
  const hub = read('components/MunicipalityAgendaHub.js')

  assert.match(hub, /<h1>Guía cofrade de \{hub\.label\}<\/h1>/)
  assert.match(hub, /Cofradías, hermandades y agenda/)
  assert.match(hub, /name: `Guía cofrade de \$\{hub\.label\}`/)
  assert.match(hub, /Guía cofrade de \$\{hub\.label\}: agenda, Hermandades, Bandas, Imágenes y Pasos/)
})

test('la intención amplia no crea una segunda URL municipal', () => {
  const page = read('app/agenda-cofrade/localidad/[localidad]/page.js')
  const hub = read('components/MunicipalityAgendaHub.js')

  assert.match(page, /const path = `\/agenda-cofrade\/localidad\/\$\{hub\.slug\}`/)
  assert.match(hub, /const path = `\/agenda-cofrade\/localidad\/\$\{hub\.slug\}`/)
})
