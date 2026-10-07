import { canonicalSemanaSantaDay, normalizeMusicChangeText, SEMANA_SANTA_DAYS } from './music-changes.js'

// These are reviewed editorial seasons, not a projection that advances on January 1.
export const MUSIC_ACCOMPANIMENT_SEASONS = [2026, 2027]
const BASE_SEASON = 2026
const DAY_OFFSETS = [-9, -8, -7, -6, -5, -4, -3, -2, -2, -1, 0]
const GENERIC_PENANCE = new Set([
  'estacion de penitencia', 'station of penance', 'acompanamiento de la estacion de penitencia',
])
const compare = (a = '', b = '') => a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true })
const normalize = (value) => normalizeMusicChangeText(value || '')

function numericYear(value) {
  if (value === null || value === undefined || value === '') return null
  const year = Number(value)
  return Number.isInteger(year) && year >= 1000 && year <= 9999 ? year : null
}

function exactDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? value : ''
}

// Gregorian computus, in UTC so the same period has the same result in every locale.
function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(Date.UTC(year, month - 1, day))
}

function seasonWindow(year, day) {
  const easter = easterSunday(year)
  const index = SEMANA_SANTA_DAYS.findIndex((item) => item.label === day)
  const dateAt = (offset) => new Date(easter.getTime() + offset * 86400000).toISOString().slice(0, 10)
  return index >= 0
    ? { from: dateAt(DAY_OFFSETS[index]), to: dateAt(DAY_OFFSETS[index]) }
    : { from: dateAt(-9), to: dateAt(0) }
}

function holyWeekDay(period) {
  const outing = normalize(period.outingType)
  if (/\b(rosario|traslado|concierto|ensayo|romeria|gloria|extraordinaria|extraordinario|corpus|eucaristica)\b/.test(outing)) return ''
  const day = canonicalSemanaSantaDay(period.outingType)
  const dayName = normalize(day)
  if (day && (outing === dayName || outing.startsWith(`${dayName} `)
    || (day === 'Madrugá' && /^madrugada(?: |$)/.test(outing)))) return day
  if (GENERIC_PENANCE.has(outing)) return canonicalSemanaSantaDay(period.day) || 'Semana Santa'
  return ''
}

/** 'counted' | 'pending' | 'excluded'; no dates or continuity are inferred from notes. */
export function musicAccompanimentSeasonState(period, requestedYear = BASE_SEASON) {
  const year = Number(requestedYear)
  if (!MUSIC_ACCOMPANIMENT_SEASONS.includes(year)) return 'excluded'
  const day = holyWeekDay(period)
  if (!day) return 'excluded'
  const window = seasonWindow(year, day)
  const fromDate = exactDate(period.dateFrom)
  const toDate = exactDate(period.dateTo)
  const fromYear = fromDate ? Number(fromDate.slice(0, 4)) : numericYear(period.yearFrom)
  const toYear = toDate ? Number(toDate.slice(0, 4)) : numericYear(period.yearTo)
  if ((fromDate && fromDate > window.to) || (toDate && toDate < window.from)) return 'excluded'
  if ((fromYear && fromYear > year) || (toYear && toYear < year)) return 'excluded'
  if (fromYear && toYear && fromYear > toYear) return 'excluded'
  if (fromDate && toDate && fromDate > toDate) return 'excluded'
  // Future announcements often have isCurrent=false: their explicit year still counts.
  if (toYear || fromYear === year) return 'counted'
  if (!period.isCurrent) return 'excluded'
  return year === BASE_SEASON ? 'counted' : 'pending'
}

function territory(period) {
  const province = normalize(period.province)
  const municipality = normalize(period.municipality)
  const slug = normalize(period.municipalitySlug)
  if (province && province !== 'sevilla') return 'outside'
  if (municipality === 'sevilla' || slug === 'sevilla') return 'capital'
  if (province === 'sevilla' && municipality) return 'province'
  return 'unknown'
}

