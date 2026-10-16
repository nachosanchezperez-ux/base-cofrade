import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

// Ejecuta las Server Actions reales con transporte de datos y sesión aislados.
// Ninguna prueba escribe en Supabase ni necesita credenciales.
const fakes = {
  'next/cache': `export const revalidatePath = (...args) => globalThis.newsTest.invalidations.push(args); export const updateTag = () => {};`,
  'next/navigation': `export const redirect = (path) => { throw new Error('REDIRECT:' + path) };`,
  '@/lib/panel/auth': `export const requirePanelEditor = async () => { if (!['admin','editor'].includes(globalThis.newsTest.role)) throw new Error('Sin permiso'); return { id:'editor', name:'Editor' } }; export const requirePanelAdmin = requirePanelEditor;`,
  '@/lib/supabase/server': `export const createClient = async () => globalThis.newsTest.client;`,
}
const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
  if (fakes[specifier]) return { url: `data:text/javascript,${encodeURIComponent(fakes[specifier])}`, shortCircuit: true }
  if (specifier === '@/lib/hilo-movements-editorial') return { url: new URL('../lib/hilo-movements-editorial.js', import.meta.url).href, shortCircuit: true }
  return nextResolve(specifier, context)
} })
const { createNewsAction, updateNewsAction } = await import('../app/panel/(protected)/noticias/actions.js')
hooks.deregister()

const newsId = '10000000-0000-4000-8000-000000000001'
const bandId = '20000000-0000-4000-8000-000000000001'
const oldId = '30000000-0000-4000-8000-000000000001'
const locality = '40000000-0000-4000-8000-000000000001'
function setup({ role = 'editor', bandStatus = 'published', bandType = 'band', existing = false } = {}) {
  const tables = {
    entities: [{ id: bandId, entity_type: bandType, status: bandStatus, name: 'Las Cigarreras', slug: 'las-cigarreras' }, { id: oldId, entity_type: 'brotherhood', status: 'published', slug: 'hermandad' }],
    editorial_content: existing ? [{ id: newsId, content_type: 'news', status: 'published', slug: 'nuevo-uniforme' }] : [],
    editorial_content_links: existing ? [{ id: 'link', editorial_content_id: newsId, entity_id: oldId, relation_type: 'about', is_primary: true }] : [],
    source_links: [{ source_id: 'source', editorial_content_id: newsId }],
    sources: [{ id: 'source', name: 'Comunicado', url: 'https://example.org/comunicado' }],
    audit_log: [],
  }
  const writes = []
  const client = { from(table) {
    let op = 'read', payload, single = false, filters = []
    const query = {
      select() { return query }, order() { return query }, limit() { return query },
      eq(key, value) { filters.push(row => row[key] === value); return query },
      neq(key, value) { filters.push(row => row[key] !== value); return query },
      in(key, values) { filters.push(row => values.includes(row[key])); return query },
      insert(value) { op = 'insert'; payload = value; return query },
      update(value) { op = 'update'; payload = value; return query },
      maybeSingle() { single = true; return query }, single() { single = true; return query },
      then(resolve, reject) {
        try {
          let rows = tables[table].filter(row => filters.every(check => check(row)))
          if (op === 'insert') { const row = { id: table === 'editorial_content' ? newsId : `new-${table}`, ...payload }; tables[table].push(row); rows = [row] }
          if (op === 'update') rows.forEach(row => Object.assign(row, payload))
          if (op !== 'read') writes.push({ table, op, payload })
          return Promise.resolve({ data: structuredClone(single ? rows[0] || null : rows), error: null }).then(resolve, reject)
        } catch (error) { return Promise.reject(error).then(resolve, reject) }
      },
    }
    return query
  } }
  globalThis.newsTest = { role, client, invalidations: [] }
  return { tables, writes }
}
function form(overrides = {}) {
  const values = { content_id: newsId, title: 'Nuevo uniforme', slug: 'nuevo-uniforme', protagonist_entity_id: bandId, summary: 'La banda estrena uniforme.', body: 'Comunicado oficial.', news_topic: 'musica', municipality_id: locality, publish_date: '2026-10-15', announced_on: '2026-10-15', status: 'published', ...overrides }
  const data = new FormData()
  for (const [key, value] of Object.entries(values)) data.set(key, value)
  return data
}

test('un editor crea el borrador con banda, lo publica y mantiene su vínculo al editar', async () => {
  const { tables } = setup()
  await assert.rejects(createNewsAction(form()), /REDIRECT:.*saved=created/)
  assert.equal(tables.editorial_content[0].status, 'draft')
  assert.equal(tables.editorial_content_links[0].entity_id, bandId)
  await assert.rejects(updateNewsAction(form()), /REDIRECT:.*saved=published/)
  assert.equal(tables.editorial_content[0].status, 'published')
  await assert.rejects(updateNewsAction(form({ title: 'Nuevo uniforme de verano' })), /REDIRECT:.*saved=updated/)
  assert.equal(tables.editorial_content_links.length, 1)
  assert.equal(tables.editorial_content_links[0].entity_id, bandId)
  assert.ok(globalThis.newsTest.invalidations.some(([path]) => path === '/bandas/[slug]'))
})

test('cambiar de Hermandad a banda conserva una sola protagonista', async () => {
  const { tables } = setup({ existing: true })
  await assert.rejects(updateNewsAction(form()), /REDIRECT:/)
  assert.equal(tables.editorial_content_links.length, 1)
  assert.equal(tables.editorial_content_links[0].entity_id, bandId)
})

test('una banda sin publicar no reemplaza el vínculo de una noticia publicada', async () => {
  const { tables, writes } = setup({ existing: true, bandStatus: 'draft' })
  await assert.rejects(updateNewsAction(form()), /ficha protagonista no está publicada/)
  assert.equal(tables.editorial_content_links[0].entity_id, oldId)
  assert.equal(writes.length, 0)
})

test('no permite crear con fichas de otro tipo ni a usuarios de consulta', async () => {
  for (const config of [{ bandType: 'image' }, { role: 'viewer' }]) {
    const { writes } = setup(config)
    await assert.rejects(createNewsAction(form()), /seleccionada no existe|Sin permiso/)
    assert.equal(writes.length, 0)
  }
})
