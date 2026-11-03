// Enlaces del «Patrimonio musical» de la ficha de Hermandad.
//
// Las marchas dedicadas a la Hermandad o a sus Titulares ya tienen ficha propia
// (/marchas/<slug>) y sus compositores, ficha de autor (/autores/<slug>). La
// sección las mostraba como texto plano, de modo que muchas fichas de marcha
// solo se alcanzaban desde el índice paginado de /marchas. Estas funciones
// devuelven el enlace solo cuando la entidad está publicada, tiene slug y es del
// tipo que corresponde a esa ruta; en cualquier otro caso, cadena vacía.
// Módulo puro (sin alias @/) para probarlo con node --test.

const clean = (value) => String(value ?? '').trim()

export function musicalHeritageMarchHref(entity = {}) {
  const slug = clean(entity?.slug)
  if (!slug || entity?.status !== 'published') return ''
  return `/marchas/${slug}`
}

export function musicalHeritageAuthorHref(entity = {}) {
  const slug = clean(entity?.slug)
  if (!slug || entity?.status !== 'published' || entity?.entity_type !== 'agent') return ''
  return `/autores/${slug}`
}