export function musicAccompanimentBandType(value = '') {
  const type = normalize(value)
  if (type.includes('agrupacion musical')) return { key: 'agrupacion', label: 'Agrupación musical' }
  if (type.includes('cornetas')) return { key: 'cornetas', label: 'Cornetas y tambores' }
  if (type === 'banda de musica') return { key: 'musica', label: 'Banda de música' }
  if (type.includes('capilla')) return { key: 'capilla', label: 'Música de capilla' }
  if (type === 'escolania') return { key: 'escolania', label: 'Escolanía' }
  if (!type) return { key: 'sin-tipo', label: 'Tipo sin especificar' }
  return { key: type.replaceAll(' ', '-'), label: value }
}

export function musicAccompanimentBandMatchesQuery(band, query = '') {
  const needle = normalize(query)
  // Public slugs retain familiar names such as Las Cigarreras alongside the formal name.
  return !needle || normalize(`${band.name || ''} ${band.href || ''}`).includes(needle)
}

function positionIdentity(period) {
  const position = normalize(period.position)
  const step = normalize(period.stepName)
  const cross = `${position} ${step}`.includes('cruz de guia')
  const direction = cross ? 'cruz-guia'
    : /^(delante|ante|abriendo)\b/.test(position) ? 'delante'
      : /^(tras|detras)\b/.test(position) ? 'tras' : ''
  // Keep participation contexts distinct, while merging descriptions of the same step.
  const explicitContext = String(period.position || '').match(/(?:[·—–]|\s-\s|\()\s*(.+)$/)?.[1]
  const context = normalize(explicitContext)
    || position.match(/\b(tramo|regreso|ida|vuelta|parte|inicio|final|salida|recogida|interior|exterior|hasta|desde|juvenil|seccion|trio|cuarteto|capilla|compartid\w*|altern\w*|traslado)\b.*$/)?.[0] || ''
  const moment = normalize(period.outingType).match(/\b(manana|tarde|noche)\b.*$/)?.[0] || ''
  const generic = /^(tras|detras de|detras del|delante de|delante del|delante) (el )?paso$/.test(position)
    || !position
  const stepKey = cross ? 'cruz-guia'
    : period.stepEntityId ? `step:${period.stepEntityId}`
      : step ? `name:${step}`
        : generic ? '' : `position:${position}`
  return { stepKey, direction, context, moment, generic }
}

function deduplicate(periods) {
  const groups = new Map()
  for (const period of periods) {
    const key = JSON.stringify([period.bandEntityId, period.brotherhoodEntityId, period.day])
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ ...period, identity: positionIdentity(period) })
  }
  const unique = []
  for (const group of groups.values()) {
    // A public snapshot and an identified step may describe the same accompaniment.
    for (const period of group) {
      if (period.stepEntityId || !normalize(period.stepName)) continue
      const candidates = [...new Set(group.filter((candidate) => candidate.stepEntityId
        && normalize(candidate.stepName) === normalize(period.stepName)
        && candidate.identity.direction === period.identity.direction
        && candidate.identity.context === period.identity.context
        && candidate.identity.moment === period.identity.moment)
        .map((candidate) => candidate.identity.stepKey))]
      if (candidates.length === 1) [period.identity.stepKey] = candidates
    }
    const entries = new Map()
    for (const period of group) {
      const { direction, context, moment, generic } = period.identity
      let { stepKey } = period.identity
      // A generic snapshot may be resolved only when there is one unambiguous step.
      if (!stepKey && generic) {
        const candidates = [...new Set(group
          .filter((candidate) => candidate.identity.stepKey
            && candidate.identity.direction === direction
            && candidate.identity.context === context
            && candidate.identity.moment === moment)
          .map((candidate) => candidate.identity.stepKey))]
        if (candidates.length === 1) [stepKey] = candidates
      }
      const key = JSON.stringify([stepKey || 'unspecified', direction || normalize(period.position), context, moment])
      const old = entries.get(key)
      const richness = (item) => Number(Boolean(item.stepEntityId)) * 4 + Number(Boolean(item.stepName)) * 2 + Number(Boolean(item.brotherhoodHref))
      if (!old) entries.set(key, period)
      else {
        const best = richness(period) > richness(old) ? period : old
        entries.set(key, { ...best, state: old.state === 'counted' || period.state === 'counted' ? 'counted' : 'pending' })
      }
    }
    unique.push(...entries.values())
  }
  return unique
}

