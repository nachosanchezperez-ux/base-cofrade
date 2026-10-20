// Ancla estable de una pieza de patrimonio dentro de la ficha (#pieza-…), para
// que otros capítulos (p. ej. el cortejo completo) enlacen a la pieza en vez de
// repetir sus datos.
export function heritagePieceAnchor(id = '') {
  const slug = String(id || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return slug ? `pieza-${slug}` : ''
}
