// «Último dato bueno» para las fichas públicas (Hermandad, Banda, Paso, Imagen).
//
// Motivo: la caché de cada ficha lleva el día en la clave y caduca a las 6 horas,
// así que cada día hay lecturas en frío contra Supabase. Si Supabase responde con
// un error puntual en ese momento (502 a las 04:24 UTC del 15/10/2026 en
// /hermandades/pasion-y-muerte), la ficha entera fallaba aunque el día anterior
// se hubiera servido bien. El reintento de #1205 reduce el riesgo, pero el 16/10
// volvió a haber un 502 que sobrevivió al reintento.
//
// Funcionamiento:
// - Lectura normal: la caché de siempre (`readCurrent`). Si responde, se agenda
//   en segundo plano (`schedule`, `after()` de Next) la lectura de la copia de
//   respaldo para que exista; la mayoría de las veces es solo una consulta a la caché.
// - Si la lectura normal falla, se sirve la copia de respaldo (`readLastGood`),
//   que guarda la última ficha completa durante 7 días. Si tampoco hay copia, se
//   propaga el error original (la ficha falla igual que antes).
// - Nunca se guarda una ficha a medias: la copia solo se rellena con una carga
//   completa que no ha fallado.
// - Una ficha retirada (la lectura normal devuelve null) no usa la copia.

export const PUBLIC_DETAIL_LAST_GOOD_REVALIDATE = 7 * 24 * 60 * 60

export function createLastGoodReader({ label, readCurrent, readLastGood, schedule, log = console }) {
  return async function readWithLastGood(slug, ...keyParts) {
    try {
      const value = await readCurrent(slug, ...keyParts)
      if (value && typeof schedule === 'function') {
        try {
          schedule(async () => {
            try {
              await readLastGood(slug)
            } catch (error) {
              log.warn?.(`[Hilo Cofrade] No se pudo actualizar la copia de respaldo de ${label}`, {
                slug,
                error: error instanceof Error ? error.message : String(error),
              })
            }
          })
        } catch {
          // Fuera de una petición (build, scripts) no hay dónde agendar: no es necesario.
        }
      }
      return value
    } catch (error) {
      let fallback = null
      try {
        fallback = await readLastGood(slug)
      } catch {
        fallback = null
      }
      if (fallback) {
        log.error?.(`[Hilo Cofrade] ${label}: se sirve la última copia completa por un fallo de Supabase`, {
          slug,
          error: error instanceof Error ? error.message : String(error),
        })
        return fallback
      }
      throw error
    }
  }
}
