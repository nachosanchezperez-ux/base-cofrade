import assert from 'node:assert/strict'
import test from 'node:test'
import { applyManagedBrotherhoodSections } from '../lib/brotherhood-authority-core.js'

const local = {
  historia: 'Historia antigua local',
  cultos: [{ id: 'local-cult', nombre: 'Culto local' }],
  imagenes: [
    { id: 'local-a', slug: 'titular-a', nombre: 'Titular A local', descripcion: 'Descripción local que aún enriquece' },
    { id: 'local-only', slug: 'titular-antiguo', nombre: 'Titular retirado' },
  ],
  colores: { primario: '#111111', secundario: '#222222', claro: '#FFFFFF' },
}

const remote = {
  entity: { id: 'brotherhood-id', name: 'Hermandad', summary: '' },
  brotherhood: {
    popular_name: 'Hermandad',
    official_name: 'Hermandad oficial',
    brotherhood_types: ['Penitencia'],
  },
  municipality: null,
  place: null,
  colors: [],
  socialLinks: [],
  imagenes: [{ id: 'remote-a', slug: 'titular-a', nombre: 'Titular A remoto' }],
  pasos: [],
  acontecimientos: [],
  salidas: [],
  cultos: [],
  cartelesFiestas: [],
  patrimonio: [],
  estrenos: [],
  acompanamientoActual: [],
  datosJornada: null,
  sources: [],
}

test('una sección no gestionada conserva el merge existente', () => {
  const merged = { ...local, cultos: [...local.cultos] }
  const result = applyManagedBrotherhoodSections({ merged, local, remote, managedSections: [] })
  assert.deepEqual(result.cultos, local.cultos)
  assert.equal(result.historia, local.historia)
})

test('una sección gestionada y vacía no recupera el fallback local', () => {
  const merged = { ...local, cultos: [...local.cultos] }
  const result = applyManagedBrotherhoodSections({ merged, local, remote, managedSections: ['cultos'] })
  assert.deepEqual(result.cultos, [])
})

test('Historia administrada desde el Panel puede quedar vacía intencionadamente', () => {
  const merged = { ...local }
  const result = applyManagedBrotherhoodSections({
    merged,
    local,
    remote,
    managedSections: ['historia'],
    historyText: '',
  })
  assert.equal(result.historia, '')
})

test('Titulares gestionados descartan relaciones locales retiradas pero conservan enriquecimiento del mismo slug', () => {
  const merged = { ...local, imagenes: [...local.imagenes] }
  const result = applyManagedBrotherhoodSections({ merged, local, remote, managedSections: ['titulares'] })
  assert.equal(result.imagenes.length, 1)
  assert.equal(result.imagenes[0].slug, 'titular-a')
  assert.equal(result.imagenes[0].nombre, 'Titular A remoto')
  assert.equal(result.imagenes[0].descripcion, 'Descripción local que aún enriquece')
  assert.equal(result.imagenes[0].fichaDisponible, true)
})

test('Identidad gestionada permite que los valores vacíos de Supabase sustituyan datos locales', () => {
  const merged = {
    ...local,
    localidad: 'Sevilla',
    sede: 'Sede antigua',
    resumen: 'Resumen antiguo',
    escudoPath: '/escudo-antiguo.png',
  }
  const result = applyManagedBrotherhoodSections({ merged, local, remote, managedSections: ['identidad'] })
  assert.equal(result.localidad, '')
  assert.equal(result.sede, '')
  assert.equal(result.resumen, '')
  assert.equal(result.escudoPath, null)
})
