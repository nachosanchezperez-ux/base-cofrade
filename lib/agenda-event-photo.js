// Foto de cada acto de la Agenda (#agenda-fotos). Módulo puro, sin Supabase ni
// alias, para probarlo con node --test.
//
// Orden fijo, sin inventar nada:
//   1. Foto o cartel del propio acto (salida: hero; culto: cult_media; concierto
//      o acto: entity_media). Se muestra en grande.
//   2. Foto autorizada de la imagen titular relacionada. Miniatura.
//   3. Escudo de la Hermandad (o logotipo de la banda). Miniatura.
//   4. Nada: la cita va sin imagen, nunca con una foto genérica.
// Las fotos solo llegan aquí si sus derechos permiten publicarlas (lo filtran
// los lectores de portadas) y siempre con su crédito si lo hay.

// Un cartel no se recorta. Se marca en el Panel con el encuadre «Completa»
// (fit_mode = contain); sin marca, una imagen claramente vertical se trata
// igual, porque recortarla a lo ancho dejaría el cartel ilegible.
export function agendaPhotoFit({ fitMode = '', width = null, height = null } = {}) {
  if (fitMode === 'contain') return 'contain'
  if (fitMode === 'cover') return 'cover'
  const w = Number(width) || 0
  const h = Number(height) || 0
  return w && h && h > w * 1.15 ? 'contain' : 'cover'
}

function cleanCredit(value = '') {
  const text = String(value || '').trim()
  if (!text) return ''
  return /^fotograf[ií]a\b/i.test(text) ? text.replace(/^fotograf[ií]a\s*[•·:|\-]?\s*/i, 'Fotografía · ') : `Fotografía · ${text}`
}

function fromCover(cover, source, fallbackAlt, name = '') {
  if (!cover?.path) return null
  return {
    name,
    path: cover.path,
    alt: cover.alt || fallbackAlt || '',
    credit: cleanCredit(cover.credit || cover.authorName || ''), // con licencia si la tiene
    fit: agendaPhotoFit(cover),
    source,
  }
}

// item: datos crudos del lector (antes de normalizar). Devuelve la foto que se
// mostrará o null. `eventCover` y `titularCover` los añade withAgendaPhotos.
export function pickAgendaPhoto(item = {}) {
  const title = String(item.title || '').trim()
  if (item.heroImagePath) {
    return {
      path: item.heroImagePath,
      alt: item.heroImageAlt || title,
      credit: cleanCredit(item.heroImageCredit),
      fit: agendaPhotoFit({ fitMode: item.heroImageFit || 'cover' }),
      source: 'event',
    }
  }
  return fromCover(item.eventCover, 'event', title)
    || fromCover(item.titularCover, 'titular', item.titularName || title, item.titularName || '')
    || null
}

// La primera imagen titular publicada del hilo del acto, si la hay.
export function titularEntityId(item = {}) {
  const relation = (Array.isArray(item.relations) ? item.relations : []).find((entry) => entry.kind === 'image' && entry.entityId)
  return relation ? { id: relation.entityId, name: relation.name } : null
}
