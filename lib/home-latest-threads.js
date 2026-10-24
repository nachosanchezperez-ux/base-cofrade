// «Últimos hilos incorporados» de la portada: lo que ha entrado en Hilo Cofrade,
// dicho en una línea y agrupado por día. Política pura, sin acceso a datos.
//
// Entradas:
//  - updates: el feed público de novedades (lib/platform-updates.js), ya en
//    orden cronológico inverso.
//  - newEntities: fichas nuevas de Hermandades y bandas (entity_new), que el
//    feed de novedades no recoge.
// Cada línea dice qué ha pasado («Capataces», «Nueva hermandad») sobre qué
// ficha, con el dato concreto debajo. Si el mismo día entran tres o más del
// mismo tipo, se agrupan en una sola línea con un enlace a cada ficha.

import { platformUpdateDateLabel } from './platform-updates.js'

export const HOME_LATEST_LIMIT = 5
const GROUP_FROM = 3
// Las fichas nuevas se agrupan desde dos: dejan sitio al resto de novedades.
const GROUP_NEW_FROM = 2

// Qué ha pasado, en palabras del lector (no la relación técnica).
const TAGS = {
  musical_heritage: 'Patrimonio musical',
  posters: 'Cartelería',
  band_brotherhoods: 'Hermandades que acompaña',
  step_personnel: 'Capataces',
  titularity: 'Titulares',
  brotherhood_steps: 'Pasos',
  discography: 'Discografía',
  image_authorship: 'Autoría',
  step_phases: 'Historia del paso',
  heritage_interventions: 'Restauraciones',
  heritage_updates: 'Estrenos y restauraciones',
  march_publications: 'Marchas nuevas',
  music_change: 'Cambio musical',
  musical_repertoire: 'Nueva cruceta',
}

const NEW_TAGS = {
  brotherhood: ['Nueva hermandad', 'Hermandades nuevas'],
  band: ['Nueva banda', 'Bandas nuevas'],
}

const GROUP_TAGS = {
  step_personnel: 'Capataces al día',
  musical_heritage: 'Patrimonio musical',
  titularity: 'Titulares',
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function timestamp(value) {
  const parsed = value ? new Date(value).getTime() : NaN
  return Number.isFinite(parsed) ? parsed : NaN
}

export function madridDayKey(value) {
  const parsed = timestamp(value)
  if (!Number.isFinite(parsed)) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(parsed))
}

export function listNames(names = [], max = 3) {
  const clean = names.map(text).filter(Boolean)
  if (!clean.length) return ''
  const shown = clean.slice(0, max)
  const rest = clean.length - shown.length
  if (rest > 0) return `${shown.join(', ')} y ${rest} más`
  return shown.length === 1 ? shown[0] : `${shown.slice(0, -1).join(', ')} y ${shown.at(-1)}`
}

function firstSentence(value) {
  const clean = text(value)
  const end = clean.indexOf('. ')
  return end > 0 ? clean.slice(0, end) : clean.replace(/\.$/, '')
}

// Una novedad del feed como línea de la portada.
// Sin escudo ni foto: un símbolo del tipo en lugar de la inicial.
const SYMBOLS = { march_publications: '♪', music_change: '♪', musical_repertoire: '♪', musical_heritage: '♪', discography: '♪' }

export function latestFromUpdate(update) {
  if (!update?.id || !text(update.href) || !text(update.title)) return null
  const kind = text(update.activityKind)
  let title = text(update.title)
  let detail = text(update.metric)

  if (kind === 'music_change') {
    // «Cambio musical en Sevilla» no dice nada: manda la Hermandad y quién entra.
    title = text(update.metric).split(' · ')[0] || title
    detail = firstSentence(update.summary)
  }
  if (kind === 'march_publications') {
    // «22 nuevas marchas · 22 fichas incorporadas» repite lo mismo: mejor los títulos.
    const names = Array.isArray(update.marchNames) ? update.marchNames.map(text).filter(Boolean) : []
    const count = Number(update.marchCount) || names.length
    if (names.length > 1) {
      const shown = names.slice(0, 2)
      const rest = Math.max(0, count - shown.length)
      title = rest ? `${shown.join(' · ')} y ${rest} más` : shown.join(' · ')
      detail = `${count} marchas nuevas en el catálogo`
    } else {
      detail = 'Nueva ficha en el catálogo'
    }
  }

  return {
    id: update.id,
    kind,
    tag: TAGS[kind] || 'Novedad',
    title,
    detail,
    href: update.href,
    rootEntityId: text(update.rootEntityId),
    dateTime: update.dateTime,
    visual: update.visual || null,
    symbol: SYMBOLS[kind] || '',
    isNew: false,
  }
}

