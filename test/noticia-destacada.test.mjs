// Noticia destacada desde el Panel (featured_until): abre portada e índice.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { featuredFirstHiloMovements, isFeaturedHiloMovement, isFreshHiloMovement } from '../lib/hilo-movements.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const TODAY = '2026-10-18'

test('la destacada lo es hasta el día indicado, incluido', () => {
  assert.equal(isFeaturedHiloMovement({ featuredUntil: '2026-10-18' }, TODAY), true)
  assert.equal(isFeaturedHiloMovement({ featuredUntil: '2026-10-17' }, TODAY), false)
  assert.equal(isFeaturedHiloMovement({ featuredUntil: null }, TODAY), false)
  // Una destacada antigua sigue visible en portada mientras esté vigente.
  assert.equal(isFreshHiloMovement({ announcedOn: '2026-07-01', featuredUntil: '2026-10-20' }, TODAY), true)
})

test('la destacada vigente pasa delante; sin destacada, el orden no cambia', () => {
  const items = [{ id: 'a' }, { id: 'b', featuredUntil: '2026-10-25' }, { id: 'c', featuredUntil: '2026-10-01' }]
  assert.deepEqual(featuredFirstHiloMovements(items, TODAY).map((item) => item.id), ['b', 'a', 'c'])
  const plain = [{ id: 'a' }, { id: 'b' }]
  assert.equal(featuredFirstHiloMovements(plain, TODAY), plain)
  // Con varias, gana la más reciente (la primera en el orden de fecha).
  const two = [{ id: 'x', featuredUntil: '2026-10-30' }, { id: 'y', featuredUntil: '2026-10-30' }]
  assert.deepEqual(featuredFirstHiloMovements(two, TODAY).map((item) => item.id), ['x', 'y'])
})

test('portada e índice usan la destacada; el Panel la edita y la lista la indica', () => {
  assert.match(read('lib/home-news.js'), /selectHiloMovements\(featuredFirstHiloMovements\(/)
  assert.match(read('app/el-hilo-se-mueve/page.js'), /featuredFirstHiloMovements\(filterHiloMovements\(items, filters\)\)/)
  assert.match(read('lib/hilo-movements-editorial.js'), /featuredUntil: row\.featured_until \|\| null/)
  assert.match(read('lib/supabase/hilo-movements.js'), /featured_until/)
  assert.match(read('app/panel/(protected)/noticias/[id]/page.js'), /name="featured_until" type="date"/)
  assert.match(read('app/panel/(protected)/noticias/actions.js'), /featured_until: dateValue\(formData, 'featured_until'\)/)
  assert.match(read('app/panel/(protected)/noticias/page.js'), /destacada hasta el/)
  const migration = read('supabase/migrations/20261018092323_editorial_news_featured_until.sql')
  assert.match(migration, /add column if not exists featured_until date/)
  // Aditiva: ninguna sentencia borra o modifica datos.
  assert.doesNotMatch(migration, /^\s*(drop|delete|update|truncate)\b/im)
})

test('si la migración aún no está aplicada, las noticias se leen sin destacada', () => {
  const loader = read('lib/supabase/hilo-movements.js')
  assert.match(loader, /if \(result\.error && \/featured_until\/\.test\(result\.error\.message \|\| ''\)\) return query\(LEGACY_NEWS_COLUMNS\)/)
})
