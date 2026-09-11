import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveSocialImageSource } from '../lib/social-image-media.js'

const jpegBytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xdb])
const pngBytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const webpBytes = Uint8Array.from([0x52, 0x49, 0x46, 0x46])

function imageResponse(bytes, contentType, status = 200) {
  return new Response(bytes, {
    status,
    headers: {
      'content-type': contentType,
      'content-length': String(bytes.byteLength),
    },
  })
}

test('prepara JPEG compatibles como data URI para Satori', async () => {
  const source = await resolveSocialImageSource('https://example.com/photo.jpg', {
    fetchImpl: async () => imageResponse(jpegBytes, 'image/jpeg'),
  })

  assert.equal(source, `data:image/jpeg;base64,${Buffer.from(jpegBytes).toString('base64')}`)
})

test('prepara PNG compatibles como data URI para Satori', async () => {
  const source = await resolveSocialImageSource('https://example.com/photo.png', {
    fetchImpl: async () => imageResponse(pngBytes, 'image/png'),
  })

  assert.equal(source, `data:image/png;base64,${Buffer.from(pngBytes).toString('base64')}`)
})

test('descarta WEBP y conserva el fallback visual de la tarjeta', async () => {
  const source = await resolveSocialImageSource('https://example.com/photo.webp', {
    fetchImpl: async () => imageResponse(webpBytes, 'image/webp'),
  })

  assert.equal(source, '')
})

test('descarta respuestas fallidas y contenido con firma inválida', async () => {
  const failed = await resolveSocialImageSource('https://example.com/missing.jpg', {
    fetchImpl: async () => imageResponse(jpegBytes, 'image/jpeg', 404),
  })
  const invalid = await resolveSocialImageSource('https://example.com/not-an-image.jpg', {
    fetchImpl: async () => imageResponse(webpBytes, 'image/jpeg'),
  })

  assert.equal(failed, '')
  assert.equal(invalid, '')
})

test('convierte errores de red en fallback sin propagar la excepción', async () => {
  const source = await resolveSocialImageSource('https://example.com/slow.jpg', {
    fetchImpl: async () => {
      throw new Error('network failure')
    },
  })

  assert.equal(source, '')
})
