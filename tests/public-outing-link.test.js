import test from 'node:test'
import assert from 'node:assert/strict'

import { publicOutingRouteSlug, uniquePublicOutings } from '../lib/outings/public-outing-link.js'

test('mantiene extraordinarias en su guía y enruta glorias ordinarias a su ficha', () => {
  const extraordinary = new Set(['coronacion-2026'])

  assert.equal(publicOutingRouteSlug({ slug: 'coronacion-2026', tipo: 'Procesión de Gloria', caracter: 'extraordinary' }, extraordinary), 'coronacion-2026')
  assert.equal(publicOutingRouteSlug({ slug: 'dolores-2026', tipo: 'Procesión de Gloria', caracter: 'ordinary' }, extraordinary), 'gloria/dolores-2026')
  assert.equal(publicOutingRouteSlug({ slug: 'traslado-2026', tipo: 'Traslado', caracter: 'ordinary' }, extraordinary), '')
})

test('elimina tarjetas duplicadas sin confundir salidas distintas', () => {
  const items = [
    { id: '1', slug: 'estrella-2026', tipo: 'Procesión de Gloria', nombre: 'Procesión de Nuestra Señora de la Estrella 2026', momento: '8 de septiembre de 2026', caracter: 'ordinary' },
    { id: '1', slug: 'estrella-2026', tipo: 'Procesión de Gloria', nombre: 'Procesión de Nuestra Señora de la Estrella 2026', momento: '8 de septiembre de 2026', caracter: 'ordinary' },
    { id: '2', slug: 'divino-lucero-2026', tipo: 'Procesión de Gloria', nombre: 'Ofrenda de Nardos y procesión del Divino Lucero 2026', momento: '7 de septiembre de 2026', caracter: 'ordinary' },
  ]

  assert.deepEqual(uniquePublicOutings(items).map((item) => item.id), ['1', '2'])
})

test('reserva el Vía Crucis del Consejo para su módulo institucional', () => {
  const items = [
    { id: 'via-crucis', slug: 'via-crucis-consejo-1989-san-bernardo', tipo: 'Vía Crucis del Consejo', nombre: 'Vía Crucis de las Cofradías 1989', caracter: 'extraordinary' },
    { id: 'extraordinaria', slug: 'salida-extraordinaria-2026', tipo: 'Salida extraordinaria', nombre: 'Salida extraordinaria 2026', caracter: 'extraordinary' },
  ]

  assert.deepEqual(uniquePublicOutings(items).map((item) => item.id), ['extraordinaria'])
})
