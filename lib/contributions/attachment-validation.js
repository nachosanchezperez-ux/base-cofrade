import { createHash } from 'node:crypto'
import { CONTRIBUTION_LIMITS, CONTRIBUTION_PHOTO_TYPES } from './config.js'
import { validateContributionPhoto } from './image-validation.js'
import { ContributionValidationError } from './validation.js'

const PDF_HEADER = Buffer.from('%PDF-')
const PDF_EOF = Buffer.from('%%EOF')
const BLOCKED_PDF_FEATURES = [
  /\/JavaScript\b/i,
  /\/JS\b/i,
  /\/OpenAction\b/i,
  /\/Launch\b/i,
  /\/EmbeddedFile\b/i,
  /\/RichMedia\b/i,
  /\/XFA\b/i,
  /\/AcroForm\b/i,
  /\/Encrypt\b/i,
]

function safeOriginalName(name, fallback = 'archivo') {
  const value = String(name || fallback)
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f/\\]/gu, '_')
    .trim()
  return (value || fallback).slice(0, 180)
}

function validatePdfStructure(buffer) {
  const headerOffset = buffer.subarray(0, Math.min(buffer.length, 1024)).indexOf(PDF_HEADER)
  const trailer = buffer.subarray(Math.max(0, buffer.length - 4096))
  if (headerOffset < 0 || trailer.lastIndexOf(PDF_EOF) < 0) {
    throw new ContributionValidationError('Un PDF no contiene una estructura reconocible.')
  }

  const searchable = buffer.toString('latin1')
  if (BLOCKED_PDF_FEATURES.some((pattern) => pattern.test(searchable))) {
    throw new ContributionValidationError('El PDF incluye contenido activo, formularios, archivos incrustados o cifrado no admitido.')
  }
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
  validatePdfStructure(buffer)
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
