import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import {
  getHiloMediaStoragePath,
  normalizeHiloMediaReference,
  resolveHiloMediaReference,
} from '../lib/supabase/hilo-media-paths.js'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('normaliza las URL públicas de Hilo Media como rutas internas', () => {
  const fullUrl = 'https://example.supabase.co/storage/v1/object/public/hilo-media/habitos/a/b/file%20name.png?download=1#x'

  assert.equal(normalizeHiloMediaReference(fullUrl), 'habitos/a/b/file name.png')
  assert.equal(normalizeHiloMediaReference('hilo-media/habitos/a.png'), 'habitos/a.png')
  assert.equal(getHiloMediaStoragePath(fullUrl), 'habitos/a/b/file name.png')
})

test('conserva rutas locales y URL externas', () => {
  assert.equal(normalizeHiloMediaReference('/hermandades/foo.png'), '/hermandades/foo.png')
  assert.equal(normalizeHiloMediaReference('https://cdn.example.com/foo.png'), 'https://cdn.example.com/foo.png')
  assert.equal(getHiloMediaStoragePath('/hermandades/foo.png'), '')
  assert.equal(getHiloMediaStoragePath('https://cdn.example.com/foo.png'), '')
})

test('resuelve únicamente las rutas internas contra el bucket público', () => {
  const calls = []
  const supabase = {
    storage: {
      from(bucket) {
        calls.push(bucket)
        return {
          getPublicUrl(path) {
            calls.push(path)
            return { data: { publicUrl: `https://storage.example/${bucket}/${path}` } }
          },
        }
      },
    },
  }

  assert.equal(
    resolveHiloMediaReference(supabase, 'habitos/a.png'),
    'https://storage.example/hilo-media/habitos/a.png'
  )
  assert.deepEqual(calls, ['hilo-media', 'habitos/a.png'])
  assert.equal(resolveHiloMediaReference(supabase, '/local.png'), '/local.png')
  assert.equal(resolveHiloMediaReference(supabase, 'https://cdn.example.com/a.png'), 'https://cdn.example.com/a.png')
})

test('el flujo de hábitos guarda rutas internas y las resuelve solo al visualizar', async () => {
  const [actions, panelLoader, panelPage, publicLoader] = await Promise.all([
    source('app/panel/(protected)/hermandades/[id]/habito/actions.js'),
    source('lib/panel/brotherhood-habits.js'),
    source('app/panel/(protected)/hermandades/[id]/habito/page.js'),
    source('lib/supabase/brotherhood-display.js'),
  ])

  assert.match(actions, /image_path:\s*storagePath/)
  assert.doesNotMatch(actions, /const publicUrl\s*=/)
  assert.match(actions, /normalizeHiloMediaReference/)
  assert.match(panelLoader, /image_url:\s*resolveHiloMediaReference/)
  assert.match(panelPage, /src=\{item\.image_url\}/)
  assert.match(panelPage, /defaultValue=\{item\?\.image_path/)
  assert.match(publicLoader, /imagenPath:\s*resolveHiloMediaReference/)
})

test('versiona la migración remota que normaliza y blinda image_path', async () => {
  const migration = await source(
    'supabase/migrations/20260823232506_normalize_brotherhood_habit_media_paths.sql'
  )

  assert.match(migration, /update public\.brotherhood_habits/)
  assert.match(migration, /set image_path = regexp_replace/)
  assert.match(migration, /storage\/v1\/object\/public\/hilo-media/)
  assert.match(migration, /brotherhood_habits_image_path_internal_reference/)
  assert.match(migration, /image_path !~\*/)
})
