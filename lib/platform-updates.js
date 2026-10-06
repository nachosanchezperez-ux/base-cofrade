import { selectDiverseHomeThreads } from './home-discovery-diversity.js'

export const PLATFORM_UPDATES_LIMIT = 10

const CATEGORY_LABELS = {
  musical_heritage: 'Patrimonio musical',
  posters: 'Cartelería',
  band_brotherhoods: 'Bandas y hermandades',
  step_personnel: 'Pasos y capataces',
  titularity: 'Titulares',
  brotherhood_steps: 'Pasos',
  discography: 'Discografía',
  image_authorship: 'Autorías',
  step_phases: 'Pasos',
  heritage_interventions: 'Patrimonio',
  heritage_updates: 'Patrimonio',
  march_publications: 'Marchas',
  music_change: 'Cambios musicales',
  musical_repertoire: 'Crucetas musicales',
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function timestamp(value) {
  const parsed = value ? new Date(value).getTime() : NaN
  return Number.isFinite(parsed) ? parsed : NaN
}

function madridDay(value) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(value))
}

export function platformUpdateDateLabel(value, now = new Date()) {
  const date = timestamp(value)
  const current = timestamp(now)
  if (!Number.isFinite(date) || !Number.isFinite(current)) return ''

  const today = madridDay(current)
  const activityDay = madridDay(date)
  if (activityDay === today) return 'Hoy'

  // Subtract a calendar day, not 24 hours: Madrid changes its UTC offset.
  const yesterday = new Date(`${today}T12:00:00Z`)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  if (activityDay === yesterday.toISOString().slice(0, 10)) return 'Ayer'

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short',
    ...(activityDay.slice(0, 4) !== today.slice(0, 4) ? { year: 'numeric' } : {}),
    timeZone: 'Europe/Madrid',
  }).format(new Date(date)).replaceAll('.', '')
}

export function platformUpdateRevisionKey(update) {
  // A display signature, not a security token. Technical timestamps, photos,
  // relative date labels and cache refreshes must not create unread notices.
  // The Marchas batch shrinks as its 48-hour window expires. Its ID already
  // contains the newest Marcha: ageing out older rows is not a new action.
  if (update.activityKind === 'march_publications') return `${update.id}:published`
  const value = JSON.stringify([
    update.id, update.activityKind, update.title, update.summary, update.metric, update.href,
  ])
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619)
  }
  return `${update.id}:${(hash >>> 0).toString(36)}`
}

function internalHref(value) {
  const href = text(value)
  return /^\/(?!\/)[^\\\s]*$/.test(href) ? href : ''
}

function finishUpdate(candidate, now) {
  if (!candidate) return null
  const date = timestamp(candidate.dateTime)
  const nowMs = timestamp(now)
  const href = internalHref(candidate.href)
  if (!candidate.id || !text(candidate.title) || !text(candidate.summary) || !href) return null
  if (!Number.isFinite(date) || !Number.isFinite(nowMs) || date > nowMs) return null

  const update = {
    ...candidate,
    href,
    dateTime: new Date(date).toISOString(),
    dateLabel: platformUpdateDateLabel(date, now),
    categoryLabel: CATEGORY_LABELS[candidate.activityKind] || 'Enciclopedia',
  }
  return { ...update, revisionKey: platformUpdateRevisionKey(update) }
}

function discoveryUpdate(thread) {
  if (!thread || (thread.status && thread.status !== 'published')) return null
  const activityKind = text(thread.activityKind) || String(thread.id || '').split(':').at(-1)
  if (!CATEGORY_LABELS[activityKind] || activityKind === 'music_change' || activityKind === 'musical_repertoire') return null

  const rootType = /^\/hermandades\//.test(thread.href) ? 'brotherhood' : ''
  const root = text(thread.rootEntityId) || String(thread.id || '').split(':')[0]
  return {
    ...thread,
    activityKind,
    activityStatus: thread.activityStatus === 'RELACIONADO' ? 'NUEVA RELACIÓN' : thread.activityStatus,
    dateVerb: activityKind === 'march_publications' ? 'Añadido' : 'Actualizado',
    familyId: thread.familyId || `${rootType || 'entity'}:${root}`,
  }
}

