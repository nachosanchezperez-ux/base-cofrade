import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

test('las jornadas de Semana Santa con una sola hermandad no devuelven 404', async () => {
  const source = await readFile(
    new URL('../app/hermandades/semana-santa/[localidad]/[jornada]/page.js', import.meta.url),
    'utf8'
  )

  assert.match(
    source,
    /brotherhoodsForDirectoryRoute\([\s\S]*?'semana-santa',[\s\S]*?path,[\s\S]*?1[\s\S]*?\)/
  )
})
