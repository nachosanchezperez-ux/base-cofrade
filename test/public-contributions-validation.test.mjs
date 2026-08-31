import assert from 'node:assert/strict'
import test from 'node:test'
import sharp from 'sharp'
import { validateContributionPhoto } from '../lib/contributions/image-validation.js'
import {
  ContributionValidationError,
  parseContributionForm,
} from '../lib/contributions/validation.js'

function validForm(overrides = {}) {
  const form = new FormData()
  const values = {
    contribution_type: 'suggestion',
    title: 'Mejora de navegación móvil',
    description: 'Propongo mostrar un acceso más claro a las fuentes desde las fichas móviles.',
    page_url: '',
    sources: 'https://example.com/documento\nhttps://example.com/otra-fuente',
    contact_name: '',
    contact_email: '',
    photo_credit: '',
    photo_alt_text: '',
    ...overrides,
  }
  for (const [name, value] of Object.entries(values)) form.set(name, value)
  form.set('privacy_consent', 'on')
  return form
}

test('normaliza la aportación y conserva solo URLs públicas válidas', () => {
  const parsed = parseContributionForm(validForm())
  assert.equal(parsed.contributionType, 'suggestion')
  assert.deepEqual(parsed.sources, [
    'https://example.com/documento',
    'https://example.com/otra-fuente',
  ])
  assert.equal(parsed.contactEmail, null)
})

test('una corrección exige ficha y el texto no admite HTML', () => {
  assert.throws(
    () => parseContributionForm(validForm({ contribution_type: 'correction' })),
    ContributionValidationError,
  )
  assert.throws(
    () => parseContributionForm(validForm({ description: '<script>alert(1)</script> Información suficiente para superar el mínimo.' })),
    /sin HTML/i,
  )
})

test('rechaza documentos como archivo y los permite únicamente como enlace', () => {
  const form = validForm({ contribution_type: 'media' })
  form.set('photos', new File(['%PDF-1.7'], 'documento.pdf', { type: 'application/pdf' }))
  assert.throws(() => parseContributionForm(form), /JPG, PNG o WebP/i)

  const linked = parseContributionForm(validForm({
    contribution_type: 'media',
    sources: 'https://example.com/documento.pdf',
  }))
  assert.equal(linked.photos.length, 0)
  assert.deepEqual(linked.sources, ['https://example.com/documento.pdf'])
})

test('decodifica y recodifica una imagen antes de mandarla a cuarentena', async () => {
  const source = await sharp({
    create: { width: 20, height: 12, channels: 3, background: '#b71f37' },
  }).withMetadata({ exif: { IFD0: { Artist: 'Dato que debe retirarse' } } }).jpeg().toBuffer()
  const result = await validateContributionPhoto(new File([source], '../foto.jpg', { type: 'image/jpeg' }))
  const metadata = await sharp(result.buffer).metadata()

  assert.equal(result.verifiedMimeType, 'image/jpeg')
  assert.equal(result.width, 20)
  assert.equal(result.height, 12)
  assert.equal(result.originalName, '.._foto.jpg')
  assert.equal(metadata.exif, undefined)
  assert.match(result.sha256, /^[0-9a-f]{64}$/)
})

test('rechaza una firma falsa aunque el navegador declare un MIME permitido', async () => {
  const fake = new File([Buffer.from('contenido arbitrario')], 'falsa.png', { type: 'image/png' })
  await assert.rejects(() => validateContributionPhoto(fake), /no contiene una imagen/i)
})

