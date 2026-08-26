import test from 'node:test'
import assert from 'node:assert/strict'

import { addUndirectedEdge, shortestGraphPath } from '../lib/graph-path.js'

test('encuentra el camino relacional más corto', () => {
  const graph = new Map()
  addUndirectedEdge(graph, 'baratillo', 'palio-caridad', 'tiene paso')
  addUndirectedEdge(graph, 'palio-caridad', 'rafael', 'capataz')
  addUndirectedEdge(graph, 'rafael', 'misterio-cena', 'capataz')
  addUndirectedEdge(graph, 'misterio-cena', 'cena', 'pertenece a')
  addUndirectedEdge(graph, 'baratillo', 'desvio', 'otro')
  addUndirectedEdge(graph, 'desvio', 'muy-largo-1', 'otro')
  addUndirectedEdge(graph, 'muy-largo-1', 'muy-largo-2', 'otro')
  addUndirectedEdge(graph, 'muy-largo-2', 'cena', 'otro')

  const path = shortestGraphPath(graph, 'baratillo', 'cena', 6)
  assert.deepEqual(path.nodes, ['baratillo', 'palio-caridad', 'rafael', 'misterio-cena', 'cena'])
  assert.equal(path.edges.length, 4)
})

test('respeta la profundidad máxima', () => {
  const graph = new Map()
  addUndirectedEdge(graph, 'a', 'b', 'r1')
  addUndirectedEdge(graph, 'b', 'c', 'r2')
  addUndirectedEdge(graph, 'c', 'd', 'r3')

  assert.equal(shortestGraphPath(graph, 'a', 'd', 2), null)
  assert.equal(shortestGraphPath(graph, 'a', 'd', 3).edges.length, 3)
})

test('las relaciones son transitables en ambos sentidos', () => {
  const graph = new Map()
  addUndirectedEdge(graph, 'a', 'b', 'relacion')

  const path = shortestGraphPath(graph, 'b', 'a', 1)
  assert.deepEqual(path.nodes, ['b', 'a'])
})

test('conserva el soporte documental en ambos sentidos', () => {
  const graph = new Map()
  const support = { kind: 'brotherhood_step', id: 'rel-1' }
  addUndirectedEdge(graph, 'h', 's', 'Paso de la hermandad', '', support)

  assert.deepEqual(shortestGraphPath(graph, 'h', 's', 1).edges[0].support, support)
  assert.deepEqual(shortestGraphPath(graph, 's', 'h', 1).edges[0].support, support)
})
