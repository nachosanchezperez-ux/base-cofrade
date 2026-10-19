import 'server-only'

// Cortejo completo (Tarea 15 · prototipo). Punto único de lectura del orden
// procesional documentado de una Hermandad.
//
// Hoy NO existe en Supabase ninguna tabla con órdenes procesionales (ver
// docs/cortejo-completo-propuesta.md), así que devuelve null para todas: la
// ficha muestra solo el cortejo resumido, exactamente como hasta ahora.
// Cuando exista la tabla, esta función leerá el orden vigente del año (con su
// fuente) y enlazará cada insignia con su registro de heritage_assets.
export async function getBrotherhoodProcessionOrder() {
  return null
}
