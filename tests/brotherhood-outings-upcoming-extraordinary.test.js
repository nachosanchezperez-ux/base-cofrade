import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyBrotherhoodOutings } from '../lib/brotherhood-extraordinary-events.js'

test('anunciadas y celebradas se incorporan como acontecimientos', () => {
  const result = classifyBrotherhoodOutings([
    { id: 'future', caracter: 'Extraordinaria', estado: 'announced', nombre: 'Próxima', fecha: '2027-01-01' },
    { id: 'past', caracter: 'Extraordinaria', estado: 'celebrated', nombre: 'Pasada', fecha: '2000-01-01' },
  ])
  assert.equal(result.salidas.length, 0)
  assert.deepEqual(result.cronologia.map(item => item.titulo), ['Pasada', 'Próxima'])
  assert.equal(result.cronologia[1].estado, 'Acontecimiento anunciado')
})
