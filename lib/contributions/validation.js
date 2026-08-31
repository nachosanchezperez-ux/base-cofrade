import {
  CONTRIBUTION_ATTACHMENT_TYPES,
  CONTRIBUTION_LIMITS,
  CONTRIBUTION_PHOTO_TYPES,
  CONTRIBUTION_TYPES,
} from './config.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u
const HTML_PATTERN = /<\/?[a-z][^>]*>/iu
const CONTROL_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u

export class ContributionValidationError extends Error {}

function rawValue(formData, name) {
  return String(formData.get(name) || '')
}

function normalizedText(formData, name, { required = false, min = 0, max, label }) {
  const value = rawValue(formData, name).normalize('NFC').replace(/\r\n?/g, '\n').trim()
  if (required && !value) throw new ContributionValidationError(`${label} es obligatorio.`)
  if (value && value.length < min) {
    throw new ContributionValidationError(`${label} necesita algo más de detalle.`)
  }
  if (value.length > max) {
    throw new ContributionValidationError(`${label} supera el límite de ${max.toLocaleString('es-ES')} caracteres.`)
  }
  if (CONTROL_PATTERN.test(value)) throw new ContributionValidationError(`${label} contiene caracteres no admitidos.`)
  if (HTML_PATTERN.test(value)) throw new ContributionValidationError(`${label} debe enviarse como texto, sin HTML.`)
  return value
}

function normalizedUrl(value, label) {
  if (value.length > CONTRIBUTION_LIMITS.url) {
    throw new ContributionValidationError(`${label} es demasiado larga.`)
  }

  let url
  try {
    url = new URL(value)
  } catch {
    throw new ContributionValidationError(`${label} no es válida.`)
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new ContributionValidationError(`${label} debe ser una dirección pública HTTP o HTTPS.`)
  }
  url.hash = ''
  return url.toString()
}

function sourceUrls(formData) {
  const candidates = rawValue(formData, 'sources')
    .normalize('NFC')
    .split(/\r?\n/u)
    .map((item) => item.trim())
    .filter(Boolean)

  if (candidates.length > CONTRIBUTION_LIMITS.sources) {
    throw new ContributionValidationError(`Puedes incluir hasta ${CONTRIBUTION_LIMITS.sources} fuentes o documentos enlazados.`)
  }

  return [...new Set(candidates.map((item, index) => normalizedUrl(item, `La fuente ${index + 1}`)))]
}

function attachmentFiles(formData) {
  const attachments = formData
    .getAll('attachments')
    .filter((file) => file && typeof file.arrayBuffer === 'function' && file.size > 0)

  if (attachments.length > CONTRIBUTION_LIMITS.attachments) {
    throw new ContributionValidationError(`Puedes adjuntar hasta ${CONTRIBUTION_LIMITS.attachments} archivos.`)
  }

  let totalBytes = 0
  for (const attachment of attachments) {
    if (!CONTRIBUTION_ATTACHMENT_TYPES.has(attachment.type)) {
      throw new ContributionValidationError('Los archivos deben ser JPG, PNG, WebP o PDF.')
    }
    if (attachment.size > CONTRIBUTION_LIMITS.attachmentBytes) {
      throw new ContributionValidationError('Cada archivo puede ocupar como máximo 8 MB.')
    }
    totalBytes += attachment.size
  }
  if (totalBytes > CONTRIBUTION_LIMITS.totalAttachmentBytes) {
    throw new ContributionValidationError('Los archivos pueden ocupar como máximo 10 MB en total.')
  }
  return attachments
}

export function parseContributionForm(formData) {
  const contributionType = rawValue(formData, 'contribution_type').trim()
  if (!CONTRIBUTION_TYPES.has(contributionType)) {
    throw new ContributionValidationError('Selecciona qué tipo de aportación quieres enviar.')
  }

  const title = normalizedText(formData, 'title', {
    required: true,
    min: 5,
    max: CONTRIBUTION_LIMITS.title,
    label: 'El título',
  })
  const description = normalizedText(formData, 'description', {
    required: true,
    min: 30,
    max: CONTRIBUTION_LIMITS.description,
    label: 'La explicación',
  })
  const pageUrlValue = rawValue(formData, 'page_url').trim()
  const pageUrl = pageUrlValue ? normalizedUrl(pageUrlValue, 'La URL relacionada') : null
  const sources = sourceUrls(formData)
  const contactName = normalizedText(formData, 'contact_name', {
    max: CONTRIBUTION_LIMITS.contactName,
    label: 'El nombre',
  })
  const contactEmail = rawValue(formData, 'contact_email').normalize('NFC').trim().toLowerCase()
  const photoCredit = normalizedText(formData, 'photo_credit', {
    max: CONTRIBUTION_LIMITS.photoCredit,
    label: 'El crédito fotográfico',
  })
  const photoAltText = normalizedText(formData, 'photo_alt_text', {
    max: CONTRIBUTION_LIMITS.photoAltText,
    label: 'El texto alternativo',
  })
  const attachments = attachmentFiles(formData)
  const hasPhotos = attachments.some((file) => CONTRIBUTION_PHOTO_TYPES.has(file.type))

  if (contactEmail && (
    contactEmail.length > CONTRIBUTION_LIMITS.contactEmail
    || !EMAIL_PATTERN.test(contactEmail)
  )) {
    throw new ContributionValidationError('El correo de contacto no es válido.')
  }
  if (contributionType === 'correction' && !pageUrl) {
    throw new ContributionValidationError('Indica la URL exacta de la ficha que quieres corregir.')
  }
  if (contributionType === 'new_record' && !attachments.length && !sources.length) {
    throw new ContributionValidationError('Añade al menos una fuente pública o un archivo que permita contrastar la información.')
  }
  if (contributionType === 'media' && !attachments.length && !sources.length) {
    throw new ContributionValidationError('Adjunta un archivo o enlaza el documento que quieres aportar.')
  }
  if (hasPhotos && !photoCredit) {
    throw new ContributionValidationError('Indica la autoría o el crédito de las fotografías.')
  }
  if (hasPhotos && !formData.has('rights_confirmed')) {
    throw new ContributionValidationError('Confirma que puedes aportar esas fotografías para su revisión y posible publicación.')
  }
  if (!formData.has('privacy_consent')) {
    throw new ContributionValidationError('Debes aceptar el tratamiento de los datos para enviar la aportación.')
  }

  return {
    contributionType,
    title,
    description,
    pageUrl,
    sources,
    contactName: contactName || null,
    contactEmail: contactEmail || null,
    photoCredit: photoCredit || null,
    photoAltText: photoAltText || null,
    rightsConfirmed: hasPhotos ? true : formData.has('rights_confirmed'),
    attachments,
  }
}

export function hasHoneypotValue(formData) {
  return Boolean(rawValue(formData, 'website').trim())
}
