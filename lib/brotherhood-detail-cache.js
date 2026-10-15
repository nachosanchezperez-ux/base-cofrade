// Frescura de la caché de datos de la ficha de Hermandad.
//
// En Next 16, cuando una página ISR se regenera y una entrada de unstable_cache está
// caducada, la regeneración espera a volver a consultarla (revalidación bloqueante).
// Con 15 minutos, igual que la página, casi todas las regeneraciones consultaban
// Supabase de nuevo: p50 ~2,5 s en producción (13–14/10/2026), frente a ~0,4 s con los
// datos vigentes.
//
// Decisión del propietario (14/10/2026): hasta 6 horas.
// - Los cambios desde el Panel se ven al momento: revalidatePath('/hermandades/<slug>')
//   marca como caducados los datos leídos en esa ruta.
// - Los cambios hechos directamente en la base de datos tardan como máximo 6 horas.
// - La página sigue regenerándose cada 15 minutos (Agenda e igualás conservan su frescura).
export const BROTHERHOOD_DETAIL_DATA_REVALIDATE = 6 * 60 * 60

export const BROTHERHOOD_DETAIL_DATA_CACHE = Object.freeze({
  revalidate: BROTHERHOOD_DETAIL_DATA_REVALIDATE,
  tags: ['public-brotherhood-detail'],
})

// Algunas cargas dependen del día (cultos aún no terminados, contratos musicales que
// empiezan en una fecha, ediciones del año en curso). El día UTC, el mismo que usan
// esas cargas, forma parte de la clave: los datos se renuevan como muy tarde a
// medianoche aunque no hayan caducado.
export function brotherhoodDetailCacheDay(now = new Date()) {
  return now.toISOString().slice(0, 10)
}
