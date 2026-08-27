import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { mapEditorialCuriosities } from '../lib/brotherhood-editorial-content.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const brotherhoodPage = read('lib/supabase/brotherhood-page.js')
const editorialLoader = read('lib/supabase/brotherhood-editorial-sections.js')
const directUploader = read('components/panel/DirectImageUpload.js')
const bandActions = read('app/panel/(protected)/bandas/[id]/multimedia/actions.js')
const bandPage = read('app/panel/(protected)/bandas/[id]/multimedia/page.js')
const outingActions = read('app/panel/(protected)/hermandades/[id]/salidas/actions.js')
const outingHeroActions = read('app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions.js')
const outingPage = read('app/panel/(protected)/hermandades/[id]/salidas/page.js')

test('las Curiosidades de Hermandad proceden del Banco editorial publicado y relacionado', () => {
  assert.match(brotherhoodPage, /enrichBrotherhoodEditorialSections/)
  assert.match(editorialLoader, /createPublicClient/)
  assert.match(editorialLoader, /from\('editorial_content_links'\)/)
  assert.match(editorialLoader, /\.eq\('entity_id', brotherhood\.id\)/)
  assert.match(editorialLoader, /from\('editorial_content'\)/)
  assert.match(editorialLoader, /\.eq\('content_type', 'curiosity'\)/)
  assert.match(editorialLoader, /\.eq\('status', 'published'\)/)
  assert.match(editorialLoader, /curiosidades: \[\]/)
})

test('el mapeo editorial conserva solo Curiosidades documentadas y prioriza el vínculo principal', () => {
  const mapped = mapEditorialCuriosities([
    { id: 'a', content_type: 'curiosity', title: 'Secundaria', summary: 'Texto A', publish_date: '2026-08-27' },
    { id: 'b', content_type: 'curiosity', title: 'Principal', body: 'Texto B', publish_date: '2026-08-20' },
    { id: 'c', content_type: 'fact', title: 'Dato', summary: 'No debe entrar' },
    { id: 'd', content_type: 'curiosity', title: 'Sin texto', summary: '' },
  ], [
    { editorial_content_id: 'a', relation_type: 'related', is_primary: false },
    { editorial_content_id: 'b', relation_type: 'about', is_primary: true },
  ])

  assert.deepEqual(mapped.map((item) => item.id), ['b', 'a'])
  assert.equal(mapped[0].texto, 'Texto B')
  assert.equal(mapped[0].principal, true)
  assert.equal(mapped[1].categoria, 'Curiosidad documentada')
})

test('el uploader común envía los bytes directamente del navegador a Supabase Storage', () => {
  assert.match(directUploader, /createBrowserSupabaseClient/)
  assert.match(directUploader, /uploadToSignedUrl/)
  assert.match(directUploader, /file_name/)
  assert.match(directUploader, /file_type/)
  assert.match(directUploader, /file_size/)
  assert.doesNotMatch(directUploader, /name="file"/)
})

test('Multimedia de Bandas usa permiso firmado y no recibe File en Server Actions', () => {
  assert.match(bandPage, /BandDirectImageUpload/)
  assert.match(bandActions, /createSignedUploadUrl/)
  assert.match(bandActions, /assertStoredImageUpload/)
  assert.match(bandActions, /upload_mode: 'signed_direct'/)
  assert.doesNotMatch(bandActions, /formData\.get\('file'\)/)
  assert.doesNotMatch(bandActions, /instanceof File/)
  assert.doesNotMatch(bandActions, /\.storage\.from\(BUCKET\)\.upload\(/)
  assert.doesNotMatch(bandPage, /encType="multipart\/form-data"/)
})

test('las fotografías de Salidas usan subida firmada y el CRUD principal ya no transporta bytes', () => {
  assert.match(outingPage, /OutingDirectImageUpload/)
  assert.doesNotMatch(outingPage, /uploadOutingHeroImageAction/)
  assert.match(outingHeroActions, /createSignedUploadUrl/)
  assert.match(outingHeroActions, /assertStoredImageUpload/)
  assert.match(outingHeroActions, /upload_mode: 'signed_direct'/)
  assert.doesNotMatch(outingHeroActions, /formData\.get\('file'\)/)
  assert.doesNotMatch(outingHeroActions, /instanceof File/)
  assert.doesNotMatch(outingActions, /uploadOutingHeroImageAction/)
  assert.doesNotMatch(outingActions, /formData\.get\('file'\)/)
  assert.doesNotMatch(outingActions, /instanceof File/)
})
