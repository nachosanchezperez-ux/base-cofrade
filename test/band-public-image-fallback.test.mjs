import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [component, page, css] = await Promise.all([
  readFile(new URL('../components/BandFeaturePhoto.js', import.meta.url), 'utf8'),
  readFile(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8'),
  readFile(new URL('../app/bandas/bandas.module.css', import.meta.url), 'utf8'),
])

test('la fotografía de presentación de una banda nunca deja el icono roto nativo', () => {
  assert.match(page, /<BandFeaturePhoto/)
  assert.match(component, /onError=\{\(\) => setPhotoFailed\(true\)\}/)
  assert.match(component, /onError=\{\(\) => setLogoFailed\(true\)\}/)
  assert.match(component, /Identidad visual de la formación/)
  assert.match(css, /\.featurePhotoFallback/)
})

// Criterio del propietario (19/10/2026): sin fotografía no hay hueco ni relleno.
// El logotipo ya está en la cabecera; la foto solo aparece si existe.
test('sin fotografía no se pinta la portada de relleno', () => {
  assert.match(page, /\{band\.heroImagePath \? <BandFeaturePhoto/)
  assert.match(page, /src=\{band\.heroImagePath\}/)
  assert.match(page, /styles\.overviewGridSingle/)
  assert.doesNotMatch(page, /style=\{!band\.heroImagePath/)
})
