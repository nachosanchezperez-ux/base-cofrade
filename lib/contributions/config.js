export const CONTRIBUTION_TYPES = new Set([
  'correction',
  'new_record',
  'media',
  'suggestion',
])

export const CONTRIBUTION_LIMITS = Object.freeze({
  title: 140,
  description: 6000,
  contactName: 120,
  contactEmail: 254,
  photoCredit: 180,
  photoAltText: 300,
  url: 2048,
  sources: 8,
  attachments: 3,
  attachmentBytes: 8 * 1024 * 1024,
  totalAttachmentBytes: 10 * 1024 * 1024,
  photoBytes: 8 * 1024 * 1024,
  imagePixels: 50_000_000,
  imageSide: 12_000,
})

export const CONTRIBUTION_PHOTO_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export const CONTRIBUTION_ATTACHMENT_TYPES = new Set([
  ...CONTRIBUTION_PHOTO_TYPES,
  'application/pdf',
])

export const CONTRIBUTION_PRIVACY_VERSION = 'public-contributions-2026-08-31'
export const CONTRIBUTION_BUCKET = 'hilo-contributions-quarantine'
export const CONTRIBUTION_TURNSTILE_ACTION = 'public_contribution'
