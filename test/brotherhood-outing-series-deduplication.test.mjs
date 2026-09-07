import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { uniquePublicOutings } from '../lib/outings/public-outing-link.js'

const loader = await readFile(new URL('../lib/supabase/brotherhoods.js', import.meta.url), 'utf8')

test('el lector conserva la relación entre cada edición y su serie', () => {
  assert.match(loader, /event_status, outing_series_id/)
  assert.match(loader, /serieId: outing\.outing_series_id/)
  assert.match(loader, /serieId: outing\.id/)
})

test('una edición concreta sustituye a la tarjeta genérica de su serie anual', () => {
  const items = uniquePublicOutings([
    {
      id: 'edicion-2026',
      serieId: 'serie-estacion',
      tipo: 'Estación de penitencia',
      caracter: 'Ordinaria',
      nombre: 'Estación de penitencia de Los Negritos 2026',
      momento: '2 de abril de 2026 · 15:00',
    },
    {
      id: 'serie-estacion',
      serieId: 'serie-estacion',
      tipo: 'Estación de penitencia',
      caracter: 'Anual',
      nombre: 'Estación de penitencia del Jueves Santo',
      momento: 'Jueves Santo',
    },
  ])

  assert.deepEqual(items.map((item) => item.id), ['edicion-2026'])
})

test('una serie anual sigue visible cuando todavía no tiene edición concreta', () => {
  const items = uniquePublicOutings([
    {
      id: 'serie-gloria',
      serieId: 'serie-gloria',
      tipo: 'Procesión de Gloria',
      caracter: 'Anual',
      nombre: 'Salida de Gloria',
    },
  ])

  assert.deepEqual(items.map((item) => item.id), ['serie-gloria'])
})

test('el Vía Crucis de las Cofradías se reserva para su módulo institucional', () => {
  const items = uniquePublicOutings([
    {
      id: 'via-crucis-1977',
      tipo: 'Vía Crucis del Consejo',
      caracter: 'Extraordinaria',
      nombre: 'Vía Crucis de las Cofradías presidido por el Cristo de la Fundación',
    },
    {
      id: 'rosario-2019',
      tipo: 'Rosario Vespertino',
      caracter: 'Extraordinaria',
      nombre: 'Rosario Vespertino extraordinario',
    },
  ])

  assert.deepEqual(items.map((item) => item.id), ['rosario-2019'])
})
