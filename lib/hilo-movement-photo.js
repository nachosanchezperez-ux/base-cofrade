// Foto de una noticia de «El Hilo se mueve». Módulo puro (sin React ni CSS) para
// que la portada, el índice y la página de cada noticia elijan la misma imagen.
const archivePhotos = {
  'cigarreras-soberana-entrega-panaderos-2026': { src: '/bandas/las-cigarreras/cigarreras-corneta.jpg', alt: 'Corneta y paño bordado de Las Cigarreras' },
  'san-esteban-santa-ana-2027': { src: '/hermandades/san-esteban/cabecera-cortejo.jpg', alt: 'Cruz de guía y nazarenos de San Esteban' },
  'baratillo-continuidad-musical-2027': { src: '/bandas/banda-del-sol/formacion-baratillo-2026.jpg', alt: 'La Banda del Sol tras el paso de la Piedad del Baratillo' },
}

// La de archivo seleccionada a mano, si existe; si no, la de cabecera de la
// ficha del protagonista (Hermandad o banda), con su crédito.
export function hiloMovementPhoto(item = {}) {
  if (archivePhotos[item.id]) return { ...archivePhotos[item.id], credit: '', focusPosition: '50% 50%', archive: true, caption: 'Imagen de archivo' }
  if (item.cover?.path) {
    const name = item.protagonist?.label || 'la noticia'
    return { src: item.cover.path, alt: item.cover.alt || `Fotografía de ${name}`, credit: item.cover.credit || '', focusPosition: item.cover.focusPosition || '50% 50%', archive: true, caption: `Imagen de la ficha de ${name}` }
  }
  return null
}
