// Fotografías de galería de un paso: solo las vinculadas expresamente como
// «galería» en Multimedia. Las portadas sustituidas (relación «cover» sin
// marcar como portada), cabeceras y retratos no se muestran aquí.
// Conserva el orden del Panel (sort_order) y descarta entradas sin ruta.
export function stepGalleryMedia(items = []) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item?.path && !item.isCover && item.relationType === 'gallery')
}
