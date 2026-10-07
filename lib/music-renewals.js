import {
  canonicalSemanaSantaDay,
  normalizeMusicChangeText,
  sortMusicChanges,
} from '@/lib/music-changes'

const NUMBER_WORDS = {
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
}

function renewalDurationCoversYear(notes = '', targetYear = 2027) {
  const normalized = normalizeMusicChangeText(notes)
  const durationMatch = normalized.match(/renov\w*[^.]{0,80}?por (dos|tres|cuatro|cinco|seis|\d+) anos/)
  const startMatch = normalized.match(/(?:en|desde) (20\d{2})/)
  if (!durationMatch || !startMatch) return false

  const duration = Number(durationMatch[1]) || NUMBER_WORDS[durationMatch[1]] || 0
  const startYear = Number(startMatch[1])
  return duration > 0 && targetYear >= startYear && targetYear <= startYear + duration - 1
}

export function isExplicitMusicRenewalForYear(period = {}, year = 2027) {
  const notes = String(period.notes || '')
  const normalized = normalizeMusicChangeText(notes)
  if (!normalized.includes('renov')) return false

  const day = canonicalSemanaSantaDay(period.day || period.outingType)
  if (!day) return false

  if (period.province !== 'Sevilla' && period.municipality !== 'Sevilla') return false

  if (period.yearFrom && period.yearFrom > year) return false
  if (period.yearTo && period.yearTo < year) return false

  return (
    normalized.includes(String(year))
    || Number(period.yearTo) >= year
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
      day: canonicalSemanaSantaDay(period.day || period.outingType) || period.day || period.outingType || 'Semana Santa',
      scope: period.municipality === 'Sevilla' ? 'capital' : 'province',
      newBandName: period.bandName,
      newBandDisplayName: period.bandName,
      newBandHref: period.bandHref,
      newBandType: period.bandType,
      renewalLabel: musicRenewalLabel(period, year),
    }))

  return sortMusicChanges(renewals)
}
