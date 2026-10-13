// Ficha de Hermandad · diseño «enciclopedia × revista» (Tarea 09).
// Funciones puras: preparan los bloques visuales a partir de datos que la
// ficha ya carga. No consultan Supabase ni generan textos nuevos.

// Cohorte de publicación por ID (no por slug), como la lectura de Hermandades.
// Ampliar solo tras QA visual y aprobación expresa.
export const BROTHERHOOD_MAGAZINE_COHORT = Object.freeze([
  '206cf962-fd63-4fae-ad0d-9454554283d8', // San Benito (Sevilla)
  '10000000-0000-0000-0000-000000000001', // El Baratillo (piloto de lectura)
  '36b4d5c1-f7bb-4025-a09a-948e0d5d188f', // San Esteban (piloto de lectura)
])

export function usesBrotherhoodMagazine(entityId) {
  return BROTHERHOOD_MAGAZINE_COHORT.includes(entityId)
}

const YEAR = /\b(1[2-9]\d{2}|20\d{2})\b/
const YEAR_SOURCE = '(?:1[2-9]\\d{2}|20\\d{2})'

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function yearOf(value) {
  const match = text(String(value ?? '')).match(YEAR)
  return match ? Number(match[1]) : null
}

// Cifras grandes: solo números que no se muestran en otro bloque de la ficha
// (los pasos van en el cortejo; las fuentes, en su bloque). Nunca ceros.
export function brotherhoodFigures({ brotherhood: h = {}, marchCount = 0, currentYear, foundationHref = '#historia' } = {}) {
  const founded = yearOf(h.fundacion)
  const year = Number(currentYear) || new Date().getUTCFullYear()
  const nazarenos = text(String(h.datosJornada?.totalNazarenos ?? ''))
  const cults = Array.isArray(h.cultos) ? h.cultos.length : 0
  return [
    founded && year > founded ? { value: year - founded, label: `años desde ${founded}`, href: foundationHref } : null,
    nazarenos && nazarenos !== '0' ? { value: nazarenos, label: h.datosJornada?.ano ? `nazarenos en ${h.datosJornada.ano}` : 'nazarenos' } : null,
    marchCount > 0 ? { value: marchCount, label: marchCount === 1 ? 'marcha dedicada' : 'marchas dedicadas', href: '#musica' } : null,
    cults > 0 ? { value: cults, label: cults === 1 ? 'culto al año' : 'cultos al año', href: '#agenda' } : null,
  ].filter(Boolean)
}

// Cortejo: los pasos en su orden documentado, con sus imágenes y la música
// vigente que va detrás. La música sin paso solo abre el cortejo cuando su
// posición lo dice (cruz de guía o cabeza); el resto no se coloca a ciegas.
export function brotherhoodProcession({ steps = [], images = [], acompanamientoActual = [], coverMedia = new Map(), framing = () => '' } = {}) {
  const stepIds = new Set(steps.map((step) => step.id))
  const imageById = new Map(images.map((image) => [image.id, image]))
  const musicByStep = new Map()
  const head = []

  for (const item of acompanamientoActual) {
    const band = text(item?.banda)
    if (!band) continue
    const entry = {
      id: item.id || `${band}-${item.posicion || ''}`,
      band,
      href: item.bandaSlug ? `/bandas/${item.bandaSlug}` : '',
      position: text(item.posicion),
      since: text(item.periodo),
    }
    if (item.pasoId && stepIds.has(item.pasoId)) {
      musicByStep.set(item.pasoId, [...(musicByStep.get(item.pasoId) || []), entry])
    } else if (/cruz de gu[ií]a|cabeza/i.test(entry.position)) {
      head.push(entry)
    }
  }

  return {
    head,
    steps: steps.map((step) => {
      const media = coverMedia.get(step.id)
      const titulars = (step.imagenesDetalle?.length
        ? step.imagenesDetalle
        : (step.imagenes || []).map((imageId) => imageById.get(imageId)).filter(Boolean))
        .map((image) => ({
          id: image.id,
          name: image.nombre,
          href: image.fichaDisponible && image.slug ? `/imagenes/${image.slug}` : '',
        }))
      return {
        id: step.id,
        name: step.nombre,
        type: text(step.tipo),
        href: step.fichaDisponible && step.slug ? `/pasos/${step.slug}` : '',
        photo: media?.path ? { src: media.path, alt: media.alt || '', credit: media.credit || '', position: framing(step.slug) || '' } : null,
        titulars,
        music: musicByStep.get(step.id) || [],
      }
    }),
  }
}

// Historia en fechas a partir del texto documentado, cuando no hay cronología.
// Cada hito es una frase (o parte de frase) del propio texto que contiene un
// año: no se resume ni se reescribe.
export function milestonesFromText(value = '') {
  const sentences = text(value)
    .replace(/\s+/g, ' ')
    .split(/(?<=[.;])\s+(?=[A-ZÁÉÍÓÚÑ0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
  const splitter = new RegExp(`;\\s+|,\\s+(?:y\\s+)?(?=(?:en\\s+)?${YEAR_SOURCE}\\b)|\\s+y\\s+(?=en\\s+${YEAR_SOURCE}\\b)`)
  const parts = sentences.flatMap((sentence) => {
    const pieces = sentence.split(splitter)
    return pieces.filter((piece) => YEAR.test(piece)).length > 1 ? pieces : [sentence]
  })
  const items = []
  for (const part of parts) {
    const year = part.match(YEAR)?.[1]
    if (!year) continue
    const clean = part.replace(/^[,;\s]+/, '').replace(/[,;\s]+$/, '')
    const sentence = clean.charAt(0).toUpperCase() + clean.slice(1)
    items.push({ year, text: /[.!?…]$/.test(sentence) ? sentence : `${sentence}.` })
  }
  return items
}

// La guía editorial ya cuenta la historia cuando existe y la Hermandad no tiene
// cronología propia: en ese caso no se añade un segundo relato.
export function guideCoversHistory(brotherhood = {}) {
  return Boolean(text(brotherhood.editorialGuide?.body)) && !(brotherhood.cronologia?.length)
}

// Primer tramo legible de un capítulo para la tarjeta; el resto queda plegado.
export function splitLead(value = '', limit = 220) {
  const compact = text(value).replace(/\s+/g, ' ')
  if (compact.length <= limit) return { lead: compact, rest: '' }
  const cut = compact.slice(0, limit)
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '))
  if (stop > 80) return { lead: compact.slice(0, stop + 1), rest: compact.slice(stop + 1).trim() }
  const space = cut.lastIndexOf(' ')
  return { lead: `${compact.slice(0, space)}…`, rest: compact.slice(space).trim() }
}
