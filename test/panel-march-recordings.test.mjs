import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const actionsPath = '../app/panel/(protected)/marchas/actions.js'
const loaderPath = '../lib/panel/marches.js'
const formPath = '../app/panel/(protected)/marchas/[id]/grabaciones/page.js'
const marchId = '11111111-1111-4111-8111-111111111111'
const recordingId = '22222222-2222-4222-8222-222222222222'

// Execute the real module bodies with only their external dependencies replaced.
function moduleWithMocks(path, mocks, exported) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    .replace(/^import .*$/gm, '').replace(/^export /gm, '')
  return new Function(...Object.keys(mocks), `${source}\nreturn ${exported}`)(...Object.values(mocks))
}

function database(recordings = []) {
  const calls = []
  return {
    calls,
    from(table) {
      const call = { table, operations: [] }
      calls.push(call)
      const query = {}
      for (const method of ['select', 'eq', 'neq', 'in', 'order', 'update', 'insert', 'maybeSingle', 'single']) {
        query[method] = (...args) => { call.operations.push([method, ...args]); return query }
      }
      query.then = (resolve, reject) => {
        const single = call.operations.some(([method]) => ['single', 'maybeSingle'].includes(method))
        const badColumn = call.operations.some(([method, column]) => method === 'order' && column === 'recording_year')
        const data = single ? { id: recordingId, entity_id: marchId, name: 'Test', status: 'draft' } : table === 'march_recordings' ? recordings : []
        return Promise.resolve({ data, error: badColumn ? { message: 'column march_recordings.recording_year does not exist' } : null }).then(resolve, reject)
      }
      return query
    },
  }
}

function saveAction(db) {
  return moduleWithMocks(actionsPath, {
    createClient: async () => db,
    requirePanelEditor: async () => ({ id: marchId, name: 'Test' }),
    revalidateMarchPages: async () => {},
    revalidatePath: () => {},
    redirect: () => {},
  }, 'saveMarchRecordingAction')
}

function form(fields = {}) {
  const result = new FormData()
  for (const [key, value] of Object.entries({ march_id: marchId, status: 'draft', ...fields })) result.set(key, value)
  return result
}

for (const recording of [null, { id: recordingId, recording_date: '2024-02-29', recording_date_text: 'Cuaresma de 2024' }]) {
  test(`editor loads ${recording ? 'existing recordings without losing dates' : 'a march without recordings'}`, async () => {
    const db = database(recording ? [recording] : [])
    const load = moduleWithMocks(loaderPath, {
      createClient: async () => db,
      selectAllRows: async (build) => build(),
      selectRowsByIds: async () => ({ data: [], error: null }),
      loadRelationSourceSupport: async (_db, relations) => ({ relations, sourceOptions: [] }),
    }, 'getMarchEditorData')
    const result = await load(marchId)
    assert.equal(result.recordings.length, recording ? 1 : 0)
    if (recording) assert.equal(result.recordings[0].recording_date, recording.recording_date)
    assert.deepEqual(db.calls.find(c => c.table === 'march_recordings').operations.filter(([op]) => op === 'order'), [
      ['order', 'is_featured', { ascending: false }],
      ['order', 'recording_date', { ascending: false, nullsFirst: false }],
      ['order', 'id'],
    ])
  })
}

for (const editing of [false, true]) {
  for (const [date, text] of [['2024-02-29', 'Cuaresma de 2024'], ['', '1926'], ['', '']]) {
    test(`${editing ? 'update' : 'insert'} preserves exact/text dates: ${date}/${text}`, async () => {
      const db = database()
      await saveAction(db)(form({ ...(editing ? { recording_id: recordingId } : {}), recording_date: date, recording_date_text: text }))
      const write = db.calls.find(c => c.table === 'march_recordings')
      const [method, payload] = write.operations[0]
      assert.equal(method, editing ? 'update' : 'insert')
      assert.equal(payload.recording_date, date || null)
      assert.equal(payload.recording_date_text, text || null)
      assert.equal(Object.hasOwn(payload, 'recording_year'), false)
      if (editing) assert.ok(write.operations.some(([op, column, value]) => op === 'eq' && column === 'march_entity_id' && value === marchId))
    })
  }
}

for (const date of ['2025-02-29', '2024-02-30', '2026-13-01', '0000-01-01', '2026', 'not-a-date']) {
  test(`invalid date ${date} cannot clear a featured recording`, async () => {
    const db = database()
    await assert.rejects(saveAction(db)(form({ recording_date: date, is_featured: 'on' })), /fecha/)
    assert.equal(db.calls.some(c => c.operations.some(([op]) => ['update', 'insert'].includes(op))), false)
  })
}

test('both forms use persisted date columns and retain existing defaults', () => {
  const source = readFileSync(new URL(formPath, import.meta.url), 'utf8')
  assert.equal((source.match(/name="recording_date"/g) || []).length, 2)
  assert.equal((source.match(/name="recording_date_text"/g) || []).length, 2)
  assert.match(source, /defaultValue=\{recording.recording_date \|\| ''\}/)
  assert.match(source, /defaultValue=\{recording.recording_date_text \|\| ''\}/)
  assert.doesNotMatch(source, /recording_year/)
})
