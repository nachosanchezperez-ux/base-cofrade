import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { orderProcessionalItems, processionalRank } from '../lib/brotherhood-processional-order.js'

test('ordena misterio y Señor o Cristo antes que Virgen o palio', () => {
  const items = [
    { nombre: 'Paso de palio de la Virgen de la Esperanza', tipo: 'Palio' },
    { nombre: 'Paso de Nuestro Padre Jesús de la Salud', tipo: 'Nazareno' },
    { nombre: 'Paso de misterio de la Sagrada Cena', tipo: 'Misterio' },
  ]

  assert.deepEqual(
    orderProcessionalItems(items).map((item) => item.tipo),
    ['Misterio', 'Nazareno', 'Palio']
  )
})

test('reconoce Señor y Virgen aun cuando el tipo es genérico', () => {
  assert.ok(processionalRank({ nombre: 'Santísimo Cristo de la Sangre', tipo: 'Paso' }) < processionalRank({ nombre: 'Santísima Virgen de la Encarnación', tipo: 'Paso' }))
})

test('conserva el orden de entrada entre elementos de la misma categoría', () => {
  const items = [
    { nombre: 'Primer paso de Cristo', tipo: 'Cristo' },
    { nombre: 'Segundo paso de Cristo', tipo: 'Cristo' },
  ]

  assert.deepEqual(orderProcessionalItems(items), items)
})

test('la ficha ofrece un acceso directo al bloque compacto de estrenos', () => {
  const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
  const component = readFileSync(new URL('../components/BrotherhoodHeritageUpdates.js', import.meta.url), 'utf8')

  assert.doesNotMatch(page, /href: '#estrenos'/)
  assert.match(page, /<BrotherhoodHeritageUpdates[\s\S]*?items=\{h\.estrenos\}/)
  assert.match(component, /className=\{`heritage-timeline-block \$\{styles\.section\}`\} id="estrenos"/)
  assert.match(component, /data-heritage-updates="compact"/)
})
