import assert from 'node:assert/strict'
import test from 'node:test'
import sharp from 'sharp'
import { validateContributionAttachment } from '../lib/contributions/attachment-validation.js'
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

test('una propuesta de información nueva exige al menos una fuente o un archivo', () => {
  assert.throws(
    () => parseContributionForm(validForm({ contribution_type: 'new_record', sources: '' })),
    /fuente pública|archivo/i,
  )

  const documented = parseContributionForm(validForm({
    contribution_type: 'new_record',
    sources: 'https://example.com/fuente-oficial',
  }))
  assert.deepEqual(documented.sources, ['https://example.com/fuente-oficial'])

  const withFile = validForm({ contribution_type: 'new_record', sources: '' })
  withFile.set('attachments', new File([
    '%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\nstartxref\n0\n%%EOF',
  ], 'documento.pdf', { type: 'application/pdf' }))
  assert.equal(parseContributionForm(withFile).attachments.length, 1)
})

test('admite PDF como adjunto y conserva los documentos enlazados', async () => {
  const form = validForm({ contribution_type: 'media' })
  const pdf = new File(['%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\nstartxref\n0\n%%EOF'], 'documento.pdf', { type: 'application/pdf' })
  form.set('attachments', pdf)
  const parsed = parseContributionForm(form)
  assert.equal(parsed.attachments.length, 1)
  const verified = await validateContributionAttachment(pdf)
  assert.equal(verified.verifiedMimeType, 'application/pdf')
  assert.equal(verified.kind, 'document')
  assert.equal(verified.width, null)

  const linked = parseContributionForm(validForm({
    contribution_type: 'media',
    sources: 'https://example.com/documento.pdf',
  }))
  assert.equal(linked.attachments.length, 0)
  assert.deepEqual(linked.sources, ['https://example.com/documento.pdf'])
})

test('rechaza PDF falsos, cifrados o con contenido activo', async () => {
  const fake = new File(['contenido arbitrario'], 'falso.pdf', { type: 'application/pdf' })
  await assert.rejects(() => validateContributionAttachment(fake), /estructura reconocible/i)

  const active = new File(['%PDF-1.7\n/JavaScript /OpenAction\n%%EOF'], 'activo.pdf', { type: 'application/pdf' })
  await assert.rejects(() => validateContributionAttachment(active), /contenido activo/i)

  const disguised = new File(['%PDF-1.7\n%%EOF'], 'documento.jpg', { type: 'application/pdf' })
  await assert.rejects(() => validateContributionAttachment(disguised), /terminar en \.pdf/i)
})

test('limita el número y el peso acumulado de los adjuntos', () => {
  const tooMany = validForm()
  for (let index = 0; index < 4; index += 1) {
    tooMany.append('attachments', new File(['x'], `foto-${index}.jpg`, { type: 'image/jpeg' }))
  }
  assert.throws(() => parseContributionForm(tooMany), /hasta 3 archivos/i)

  const tooHeavy = validForm()
  tooHeavy.append('attachments', new File([Buffer.alloc(6 * 1024 * 1024)], 'uno.pdf', { type: 'application/pdf' }))
  tooHeavy.append('attachments', new File([Buffer.alloc(5 * 1024 * 1024)], 'dos.pdf', { type: 'application/pdf' }))
  assert.throws(() => parseContributionForm(tooHeavy), /10 MB en total/i)
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

test('solo exige crédito y derechos cuando hay una imagen adjunta', async () => {
  const source = await sharp({
    create: { width: 10, height: 10, channels: 3, background: '#0f2742' },
  }).jpeg().toBuffer()
  const form = validForm()
  form.set('attachments', new File([source], 'foto.jpg', { type: 'image/jpeg' }))
  assert.throws(() => parseContributionForm(form), /autoría|crédito/i)
  form.set('photo_credit', 'Autor de prueba')
  form.set('rights_confirmed', 'on')
  assert.equal(parseContributionForm(form).attachments.length, 1)
})

test('rechaza una firma falsa aunque el navegador declare un MIME permitido', async () => {
  const fake = new File([Buffer.from('contenido arbitrario')], 'falsa.png', { type: 'image/png' })
  await assert.rejects(() => validateContributionPhoto(fake), /no contiene una imagen/i)
})
