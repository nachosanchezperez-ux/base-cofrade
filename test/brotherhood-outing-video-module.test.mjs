import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const loader = fs.readFileSync(new URL('../lib/supabase/brotherhoods.js', import.meta.url), 'utf8')
const pageLoader = fs.readFileSync(new URL('../lib/supabase/brotherhood-page.js', import.meta.url), 'utf8')
const page = fs.readFileSync(new URL('../components/BrotherhoodOutingsSection.js', import.meta.url), 'utf8')
const image = fs.readFileSync(new URL('../components/BrotherhoodOutingImage.js', import.meta.url), 'utf8')
const styles = fs.readFileSync(new URL('../components/BrotherhoodOutingsSection.module.css', import.meta.url), 'utf8')

test('la ficha asocia el vídeo a la salida concreta y no a la cronología', () => {
  assert.match(loader, /from\('outing_media'\)/)
  assert.match(loader, /media_type === 'video'/)
  assert.match(loader, /youtubeVideoId/)
  assert.match(page, /if \(!outing\.video\) return null/)
  assert.match(page, /Archivo audiovisual/)
})

test('el módulo reproduce YouTube sin autoplay y conserva acceso al canal oficial', () => {
  assert.match(page, /youtube-nocookie\.com\/embed/)
  assert.doesNotMatch(page, /autoplay=1/)
  assert.match(page, /Ver en el canal de la Hermandad/)
  assert.match(styles, /\.videoFrame[\s\S]*aspect-ratio: 16 \/ 9/)
  assert.match(styles, /@media \(max-width: 620px\)[\s\S]*\.videoHeading/)
})

test('las fotografías subidas desde Salidas llegan a la tarjeta pública de esa salida', () => {
  assert.match(pageLoader, /hero_image_path, hero_image_alt, hero_image_credit/)
  assert.match(pageLoader, /enrichBrotherhoodOutingImages/)
  assert.match(pageLoader, /imagen:\s*\{[\s\S]*src: image\.hero_image_path/)
  assert.match(image, /outing\?\.imagen\?\.src/)
  assert.match(image, /src=\{outing\.imagen\.src\}/)
  assert.match(image, /alt=\{outing\.imagen\.alt \|\| `Fotografía de \$\{outing\.nombre\}`\}/)
  assert.match(image, /Fotografía · \{outing\.imagen\.credito\}/)
})

test('una fotografía rota se sustituye por un fallback visual controlado', () => {
  assert.match(image, /onError=\{\(\) => setFailed\(true\)\}/)
  assert.match(image, /failed/)
  assert.match(image, /OutingImageFallback/)
})
