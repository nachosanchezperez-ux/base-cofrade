import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el programa de mano se aplica por tipo Penitencia sin excepciones por slug', () => {
  const page = source('app/hermandades/[slug]/page.js')
  const hero = source('components/BrotherhoodProgramHero.js')

  assert.match(page, /import BrotherhoodProgramHero from '@\/components\/BrotherhoodProgramHero'/)
  assert.match(page, /const isPenitencia = tiposHermandad\.includes\('Penitencia'\)/)
  assert.match(page, /\{isPenitencia \? \(/)
  assert.match(page, /<BrotherhoodProgramHero/)
  assert.equal(/h\.slug\s*===/.test(page), false)
  assert.equal(hero.includes('El Baratillo'), false)
})

test('la portada muestra datos útiles con semántica documentada', () => {
  const page = source('app/hermandades/[slug]/page.js')

  assert.match(page, /label: 'Salida'/)
  assert.match(page, /Nazarenos · \$\{h\.datosJornada\.ano\}/)
  assert.match(page, /label: 'Tiempo en Carrera Oficial'/)
  assert.match(page, /h\.datosJornada\?\.tiempoCarreraOficial/)
  assert.match(page, /label: 'Pasos'/)
  assert.match(page, /h\.datosJornada\?\.totalNazarenos/)
  assert.match(page, /h\.pasos\?\.length/)
  assert.equal(page.includes("label: 'Carrera Oficial', value: carreraOficial"), false)
  assert.equal(page.includes('de la jornada'), false)
})

test('De un vistazo sustituye Datos clave e integra Sede y visita sin repetirlos como secciones básicas', () => {
  const page = source('app/hermandades/[slug]/page.js')
  const overview = source('components/BrotherhoodOverviewV2.js')

  assert.match(page, /import BrotherhoodOverviewV2 from '@\/components\/BrotherhoodOverviewV2'/)
  assert.match(page, /<BrotherhoodOverviewV2 brotherhood=\{h\}/)
  assert.equal(page.includes('key-data-card'), false)
  assert.equal(page.includes('Datos clave'), false)
  assert.equal(page.includes('BrotherhoodSeatSection'), false)
  assert.equal(page.includes("label: 'Sede y visita'"), false)

  assert.match(overview, /De un vistazo/)
  assert.match(overview, /Sede y visita/)
  assert.match(overview, /Fundación/)
  assert.match(overview, /Hermanos/)
  assert.match(overview, /Titulares/)
  assert.match(overview, /Cómo llegar/)
  assert.equal(overview.includes('brotherhood.historia'), false)
})

test('la cabecera usa media gobernada y no recupera la fotografía temporal incrustada del piloto antiguo', () => {
  const page = source('app/hermandades/[slug]/page.js')
  const hero = source('components/BrotherhoodProgramHero.js')

  assert.match(page, /photoSrc: heroMedia\?\.path \|\| ''/)
  assert.match(page, /credit: heroMedia\?\.credit \|\| ''/)
  assert.equal(hero.includes('baratilloHeroPhoto'), false)
  assert.equal(page.includes('baratilloHeroPhoto'), false)
})

test('el programa de mano conserva el contrato de atribución Wikimedia', () => {
  const hero = source('components/BrotherhoodProgramHero.js')

  assert.match(hero, /upload\.wikimedia\.org/)
  assert.match(hero, /commons\.wikimedia\.org\/wiki\/File:/)
  assert.match(hero, /unoptimized=\{bypassImageOptimizer\}/)
  assert.match(hero, /creditHref \?/)
  assert.match(hero, /target="_blank"/)
})
