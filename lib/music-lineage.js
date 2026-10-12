import { documentedMusicStartYear } from './music-tenure.js'

// Antigüedad y formación anterior de un acompañamiento vigente, calculadas sobre
// music_accompaniment_periods (fuente canónica, HC-006).
//
// Criterio conservador para la formación anterior: solo se muestra cuando hay un
// periodo documentado, finalizado y publicado de OTRA banda en el MISMO paso de la
// MISMA Hermandad, cuyo fin no es posterior al inicio del periodo vigente. Sin paso
// en ambos periodos no se infiere sucesión: dos bandas de una Hermandad pueden
// coexistir en posiciones distintas.

function value(period, camel, snake) {
  return period?.[camel] ?? period?.[snake] ?? null
}

function intOrNull(input) {
  const number = Number(input)
  return Number.isInteger(number) && number > 0 ? number : null
}

// Antigüedad pública de un acompañamiento. Criterio conservador:
//   * si el periodo trae texto de fecha, solo cuenta el año que ese texto declare
//     explícitamente («Desde 1998»); textos como «Confirmado para 2026» no son inicio;
//   * sin texto, se usa year_from con la protección de Música 2027 frente a las
//     instantáneas técnicas de 2026 (documentedMusicStartYear).
export function accompanimentStartLabel(period = {}, options = {}) {
  const text = String(value(period, 'dateFromText', 'date_from_text') || '').trim()
  if (text) {
    const match = text.match(/\b(al\s+menos\s+)?desde\s+(?:el\s+a[ñn]o\s+)?((?:19|20)\d{2})\b/i)
    if (!match) return ''
    // «Documentada al menos desde 2007» no equivale a «desde 2007»: se conserva el matiz.
    return match[1] ? `Al menos desde ${match[2]}` : `Desde ${match[2]}`
  }
  const year = documentedMusicStartYear(period, options)
  return year ? `Desde ${year}` : ''
}

export function findDocumentedPredecessor(current = {}, periods = []) {
  const brotherhoodId = value(current, 'brotherhoodEntityId', 'brotherhood_entity_id')
  const stepId = value(current, 'stepEntityId', 'step_entity_id')
  const bandId = value(current, 'bandEntityId', 'band_entity_id')
  if (!brotherhoodId || !stepId || !bandId) return null

  const currentStart = documentedMusicStartYear(current) ?? intOrNull(value(current, 'yearFrom', 'year_from'))

  const candidates = periods.filter((period) => {
    if (!period || period.id === current.id) return false
    if (value(period, 'isCurrent', 'is_current') === true) return false
    if (period.status && period.status !== 'published') return false
    if (value(period, 'brotherhoodEntityId', 'brotherhood_entity_id') !== brotherhoodId) return false
    if (value(period, 'stepEntityId', 'step_entity_id') !== stepId) return false
    const otherBand = value(period, 'bandEntityId', 'band_entity_id')
    if (!otherBand || otherBand === bandId) return false
    const end = intOrNull(value(period, 'yearTo', 'year_to'))
    if (!end) return false
    return currentStart ? end <= currentStart : true
  })

  if (!candidates.length) return null

  const [latest] = candidates.sort((a, b) => (
    intOrNull(value(b, 'yearTo', 'year_to')) - intOrNull(value(a, 'yearTo', 'year_to'))
    || String(a.id).localeCompare(String(b.id))
  ))

  // El nombre se resuelve después con las bandas publicadas que ya consulta cada
  // ficha; la instantánea pública del periodo cubre las bandas archivadas.
  return {
    periodId: latest.id,
    bandEntityId: value(latest, 'bandEntityId', 'band_entity_id'),
    name: String(value(latest, 'publicBandName', 'public_band_name') || '').trim(),
    slug: String(value(latest, 'publicBandSlug', 'public_band_slug') || '').trim(),
    yearTo: intOrNull(value(latest, 'yearTo', 'year_to')),
  }
}

// Completa el nombre (y el enlace si la banda está publicada) con un mapa
// id → { name, slug } ya cargado por la ficha. Devuelve null si no hay nombre.
export function resolvePredecessor(predecessor, bandById = new Map()) {
  if (!predecessor) return null
  const band = bandById.get(predecessor.bandEntityId)
  const name = band?.name || predecessor.name
  if (!name) return null
  return { ...predecessor, name, slug: band?.slug || '' }
}

export function predecessorLabel(predecessor) {
  if (!predecessor?.name) return ''
  return predecessor.yearTo
    ? `Antes: ${predecessor.name} (hasta ${predecessor.yearTo})`
    : `Antes: ${predecessor.name}`
}
