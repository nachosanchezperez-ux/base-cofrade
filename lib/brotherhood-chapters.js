// Ficha 2.0 por capítulos (Tarea 13). Política de presentación pura: decide qué
// capítulos tiene una Hermandad a partir de su tipo y de lo que está documentado.
// No depende de slugs: la cohorte piloto vive en brotherhood-chapters-rollout.js.
import { plural } from './plural.js'

export const CHAPTER_ANCHOR_PREFIX = 'capitulo-'

export function chapterAnchor(id) {
  return `${CHAPTER_ANCHOR_PREFIX}${id}`
}

// Penitencia manda: una Hermandad de Penitencia que además saca una procesión de
// Gloria se lee como cortejo. Solo las corporaciones sin Penitencia usan el
// recorrido «Procesión · Patrimonio», sin campos impropios (nazarenos, túnica,
// Carrera Oficial, estación de penitencia).
export function brotherhoodChapterProfile(types = []) {
  const list = Array.isArray(types) ? types : []
  if (list.includes('Penitencia')) return 'penitencia'
  return 'gloria'
}

const CHAPTER_COPY = {
  inicio: { label: 'Inicio', icon: 'inicio' },
  cortejo: { label: 'Cortejo', icon: 'cortejo' },
  procesion: { label: 'Procesión', icon: 'procesion' },
  musica: { label: 'Música', icon: 'musica' },
  patrimonio: { label: 'Patrimonio', icon: 'patrimonio' },
  historia: { label: 'Historia', icon: 'historia' },
  hilo: { label: 'Hilo', icon: 'hilo' },
}

function joinFacts(parts) {
  return parts.filter(Boolean).join(' · ')
}

// `availability` resume lo que está documentado (solo recuentos de datos reales).
// Un capítulo sin contenido no aparece: ni en la navegación ni en la página.
export function brotherhoodChapters({ types = [], availability = {} } = {}) {
  const profile = brotherhoodChapterProfile(types)
  const a = {
    titulars: 0,
    steps: 0,
    currentBands: 0,
    marches: 0,
    hasMusic: false,
    heritagePieces: 0,
    simpecados: 0,
    hasHeritage: false,
    hasOutings: false,
    historyEvents: 0,
    hasHistory: false,
    hasHilo: true,
    threadLength: 0,
    threadEnd: '',
    ...availability,
  }

  const processionId = profile === 'penitencia' ? 'cortejo' : 'procesion'
  const secondId = profile === 'penitencia' ? 'musica' : 'patrimonio'
  const hasProcession = a.titulars > 0 || a.steps > 0 || (profile === 'gloria' && a.hasOutings)
  const hasSecond = profile === 'penitencia' ? a.hasMusic : (a.hasHeritage || a.hasMusic)

  const summaries = {
    inicio: 'Identidad, próximo acto y actualidad',
    [processionId]: joinFacts([
      a.titulars ? plural(a.titulars, 'titular', 'titulares') : '',
      a.steps ? plural(a.steps, 'paso', 'pasos') : '',
    ]) || (profile === 'gloria' ? 'La procesión y su recorrido' : 'Titulares y pasos'),
    [secondId]: profile === 'penitencia'
      ? joinFacts([
        a.currentBands ? plural(a.currentBands, 'banda actual', 'bandas actuales') : '',
        a.marches ? plural(a.marches, 'composición dedicada', 'composiciones dedicadas') : '',
      ]) || 'Bandas y marchas'
      : joinFacts([
        a.heritagePieces ? plural(a.heritagePieces, 'pieza', 'piezas') : '',
        a.simpecados ? plural(a.simpecados, 'simpecado', 'simpecados') : '',
        a.marches ? plural(a.marches, 'composición dedicada', 'composiciones dedicadas') : '',
      ]) || 'Patrimonio artístico y enseres',
    historia: a.historyEvents ? plural(a.historyEvents, 'acontecimiento', 'acontecimientos') : 'Orígenes y trayectoria',
    hilo: a.threadLength >= 3 && a.threadEnd
      ? `${plural(a.threadLength - 1, 'ficha enlazada', 'fichas enlazadas')}, hasta ${a.threadEnd}`
      : 'Hermandades, bandas y autores relacionados',
  }

  return [
    'inicio',
    hasProcession && processionId,
    hasSecond && secondId,
    a.hasHistory && 'historia',
    a.hasHilo && 'hilo',
  ]
    .filter(Boolean)
    .map((id) => ({ id, anchor: chapterAnchor(id), href: `#${chapterAnchor(id)}`, summary: summaries[id], ...CHAPTER_COPY[id] }))
}

// Cabecera: la jornada habitual antes que una fecha concreta. En una Gloria, la
// edición de un año (p. ej. la salida de la coronación) pertenece a la agenda.
export function chapterHeroFacts({ profile, holyWeekValue = '', recurringGloryDay = '', gloryEditionDate = '', foundingYear = '', nazarenes = null }) {
  const facts = profile === 'penitencia'
    ? [
      { label: 'Semana Santa', value: holyWeekValue },
      { label: 'Fundación', value: foundingYear },
      nazarenes?.value ? { label: nazarenes.label, value: nazarenes.value } : null,
    ]
    : [
      { label: 'Salida', value: recurringGloryDay || gloryEditionDate },
      { label: 'Fundación', value: foundingYear },
    ]
  return facts.filter((fact) => fact?.value)
}

// Año de fundación para la cabecera, solo cuando el texto documentado lo dice
// sin ambigüedad: el año que sigue a «fundada/formada/erigida…», o el único año
// del texto. En cualquier otro caso se muestra el texto tal cual.
export function foundingYearLabel(text = '') {
  const value = String(text || '').trim()
  if (!value) return ''
  const keyed = /\b(?:fundad[ao]|formad[ao]|erigid[ao]|instituid[ao]|origen)\b[^.;]*?\b(1[2-9]\d{2}|20\d{2})\b/iu.exec(value)
  if (keyed) return keyed[1]
  const years = [...new Set(value.match(/\b(?:1[2-9]\d{2}|20\d{2})\b/gu) || [])]
  return years.length === 1 ? years[0] : value
}
