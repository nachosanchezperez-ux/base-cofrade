import { createHash } from 'node:crypto'
import { CONTRIBUTION_LIMITS, CONTRIBUTION_PHOTO_TYPES } from './config.js'
import { validateContributionPhoto } from './image-validation.js'
import { ContributionValidationError } from './validation.js'
import { validatePdfStructure } from './pdf-validation.js'

function safeOriginalName(name, fallback = 'archivo') {
  const value = String(name || fallback)
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f/\\]/gu, '_')
    .trim()
  return (value || fallback).slice(0, 180)
}

async function validateContributionPdf(file) {
  if (file.type !== 'application/pdf') {
    throw new ContributionValidationError('El formato declarado del documento no es PDF.')
  }
  if (!/\.pdf$/iu.test(String(file.name || ''))) {
    throw new ContributionValidationError('El nombre del documento debe terminar en .pdf.')
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  if (!buffer.length || buffer.length > CONTRIBUTION_LIMITS.attachmentBytes) {
    throw new ContributionValidationError('Cada archivo puede ocupar como máximo 8 MB.')
  }
  await validatePdfStructure(buffer)
  return {
    buffer,
    kind: 'document',
    originalName: safeOriginalName(file.name, 'documento.pdf'),
    declaredMimeType: file.type,
    verifiedMimeType: 'application/pdf',
    extension: 'pdf',
    byteSize: buffer.byteLength,
    width: null,
    height: null,
    sha256: createHash('sha256').update(buffer).digest('hex'),
  }
}

export async function validateContributionAttachment(file) {
  if (CONTRIBUTION_PHOTO_TYPES.has(file.type)) {
    return { ...(await validateContributionPhoto(file)), kind: 'image' }
  }
  if (file.type === 'application/pdf') return validateContributionPdf(file)
  throw new ContributionValidationError('Los archivos deben ser JPG, PNG, WebP o PDF.')
}
