import { normalizeMusicChangeText } from './music-changes.js'

const TECHNICAL_SNAPSHOT_MARKERS = [
  'instantanea',
  'vigente en 2026',
  'vigencia cerrada',
  'periodo acotado',
  'documentado para 2026',
  'registro historico de una salida concreta',
  'no presupone continuidad',
  'inicio no documentado',
  'inicio no precisado',
]

function explicitStartYear(period = {}) {
  const source = normalizeMusicChangeText([
    period.dateFromText,
    period.date_from_text,
    period.notes,
  ].filter(Boolean).join(' '))

  const patterns = [
    /desde (19\d{2}|20\d{2})/,
    /iniciad[oa] en (19\d{2}|20\d{2})/,
    /comenzo en (19\d{2}|20\d{2})/,
    /inicio (?:de la relacion )?en (19\d{2}|20\d{2})/,
    /se estreno[^.]{0,40} en (19\d{2}|20\d{2})/,
    /incorporacion[^.]{0,40} en (19\d{2}|20\d{2})/,
  ]

  for (const pattern of patterns) {
    const match = source.match(pattern)
    if (match) return Number(match[1])
  }

  return null
}

export function documentedMusicStartYear(period = {}, { snapshotYear = 2026 } = {}) {
  const explicit = explicitStartYear(period)
  if (explicit) return explicit

  const value = Number(period.yearFrom ?? period.year_from ?? 0)
  if (!Number.isInteger(value) || value < 1900) return null

  const context = normalizeMusicChangeText([
    period.dateFromText,
    period.date_from_text,
    period.notes,
  ].filter(Boolean).join(' '))

  if (
    value === snapshotYear
    && TECHNICAL_SNAPSHOT_MARKERS.some((marker) => context.includes(marker))
  ) return null

  return value
}

export function musicStartLabel(period = {}, options = {}) {
  const year = documentedMusicStartYear(period, options)
  return year ? `Desde ${year}` : ''
}
