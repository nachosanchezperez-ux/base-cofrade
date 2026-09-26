import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { withProcessionLiveState } from '../lib/procession-live-status.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Ejecuta los cuerpos reales con dependencias controladas, sin red ni secretos.
function loadModule(path, dependencies, exports) {
  const source = read(path).replace(/^import .*\n/gm, '').replace(/^export /gm, '')
  return new Function(...Object.keys(dependencies), `${source}\nreturn { ${exports.join(', ')} }`)(...Object.values(dependencies))
}

for (const [file, name] of [
  ['rosary-outings', 'getRosaryOutings'],
  ['extraordinary-directory', 'getExtraordinaryDirectory'],
  ['glory-directory', 'getGloryDirectory'],
  ['general-public-outings', 'getGeneralPublicOutings'],
  ['kissing-devotions', 'getKissingDevotions'],
  ['concert-events', 'getConcertEventDirectory'],
]) {
  test(`${name}: propaga fallos en modo estricto y conserva compatibilidad`, async () => {
    const failure = new Error('Database connection timeout')
    const module = loadModule(`lib/supabase/${file}.js`, {
      createPublicClient: () => { throw failure },
      unstable_cache: (loader) => loader,
      console: { error() {} },
    }, [name])
    await assert.rejects(module[name]({ throwOnError: true }), (error) => error === failure)
    assert.deepEqual(await module[name](), [])
  })
}

function agendaFixture() {
  let fail = false
  let calls = 0
  let cacheOptions
  const sources = ['getRosaryOutings', 'getExtraordinaryDirectory', 'getGloryDirectory', 'getGeneralPublicOutings', 'getKissingDevotions', 'getConcertEventDirectory']
  const dependencies = Object.fromEntries(sources.map((name) => [name, async (options) => {
    assert.equal(options.throwOnError, true)
    calls += 1
    if (fail && name === 'getConcertEventDirectory') throw new Error('concert timeout')
    if (name === 'getRosaryOutings' || name === 'getExtraordinaryDirectory') {
      return [{ id: 'same-outing', title: 'Rosario', date: '2026-10-10', isUpcoming: true, isExtraordinary: true }]
    }
    return []
  }]))
  dependencies.withProcessionLiveState = withProcessionLiveState
  dependencies.agendaMunicipalityHref = () => ''
  dependencies.unstable_cache = (loader, keys, options) => {
    cacheOptions = { keys, ...options }
    const cache = new Map()
    return async (...args) => {
      const key = JSON.stringify(args)
      if (cache.has(key)) return cache.get(key)
      const result = await loader(...args)
      cache.set(key, result)
      return result
    }
  }
  const module = loadModule('lib/supabase/agenda-cofrade.js', dependencies, ['getAgendaCofrade', 'getCachedAgendaSources'])
  return { ...module, setFailure: (value) => { fail = value }, calls: () => calls, options: () => cacheOptions }
}

test('la agenda reutiliza una lectura completa y conserva la deduplicación de rosarios', async () => {
  const fixture = agendaFixture()
  const first = await fixture.getAgendaCofrade()
  const second = await fixture.getAgendaCofrade()
  assert.equal(fixture.calls(), 6)
  assert.equal(fixture.options().revalidate, 300)
  assert.equal(first.items.length, 1)
  assert.equal(second.items[0].category, 'rosaries')
  assert.equal(first.items[0].isExtraordinary, true)
})

test('una fuente fallida no se convierte en éxito parcial ni queda cacheada', async () => {
  const fixture = agendaFixture()
  fixture.setFailure(true)
  await assert.rejects(fixture.getAgendaCofrade(), /concert timeout/)
  fixture.setFailure(false)
  const recovered = await fixture.getAgendaCofrade()
  assert.equal(fixture.calls(), 12)
  assert.equal(recovered.items.length, 1)
})

test('la clave diaria no reutiliza flags de ayer', async () => {
  const fixture = agendaFixture()
  await fixture.getCachedAgendaSources('2026-09-24')
  await fixture.getCachedAgendaSources('2026-09-25')
  assert.equal(fixture.calls(), 10)
  assert.match(read('lib/supabase/agenda-cofrade.js'), /getCachedAgendaSources\(madridDateKey\(\)\)/)
})

test('connection precede las consultas y no se carga un calendario entero para un contador', () => {
  const page = read('app/agenda-cofrade/page.js')
  assert.match(page, /import \{ connection \} from 'next\/server'/)
  assert.ok(page.indexOf('await connection()') < page.indexOf('await getAgendaCofrade()'))
  assert.doesNotMatch(page, /getCrewEventDirectory|force-dynamic/)
  assert.match(page, /canonical: '\/agenda-cofrade'/)
})

test('el error no expone detalles internos ni afirma que no hay actos', () => {
  const boundary = read('app/agenda-cofrade/error.js')
  assert.match(boundary, /'use client'/)
  assert.match(boundary, /No hemos podido cargar la agenda/)
  assert.match(boundary, /retry\(\)/)
  assert.doesNotMatch(boundary, /error\.message|error\.stack|dangerouslySetInnerHTML/)
})
