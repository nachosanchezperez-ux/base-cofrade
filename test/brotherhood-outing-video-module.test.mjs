import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const loader = fs.readFileSync(new URL('../lib/supabase/brotherhoods.js', import.meta.url), 'utf8')
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
