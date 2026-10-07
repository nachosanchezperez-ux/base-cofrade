import {
  canonicalSemanaSantaDay,
  normalizeMusicChangeText,
  sortMusicChanges,
} from './music-changes.js'

const NUMBER_WORDS = {
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
}

function renewalDurationCoversYear(notes = '', targetYear = 2027) {
  const normalized = normalizeMusicChangeText(notes)
  const renewalSentence = normalized.match(/renov\w*[^.]{0,120}/)?.[0] || ''
  const durationMatch = renewalSentence.match(/(?:por )?(dos|tres|cuatro|cinco|seis|\d+) anos(?: adicionales)?/)
  const yearMatch = renewalSentence.match(/(20\d{2})/)
  if (!durationMatch || !yearMatch) return false

  const duration = Number(durationMatch[1]) || NUMBER_WORDS[durationMatch[1]] || 0
  const startYear = Number(yearMatch[1])
  return duration > 0 && targetYear >= startYear && targetYear <= startYear + duration - 1
}

function isNonPenitentialContext(period = {}) {
  const outing = normalizeMusicChangeText(period.outingType)
  return [
    'rosario',
    'procesion de gloria',
    'romeria',
    'procesion eucaristica',
    'extraordinaria',
  ].some((needle) => outing.includes(needle))
}

export function isExplicitMusicRenewalForYear(period = {}, year = 2027) {
  const notes = String(period.notes || '')
  const normalized = normalizeMusicChangeText(notes)
  if (!normalized.includes('renov')) return false

  if (isNonPenitentialContext(period)) return false

  const day = canonicalSemanaSantaDay(period.outingType) || canonicalSemanaSantaDay(period.day)
  if (!day) return false

  if (
    normalized.includes('pendiente de confirmacion')
    || normalized.includes('pendiente de revision')
    || normalized.includes('no se infiere continuidad posterior')
  ) return false

  if (period.province !== 'Sevilla' && period.municipality !== 'Sevilla') return false

  if (period.yearFrom && period.yearFrom > year) return false
  if (period.yearTo && period.yearTo < year) return false

  const explicitUntil = Number(normalized.match(/hasta (20\d{2})/)?.[1] || 0)

  return (
    normalized.includes(String(year))
    || Number(period.yearTo) >= year
    || explicitUntil >= year
    || renewalDurationCoversYear(notes, year)
  )
}

export function musicRenewalLabel(period = {}, year = 2027) {
  const normalized = normalizeMusicChangeText(period.notes || '')
  const explicitUntil = normalized.match(/hasta (20\d{2})/)?.[1]
  const untilYear = Number(period.yearTo || explicitUntil || 0)

  if (untilYear > year) return `Renovada hasta ${untilYear}`
  if (untilYear === year) return `Renovada para ${year}`
  return `Continuidad confirmada para ${year}`
}

export function buildMusicRenewals(periods = [], { year = 2027 } = {}) {
  const renewals = periods
    .filter((period) => isExplicitMusicRenewalForYear(period, year))
    .map((period) => ({
      ...period,
      year,
      day: canonicalSemanaSantaDay(period.outingType) || canonicalSemanaSantaDay(period.day) || period.day || period.outingType || 'Semana Santa',
      scope: period.municipality === 'Sevilla' ? 'capital' : 'province',
      newBandName: period.bandName,
      newBandDisplayName: period.bandName,
      newBandHref: period.bandHref,
      newBandType: period.bandType,
      renewalLabel: musicRenewalLabel(period, year),
    }))

  return sortMusicChanges(renewals)
}