// Una ficha nueva de Hermandad o banda.
export function latestFromNewEntity(entity) {
  if (!entity?.id || !text(entity.href) || !text(entity.title)) return null
  const tags = NEW_TAGS[entity.entityType]
  if (!tags) return null
  const titulares = (entity.titulares || []).map(text).filter(Boolean)
  const detail = entity.entityType === 'brotherhood'
    ? titulares.length === 1
      ? `Con su titular, ${titulares[0]}`
      : titulares.length > 1
        ? `Con sus ${titulares.length} titulares`
        : 'Nueva ficha en Hilo Cofrade'
    : 'Nueva ficha en Hilo Cofrade'
  return {
    id: entity.id,
    kind: `new_${entity.entityType}`,
    tag: tags[0],
    groupTag: tags[1],
    title: text(entity.title),
    detail,
    href: entity.href,
    rootEntityId: text(entity.rootEntityId),
    relatedIds: entity.relatedIds || [],
    dateTime: entity.dateTime,
    visual: entity.visual || null,
    isNew: true,
  }
}

// «Banda de Cornetas y Tambores …» repetido en cada enlace: el tipo va una vez en el
// dato y cada enlace queda con lo que distingue a la ficha.
const SHARED_PREFIXES = ['Banda de Cornetas y Tambores ', 'Agrupación Musical ', 'Banda de Música ', 'Hermandad de ']

function sharedPrefix(labels = []) {
  return SHARED_PREFIXES.find((prefix) => labels.length > 1 && labels.every((label) => label.startsWith(prefix))) || ''
}

function groupItems(items = []) {
  // Tres o más del mismo tipo el mismo día: una sola línea con un enlace a cada ficha.
  const byKey = new Map()
  for (const item of items) {
    const key = `${madridDayKey(item.dateTime)}|${item.kind}`
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key).push(item)
  }
  const out = []
  const done = new Set()
  for (const item of items) {
    const key = `${madridDayKey(item.dateTime)}|${item.kind}`
    if (done.has(key)) continue
    const members = byKey.get(key)
    if (members.length < (item.isNew ? GROUP_NEW_FROM : GROUP_FROM)) {
      out.push(item)
      continue
    }
    done.add(key)
    const count = members.length
    const prefix = sharedPrefix(members.map((member) => member.title))
    const kindLabel = prefix ? `${prefix.trim().replace(/^Banda de Cornetas y Tambores$/, 'de cornetas y tambores').replace(/^Agrupación Musical$/, 'agrupaciones musicales').replace(/^Banda de Música$/, 'de música').replace(/^Hermandad de$/, '').toLowerCase()}` : ''
    out.push({
      id: `group:${key}`,
      kind: item.kind,
      tag: item.groupTag || GROUP_TAGS[item.kind] || item.tag,
      title: '',
      detail: item.isNew
        ? `${count} fichas nuevas${kindLabel ? ` · ${kindLabel}` : ''}`
        : `${count} fichas actualizadas`,
      href: '',
      links: members.map((member) => ({ id: member.id, label: prefix ? member.title.slice(prefix.length) : member.title, href: member.href, title: member.title })),
      visuals: members.map((member) => member.visual).filter((visual) => visual?.path).slice(0, 3),
      count,
      dateTime: members[0].dateTime,
      isNew: Boolean(item.isNew),
      grouped: true,
    })
  }
  return out
}

export function buildHomeLatestThreads({ updates = [], newEntities = [], limit = HOME_LATEST_LIMIT, now = new Date() } = {}) {
  const target = Math.max(0, Number(limit) || 0)
  if (!target) return []

  const fresh = newEntities.map(latestFromNewEntity).filter(Boolean)
  // Una ficha nueva manda sobre las novedades de esa misma ficha (sus titulares,
  // sus pasos…): no se anuncia dos veces lo mismo.
  const covered = new Set(fresh.flatMap((item) => [item.rootEntityId, ...(item.relatedIds || [])]).filter(Boolean))
  const changes = updates.map(latestFromUpdate).filter(Boolean)
    .filter((item) => !item.rootEntityId || !covered.has(item.rootEntityId))

  const seen = new Set()
  const ordered = [...fresh, ...changes]
    .filter((item) => Number.isFinite(timestamp(item.dateTime)) && timestamp(item.dateTime) <= timestamp(now))
    .sort((first, second) => timestamp(second.dateTime) - timestamp(first.dateTime) || first.id.localeCompare(second.id))
    .filter((item) => {
      const key = item.href
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

  return groupItems(ordered).slice(0, target).map((item) => ({
    ...item,
    dateLabel: platformUpdateDateLabel(item.dateTime, now),
    dayKey: madridDayKey(item.dateTime),
  }))
}

// Agrupa las líneas por día para pintarlas bajo «Hoy», «Ayer», «22 oct».
export function latestThreadsByDay(items = []) {
  const days = []
  for (const item of items) {
    const last = days.at(-1)
    if (last && last.dayKey === item.dayKey) last.items.push(item)
    else days.push({ dayKey: item.dayKey, label: item.dateLabel, items: [item] })
  }
  return days
}
