import assert from 'node:assert/strict'
import test from 'node:test'

// El módulo importa '@/lib/agenda-cofrade-location'; se prueba la lógica con un
// cargador mínimo que resuelve el alias.
import { register } from 'node:module'
register('data:text/javascript,' + encodeURIComponent(`
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) return next(new URL('../' + specifier.slice(2) + '.js', ${JSON.stringify(import.meta.url)}).href, context)
  return next(specifier, context)
}`))

const { agendaInitialStateFromParams } = await import('../lib/agenda-cofrade-url-state.js')
const fromObject = (params) => (name) => params[name]

test('sin parámetros, la Agenda muestra todo lo próximo', () => {
  assert.deepEqual(agendaInitialStateFromParams(fromObject({})), {
    initialCategory: 'all', initialPeriod: 'upcoming', initialTerritory: 'all', initialMunicipality: '',
    stateKey: 'all:upcoming:all:',
  })
})

test('valores no admitidos vuelven al valor por defecto', () => {
  const state = agendaInitialStateFromParams(fromObject({ categoria: 'archive', periodo: 'ayer', territorio: 'marte' }))
  assert.equal(state.initialCategory, 'all')
  assert.equal(state.initialPeriod, 'upcoming')
  assert.equal(state.initialTerritory, 'all')
})

test('los filtros válidos se respetan y aceptan valores repetidos', () => {
  const state = agendaInitialStateFromParams(fromObject({ categoria: ['romeries', 'concerts'], periodo: 'tomorrow', territorio: 'capital' }))
  assert.equal(state.initialCategory, 'romeries')
  assert.equal(state.initialPeriod, 'tomorrow')
  assert.equal(state.initialTerritory, 'capital')
  assert.equal(state.stateKey, 'romeries:tomorrow:capital:')
})
