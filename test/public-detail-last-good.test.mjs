import assert from 'node:assert/strict'
import test from 'node:test'

import { createLastGoodReader, PUBLIC_DETAIL_LAST_GOOD_REVALIDATE } from '../lib/public-detail-last-good.js'

const silent = { warn() {}, error() {} }

function harness({ current, lastGood }) {
  const calls = { current: [], lastGood: [], scheduled: [] }
  const reader = createLastGoodReader({
    label: 'la Hermandad',
    readCurrent: async (...args) => { calls.current.push(args); return current(...args) },
    readLastGood: async (slug) => { calls.lastGood.push(slug); return lastGood(slug) },
    schedule: (task) => calls.scheduled.push(task),
    log: silent,
  })
  return { reader, calls }
}

test('la copia de respaldo dura una semana', () => {
  assert.equal(PUBLIC_DETAIL_LAST_GOOD_REVALIDATE, 604800)
})

test('lectura correcta: devuelve la ficha actual y agenda la copia en segundo plano', async () => {
  const { reader, calls } = harness({ current: async () => ({ slug: 'san-benito', v: 'hoy' }), lastGood: async () => ({ v: 'ayer' }) })
  assert.deepEqual(await reader('san-benito', '2026-10-17'), { slug: 'san-benito', v: 'hoy' })
  assert.deepEqual(calls.current, [['san-benito', '2026-10-17']])
  assert.equal(calls.lastGood.length, 0, 'la copia no se lee durante la petición')
  assert.equal(calls.scheduled.length, 1)
  await calls.scheduled[0]()
  assert.deepEqual(calls.lastGood, ['san-benito'])
})

test('fallo de Supabase: sirve la última copia completa', async () => {
  const { reader } = harness({
    current: async () => { throw new Error('502 Bad Gateway') },
    lastGood: async () => ({ v: 'copia' }),
  })
  assert.deepEqual(await reader('pasion-y-muerte', '2026-10-15'), { v: 'copia' })
})

test('fallo sin copia disponible: propaga el error original', async () => {
  const { reader } = harness({
    current: async () => { throw new Error('502 Bad Gateway') },
    lastGood: async () => { throw new Error('también falla') },
  })
  await assert.rejects(reader('pasion-y-muerte', '2026-10-15'), /502 Bad Gateway/)
})

test('ficha retirada (null): no usa la copia ni agenda nada', async () => {
  const { reader, calls } = harness({ current: async () => null, lastGood: async () => ({ v: 'vieja' }) })
  assert.equal(await reader('retirada', '2026-10-17'), null)
  assert.equal(calls.lastGood.length, 0)
  assert.equal(calls.scheduled.length, 0)
})

test('si no se puede agendar (fuera de una petición), la lectura sigue funcionando', async () => {
  const reader = createLastGoodReader({
    label: 'la Banda',
    readCurrent: async () => ({ v: 'hoy' }),
    readLastGood: async () => ({ v: 'copia' }),
    schedule: () => { throw new Error('after() fuera de contexto') },
    log: silent,
  })
  assert.deepEqual(await reader('x'), { v: 'hoy' })
})

test('un fallo al rellenar la copia en segundo plano no rompe nada', async () => {
  const { reader, calls } = harness({ current: async () => ({ v: 'hoy' }), lastGood: async () => { throw new Error('502') } })
  await reader('x')
  await assert.doesNotReject(calls.scheduled[0]())
})
