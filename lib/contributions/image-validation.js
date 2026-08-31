import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { CONTRIBUTION_LIMITS } from './config.js'
import { ContributionValidationError } from './validation.js'

function detectedImage(buffer) {
  if (buffer.length >= 10 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg', format: 'jpeg' }
  }
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mimeType: 'image/png', extension: 'png', format: 'png' }
  }
  if (buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { mimeType: 'image/webp', extension: 'webp', format: 'webp' }
  }
  return null
}

function safeOriginalName(name) {
  const value = String(name || 'fotografia')
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f/\\]/gu, '_')
    .trim()
  return (value || 'fotografia').slice(0, 180)
}

async function sanitizedImage(buffer, detected) {
  const input = sharp(buffer, {
    failOn: 'error',
    limitInputPixels: CONTRIBUTION_LIMITS.imagePixels,
    sequentialRead: true,
  })
  const metadata = await input.metadata()
  if (
    metadata.format !== detected.format
    || !metadata.width
    || !metadata.height
    || (metadata.pages || 1) !== 1
  ) {
    throw new ContributionValidationError('Una fotografía no contiene una imagen estática válida.')
  }

  const rotated = input.rotate()
  let output
  if (detected.format === 'jpeg') output = rotated.jpeg({ quality: 88, progressive: true, mozjpeg: true })
  if (detected.format === 'png') output = rotated.png({ compressionLevel: 9, adaptiveFiltering: true })
  if (detected.format === 'webp') output = rotated.webp({ quality: 88, smartSubsample: true })
  const { data, info } = await output.toBuffer({ resolveWithObject: true })

  if (
    !info.width
    || !info.height
    || info.width > CONTRIBUTION_LIMITS.imageSide
    || info.height > CONTRIBUTION_LIMITS.imageSide
    || info.width * info.height > CONTRIBUTION_LIMITS.imagePixels
  ) {
    throw new ContributionValidationError('Una fotografía tiene dimensiones excesivas o no válidas.')
  }
  if (data.byteLength > CONTRIBUTION_LIMITS.photoBytes) {
    throw new ContributionValidationError('Una fotografía supera 5 MB después de retirar sus metadatos.')
  }
  return { data, width: info.width, height: info.height }
}

export async function validateContributionPhoto(file) {
  const originalBuffer = Buffer.from(await file.arrayBuffer())
  if (!originalBuffer.length || originalBuffer.length > CONTRIBUTION_LIMITS.photoBytes) {
    throw new ContributionValidationError('Cada fotografía puede ocupar como máximo 5 MB.')
  }

  const detected = detectedImage(originalBuffer)
  if (!detected) {
    throw new ContributionValidationError('Una fotografía no contiene una imagen JPG, PNG o WebP válida.')
  }
  if (detected.mimeType !== file.type) {
    throw new ContributionValidationError('El contenido real de una fotografía no coincide con su formato declarado.')
  }

  let sanitized
  try {
    sanitized = await sanitizedImage(originalBuffer, detected)
  } catch (error) {
    if (error instanceof ContributionValidationError) throw error
    throw new ContributionValidationError('Una fotografía está dañada o usa una codificación no admitida.')
  }

  return {
    buffer: sanitized.data,
    originalName: safeOriginalName(file.name),
    declaredMimeType: file.type,
    verifiedMimeType: detected.mimeType,
    extension: detected.extension,
    byteSize: sanitized.data.byteLength,
    width: sanitized.width,
    height: sanitized.height,
    sha256: createHash('sha256').update(sanitized.data).digest('hex'),
  }
}

