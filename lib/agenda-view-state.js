// Vuelta con contexto en la Agenda (#1264). Módulo puro: sin navegador ni alias,
// para probarlo con node --test.
//
// - La selección pública (periodo, tipo, territorio, municipio) vive en la URL con
//   los mismos parámetros que ya lee la página (?periodo, ?categoria, ?territorio,
//   ?municipio). Así Atrás, Adelante, la recarga y un enlace compartido la conservan.
// - Lo que es de este lector y de esta visita («Mis hermandades», tandas mostradas,
//   posición y detalle abierto) va en history.state: vuelve con Atrás y con la
//   recarga, pero nunca viaja en un enlace compartido.

export const AGENDA_VIEW_STATE_KEY = 'hcAgendaView'

const DEFAULTS = { periodo: 'upcoming', categoria: 'all', territorio: 'all' }

// Query string de la vista. Conserva cualquier otro parámetro y omite los valores
// por defecto, de modo que la Agenda sin filtros sigue siendo /agenda-cofrade.
export function agendaFilterSearch(currentSearch = '', { period = 'upcoming', category = 'all', territory = 'all', municipality = '', mineOnly = false } = {}) {
  const params = new URLSearchParams(currentSearch)
  const set = (name, value) => {
    if (value && value !== DEFAULTS[name]) params.set(name, value)
    else params.delete(name)
  }
  set('periodo', period)
  set('categoria', category)
  set('territorio', territory)
  set('municipio', territory === 'province' ? municipality : '')
  // ?mis=1 solo llega desde la ficha de una Hermandad. Si el lector lo desactiva,
  // se retira; activarlo aquí no lo añade (queda en history.state, no en la URL).
  if (!mineOnly) params.delete('mis')
  const value = params.toString()
  return value ? `?${value}` : ''
}

// Un ancla de acto (#acto-…) abre ese acto y reinicia los filtros. Cuando el lector
// cambia la selección después, el ancla deja de describir la vista y se retira.
export function agendaHashAfterFilterChange(hash = '') {
  return String(hash).startsWith('#acto-') ? '' : String(hash || '')
}

function finiteCount(value, pageSize) {
  if (value === 'all') return Number.POSITIVE_INFINITY
  const number = Number(value)
  return Number.isFinite(number) && number > pageSize ? Math.floor(number) : pageSize
}

// Estado guardado en history.state. Infinity no es serializable: se guarda 'all'.
export function serializeAgendaView({ visibleCount, mineOnly = false, scrollY = 0, anchorId = '', anchorTop = 0, openDetailId = '' } = {}) {
  return {
    visibleCount: visibleCount === Number.POSITIVE_INFINITY ? 'all' : Number(visibleCount) || 0,
    mineOnly: Boolean(mineOnly),
    scrollY: Math.max(0, Math.round(Number(scrollY) || 0)),
    anchorId: String(anchorId || ''),
    anchorTop: Math.round(Number(anchorTop) || 0),
    openDetailId: String(openDetailId || ''),
  }
}

export function readAgendaView(historyState, pageSize = 24) {
  const saved = historyState && typeof historyState === 'object' ? historyState[AGENDA_VIEW_STATE_KEY] : null
  if (!saved || typeof saved !== 'object') return null
  const anchorId = /^acto-[A-Za-z0-9_-]+$/.test(String(saved.anchorId || '')) ? String(saved.anchorId) : ''
  const openDetailId = /^acto-[A-Za-z0-9_-]+-detail$/.test(String(saved.openDetailId || '')) ? String(saved.openDetailId) : ''
  return {
    visibleCount: finiteCount(saved.visibleCount, pageSize),
    mineOnly: Boolean(saved.mineOnly),
    scrollY: Math.max(0, Number(saved.scrollY) || 0),
    anchorId,
    anchorTop: Number(saved.anchorTop) || 0,
    openDetailId,
  }
}

// Posición a la que volver: se prefiere el acto de referencia (su altura puede
// variar si cambian imágenes o tandas) y, si no está en la página, el scroll guardado.
export function agendaRestoreScrollTop(view, anchorDocumentTop = null) {
  if (!view) return null
  if (view.anchorId && Number.isFinite(anchorDocumentTop)) return Math.max(0, Math.round(anchorDocumentTop - view.anchorTop))
  return view.scrollY
}
