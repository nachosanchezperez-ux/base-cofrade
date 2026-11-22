// Fotografías de galería de una entidad: todo lo que no es portada ni cabecera.
// Conserva el orden del Panel (sort_order) y descarta entradas sin ruta.
export function stepGalleryMedia(items = []) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item?.path && !item.isCover && item.relationType !== 'hero')
}
