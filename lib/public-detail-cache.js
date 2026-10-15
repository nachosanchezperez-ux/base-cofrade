// Frescura de la caché de datos de las fichas públicas (Hermandad, Imagen, Paso, Banda).
//
// En Next 16, cuando una página ISR se regenera y una entrada de unstable_cache está
// caducada, la regeneración espera a volver a consultarla (revalidación bloqueante).
// Con 15 minutos, igual que la página, casi todas las regeneraciones consultaban
// Supabase de nuevo (ficha de Hermandad: p50 ~2,5 s; 13–14/10/2026).
//
// Decisión del propietario (14/10/2026): hasta 6 horas.
// - Los cambios desde el Panel se ven al momento: revalidatePath('/<familia>/<slug>')
//   marca como caducados los datos leídos en esa ruta (etiquetas implícitas).
// - Los cambios hechos directamente en la base de datos tardan como máximo 6 horas.
// - Las páginas siguen regenerándose cada 15 minutos.
export const PUBLIC_DETAIL_DATA_REVALIDATE = 6 * 60 * 60

// Las cargas que dependen del día (salidas próximas, año en curso…) llevan el día UTC
// en la clave: se renuevan como muy tarde a medianoche aunque no hayan caducado.
export function publicDetailCacheDay(now = new Date()) {
  return now.toISOString().slice(0, 10)
}