function periodLabel(period) {
  const from = exactDate(period.dateFrom) ? Number(period.dateFrom.slice(0, 4)) : numericYear(period.yearFrom)
  const to = exactDate(period.dateTo) ? Number(period.dateTo.slice(0, 4)) : numericYear(period.yearTo)
  if (from && to) return from === to ? String(from) : `${from}–${to}`
  if (to) return `Hasta ${to}`
  if (from) return `Desde ${from}`
  return 'Inicio no documentado'
}

function sortItems(items) {
  return items.sort((a, b) => compare(a.municipality, b.municipality)
    || (SEMANA_SANTA_DAYS.findIndex((day) => day.label === a.day) - SEMANA_SANTA_DAYS.findIndex((day) => day.label === b.day))
    || compare(a.brotherhoodName, b.brotherhoodName) || compare(a.position, b.position))
}

export function buildMusicAccompanimentSummary(periods = [], { year = BASE_SEASON } = {}) {
  const season = MUSIC_ACCOMPANIMENT_SEASONS.includes(Number(year)) ? Number(year) : BASE_SEASON
  const excluded = { unknownTerritory: 0, outsideTerritory: 0, missingIdentity: 0, duplicatePeriods: 0 }
  const eligible = []
  for (const period of periods) {
    const state = musicAccompanimentSeasonState(period, season)
    if (state === 'excluded') continue
    if (!period.bandEntityId || !period.bandName || !period.brotherhoodEntityId || !period.brotherhoodName) {
      excluded.missingIdentity += 1
      continue
    }
    const scope = territory(period)
    if (scope === 'unknown' || scope === 'outside') {
      excluded[scope === 'unknown' ? 'unknownTerritory' : 'outsideTerritory'] += 1
      continue
    }
    eligible.push({ ...period, state, scope, day: holyWeekDay(period) })
  }
  const unique = deduplicate(eligible)
  excluded.duplicatePeriods = eligible.length - unique.length
  const bandsById = new Map()
  for (const period of unique) {
    if (!bandsById.has(period.bandEntityId)) {
      const type = musicAccompanimentBandType(period.bandType)
      bandsById.set(period.bandEntityId, {
        id: period.bandEntityId, name: period.bandName, href: period.bandHref || '',
        type: type.label, typeKey: type.key, capital: 0, province: 0, total: 0,
        items: [], pendingItems: [], pendingCount: 0,
      })
    }
    const band = bandsById.get(period.bandEntityId)
    const item = {
      id: period.id, brotherhoodName: period.brotherhoodName, brotherhoodHref: period.brotherhoodHref || '',
      stepName: period.stepName || period.position || 'Acompañamiento musical', position: period.position || '',
      municipality: period.municipality || 'Sevilla', day: period.day, scope: period.scope,
      periodLabel: periodLabel(period),
    }
    if (period.state === 'pending') {
      band.pendingItems.push(item)
      band.pendingCount += 1
    } else {
      band.items.push(item)
      band[period.scope] += 1
      band.total += 1
    }
  }
  const bands = [...bandsById.values()].sort((a, b) => compare(a.name, b.name))
  for (const band of bands) {
    sortItems(band.items)
    sortItems(band.pendingItems)
  }
  return {
    year: season, isAdvance: season > BASE_SEASON, bands,
    totals: bands.reduce((sum, band) => ({ capital: sum.capital + band.capital, province: sum.province + band.province, total: sum.total + band.total }), { capital: 0, province: 0, total: 0 }),
    bandsCount: bands.filter((band) => band.total > 0).length,
    pendingTotal: bands.reduce((sum, band) => sum + band.pendingCount, 0),
    pendingBandsCount: bands.filter((band) => band.pendingCount > 0).length,
    excluded,
  }
}
