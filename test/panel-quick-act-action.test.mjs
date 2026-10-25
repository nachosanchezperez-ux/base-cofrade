import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as core from '../lib/panel/quick-act-core.js'

const source = readFileSync(new URL('../app/panel/(protected)/agenda/nuevo/actions.js', import.meta.url), 'utf8')
  .replace(/^import .*\n/gm, '').replace('export async function', 'async function')
const dependencies = ['randomUUID', 'revalidatePath', 'redirect', 'requirePanelEditor', 'revalidateAgendaPhotos',
  'PANEL_IMAGE_MAX_BYTES', 'PANEL_IMAGE_TYPES', 'parseQuickAct', 'quickActTitle', 'quickCultPayloads', 'quickOutingPayload', 'slugify', 'createClient']
const makeAction = new Function(...dependencies, `${source}\nreturn createQuickActAction`)

function setup({ type = 'procesion', duplicate = false, failure = '' } = {}) {
  const writes = []
  const redirects = []
  const db = { from(table) {
    let operation = 'read'
    const result = () => {
      if (table === failure) return { data: null, error: { message: 'query failed' } }
      if (table === 'entities') return { data: { id: 'brotherhood', name: 'Hermandad' }, error: null }
      if (table === 'cults') return { data: { id: 'cult' }, error: null }
      if (operation === 'insert') return { data: { id: 'created' }, error: null }
      return { data: duplicate ? { id: 'existing' } : null, error: null }
    }
    const q = { select() { return this }, eq() { return this }, neq() { return this }, ilike() { return this }, order() { return this }, limit() { return this },
      insert(payload) { operation = 'insert'; writes.push({ table, payload }); return this },
      maybeSingle: async () => result(), single: async () => result(),
      then(resolve, reject) { return Promise.resolve(result()).then(resolve, reject) } }
    return q
  } }
  const action = makeAction(() => 'uuid', () => {}, url => { redirects.push(url) },
    async () => ({ id: 'editor' }), () => {}, 10e6, new Map([['image/png', 'png']]),
    core.parseQuickAct, core.quickActTitle, core.quickCultPayloads, core.quickOutingPayload, core.slugify, async () => db)
  const form = new FormData()
  Object.entries({ act_type: type, brotherhood_id: '21279e61-2c75-4757-88d0-f8422e7e29ec', start_date: '2026-10-23', title: 'Acto de prueba', start_time: '20:30' })
    .forEach(([key, value]) => form.set(key, value))
  return { action, form, writes, redirects }
}

for (const type of ['procesion', 'misa-hermandad']) {
  test(`${type}: duplicate returns an inline error before writes or image upload`, async () => {
    const { action, form, writes, redirects } = setup({ type, duplicate: true })
    form.set('image', new File(['test'], 'poster.png', { type: 'image/png' }))
    form.set('image_rights', 'owned')
    form.set('image_alt', 'Cartel de prueba')
    const result = await action(form)
    assert.match(result.error, /existe|convocatoria/)
    assert.deepEqual(writes, [])
    assert.deepEqual(redirects, [])
  })
}

for (const [type, failure] of [['procesion', 'outings'], ['misa-hermandad', 'cults'], ['misa-hermandad', 'cult_occurrences']]) {
  test(`${failure}: failed duplicate lookup prevents creation`, async () => {
    const { action, form, writes, redirects } = setup({ type, failure })
    assert.ok((await action(form)).error)
    assert.deepEqual(writes, [])
    assert.deepEqual(redirects, [])
  })
}

test('invalid input returns an error without a redirect', async () => {
  const { action, form, writes, redirects } = setup()
  form.delete('start_date')
  assert.match((await action(form)).error, /fecha/)
  assert.deepEqual(writes, [])
  assert.deepEqual(redirects, [])
})

test('a successful draft still redirects and never becomes published', async () => {
  const { action, form, writes, redirects } = setup()
  await action(form)
  assert.equal(writes.find(row => row.table === 'outings').payload.status, 'draft')
  assert.match(redirects[0], /creado=salida.*estado=borrador/)
})
