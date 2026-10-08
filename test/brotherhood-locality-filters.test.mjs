import assert from 'node:assert/strict'
import test from 'node:test'
import { renderBrotherhoodDirectory } from '../test-support/brotherhood-directory-ssr.mjs'

const row = (id, extra = {}) => ({ id, slug: id, nombrePopular: id, localidad: 'Sevilla', provincia: 'Sevilla', tipos: [], ...extra })
const options = ['todos', 'semana-santa', 'gloria', 'sacramentales', 'agrupaciones-parroquiales']
const groups = (html) => [...html.matchAll(/<div[^>]*data-locality-filters="true"[^>]*>([\s\S]*?)<\/div>/g)].map((match) => match[1])
const buttons = (html) => [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map((match) => ({
  key: match[1].match(/data-directory-filter="([^"]+)"/)[1],
  pressed: /aria-pressed="true"/.test(match[1]),
  text: match[2].replace(/<[^>]*>/g, ''),
}))

test('cada localidad ofrece las cinco opciones en un solo grupo y sin selector de carácter', async () => {
  const html = await renderBrotherhoodDirectory([
    row('sevilla', { tipos: ['Penitencia'], diaSalida: 'Lunes Santo' }),
    row('carmona', { localidad: 'Carmona', tipos: ['Gloria'], gloriaMes: 9 }),
  ])
  const localGroups = groups(html)
  assert.equal(localGroups.length, 2)
  for (const group of localGroups) {
    assert.deepEqual(buttons(group).map((button) => button.key), options)
    assert.deepEqual(buttons(group).filter((button) => button.pressed).map((button) => button.key), ['todos'])
    assert.doesNotMatch(group, /<select|hidden|display:none/)
  }
  assert.doesNotMatch(html, /-caracter|>Carácter</)
})

test('los contadores de las opciones respetan identidades mixtas sin sumar pertenencias', async () => {
  const html = await renderBrotherhoodDirectory([
    row('mixta', { tipos: ['Penitencia', 'Gloria', 'Sacramental'], diaSalida: 'Lunes Santo', gloriaMes: 10 }),
    row('agrupacion', { tipos: ['Agrupación Parroquial'], diaSalida: 'Sábado de Pasión' }),
    row('sacramental', { tipos: ['Sacramental'] }),
  ])
  assert.deepEqual(buttons(groups(html)[0]).map((button) => button.text), [
    'Todas3', 'Semana Santa2', 'Glorias1', 'Sacramentales2', 'Agrupaciones Parroquiales1',
  ])
})

test('las opciones sin coincidencias siguen a la vista con cero y etiquetas completas', async () => {
  const html = await renderBrotherhoodDirectory([row('gloria', { tipos: ['Gloria'], gloriaMes: 9 })])
  assert.deepEqual(buttons(groups(html)[0]).map((button) => button.text), [
    'Todas1', 'Semana Santa0', 'Glorias1', 'Sacramentales0', 'Agrupaciones Parroquiales0',
  ])
})

test('las cinco opciones no amplían la frontera de fichas del SSR inicial', async () => {
  const indexed = row('indexada', { tipos: ['Gloria'], gloriaMes: 9 })
  const html = await renderBrotherhoodDirectory([indexed, row('publica', { tipos: ['Sacramental'] })], [indexed])
  assert.deepEqual(buttons(groups(html)[0]).map((button) => button.text), [
    'Todas1', 'Semana Santa0', 'Glorias1', 'Sacramentales0', 'Agrupaciones Parroquiales0',
  ])
  assert.doesNotMatch(html, /href="\/hermandades\/publica"/)
})
