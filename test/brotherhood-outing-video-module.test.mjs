import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const loader = fs.readFileSync(new URL('../lib/supabase/brotherhoods.js', import.meta.url), 'utf8')
const pageLoader = fs.readFileSync(new URL('../lib/supabase/brotherhood-page.js', import.meta.url), 'utf8')
const page = fs.readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
const styles = fs.readFileSync(new URL('../app/hermandades/[slug]/outing-video.module.css', import.meta.url), 'utf8')

test('la ficha asocia el vídeo a la salida concreta y no a la cronología', () => {
  assert.match(loader, /from\('outing_media'\)/)
  assert.match(loader, /media_type === 'video'/)
  assert.match(loader, /youtubeVideoId/)
  assert.match(page, /s\.video \? outingVideoStyles\.cardWithVideo/)
  assert.match(page, /Archivo audiovisual/)
})

test('el módulo reproduce YouTube sin autoplay y conserva acceso al canal oficial', () => {
  assert.match(page, /youtube-nocookie\.com\/embed/)
  assert.doesNotMatch(page, /autoplay=1/)
  assert.match(page, /Ver en el canal de la Hermandad/)
  assert.match(styles, /\.frame[\s\S]*aspect-ratio: 16 \/ 9/)
  assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.cardWithVideo/)
})

test('las fotografías subidas desde Salidas llegan a la tarjeta pública de esa salida', () => {
  assert.match(pageLoader, /hero_image_path, hero_image_alt, hero_image_credit/)
  assert.match(pageLoader, /enrichBrotherhoodOutingImages/)
  assert.match(pageLoader, /imagen:\s*\{[\s\S]*src: image\.hero_image_path/)
  assert.match(page, /s\.imagen\?\.src/)
  assert.match(page, /src=\{s\.imagen\.src\}/)
  assert.match(page, /alt=\{s\.imagen\.alt \|\| `Fotografía de \$\{s\.nombre\}`\}/)
  assert.match(page, /Fotografía · \{s\.imagen\.credito\}/)
})
