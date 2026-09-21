import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las facetas de bandas se compactan en móvil sin ocultar el directorio completo', async () => {
  const component = await source('components/BandDirectoryFacets.js')
  const styles = await source('components/BandDirectoryFacets.module.css')

  assert.match(component, /mobileLimit=\{4\}/)
  assert.match(component, /mobileLimit=\{5\}/)
  assert.match(component, /Ver todas las tipologías/)
  assert.match(component, /Ver todas las localidades/)
  assert.match(component, /aria-expanded=\{expanded\}/)

  assert.match(styles, /@media \(max-width: 560px\)/)
  assert.match(styles, /\.links:not\(\.expanded\) \.mobileExtra/)
  assert.match(styles, /display: none/)
  assert.match(styles, /:global\(#hc-app\) \.heading h2/)
})