function musicChangeUpdate(change) {
  if (!change?.id || (change.status && change.status !== 'published')) return null
  if (!text(change.newBandName) || !text(change.brotherhoodName)) return null
  const year = Number(change.year)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null

  const brotherhood = text(change.brotherhoodName)
  const step = text(change.stepName) || text(change.position)
  const day = text(change.day) || 'Semana Santa'
  const oldBand = text(change.previousBandDisplayName) || text(change.previousBandName)
  const band = text(change.newBandDisplayName) || text(change.newBandName)
  const location = text(change.municipality)
  const edition = `${day} de ${year}`
  const family = change.brotherhoodEntityId || change.brotherhoodSlug || `${brotherhood}:${location}`

  return {
    id: `music-change:${change.id}`,
    activityKind: 'music_change',
    activityStatus: 'NUEVO',
    title: location ? `Cambio musical en ${location}` : `Cambio musical · ${brotherhood}`,
    label: 'Hermandad → acompañamiento musical',
    summary: oldBand
      ? `${band} sustituye a ${oldBand}. ${[step, brotherhood, edition].filter(Boolean).join(' · ')}.`
      : `${band} se incorpora al acompañamiento. ${[step, brotherhood, edition].filter(Boolean).join(' · ')}.`,
    metric: [brotherhood, `${day} ${year}`].join(' · '),
    href: `/semana-santa/${year}/cambios-musicales#cambio-${change.id}`,
    cta: 'Ver el cambio →',
    path: ['Hermandad', 'Paso', 'Banda'],
    dateTime: change.createdAt,
    dateVerb: 'Añadido',
    familyId: `brotherhood:${family}`,
    // One notice for the incoming period, never another for the outgoing one.
    dedupeKey: JSON.stringify(['music_change', year, family, change.stepEntityId || step, change.position || '', day]),
  }
}

function repertoireUpdate(repertoire) {
  if (!repertoire?.id || repertoire.status !== 'published' || !text(repertoire.slug)) return null
  if (!text(repertoire.bandName) || !text(repertoire.displayTitle)) return null
  return {
    id: `musical-repertoire:${repertoire.id}`,
    activityKind: 'musical_repertoire',
    activityStatus: 'NUEVO',
    title: repertoire.displayTitle,
    label: 'Cruceta → repertorio interpretado',
    summary: `Ya puedes consultar la cruceta de ${repertoire.bandName} para ${repertoire.displayTitle}, con las marchas interpretadas y sus relaciones.`,
    metric: repertoire.bandName,
    href: `/crucetas-musicales/${repertoire.slug}`,
    cta: 'Ver la cruceta →',
    path: ['Procesión', 'Banda', 'Marchas'],
    dateTime: repertoire.createdAt,
    dateVerb: 'Añadido',
    familyId: repertoire.brotherhoodEntityId
      ? `brotherhood:${repertoire.brotherhoodEntityId}`
      : `band:${repertoire.bandEntityId}`,
    dedupeKey: `musical-repertoire:${repertoire.outingId}:${repertoire.bandEntityId}`,
  }
}

export function buildPlatformUpdates({
  discoveryThreads = [], musicChanges = [], repertoires = [],
  limit = PLATFORM_UPDATES_LIMIT, now = new Date(),
} = {}) {
  const target = Math.min(PLATFORM_UPDATES_LIMIT, Math.max(0, Number(limit) || 0))
  if (!target) return []
  const candidates = [
    ...discoveryThreads.map(discoveryUpdate),
    ...musicChanges.map(musicChangeUpdate),
    ...repertoires.map(repertoireUpdate),
  ].map((candidate) => finishUpdate(candidate, now)).filter(Boolean)
    .sort((first, second) => (
      timestamp(second.dateTime) - timestamp(first.dateTime)
      || first.id.localeCompare(second.id)
    ))

  const seenIds = new Set()
  const seenActions = new Set()
  const updates = []
  for (const candidate of candidates) {
    const action = candidate.dedupeKey || candidate.id
    if (seenIds.has(candidate.id) || seenActions.has(action)) continue
    seenIds.add(candidate.id)
    seenActions.add(action)
    const { dedupeKey, ...update } = candidate
    updates.push(update)
    if (updates.length >= target) break
  }
  return updates
}

export function selectPlatformUpdatesForHome(updates = [], limit = 3) {
  const familyByThreadId = new Map(updates.map((update) => [update.id, update.familyId]))
  return selectDiverseHomeThreads(updates, familyByThreadId, Math.min(PLATFORM_UPDATES_LIMIT, Math.max(0, Number(limit) || 0)))
}
