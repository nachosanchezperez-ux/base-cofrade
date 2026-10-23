// Cohorte piloto de la ficha por capítulos (Tarea 13 · prototipo, NO FUSIONAR).
// Separada del diseño, que se deriva del tipo de Hermandad. Por ID de entidad:
// un cambio de slug no altera la cohorte.
export const BROTHERHOOD_CHAPTERS_PILOT = Object.freeze([
  '206cf962-fd63-4fae-ad0d-9454554283d8', // San Benito · Penitencia (y Sacramental).
  '10000000-0000-0000-0000-000000000001', // El Baratillo · Penitencia.
  'fc0942dd-d555-43b2-9495-399daba54903', // El Amparo (Magdalena) · Gloria.
]);

export function usesBrotherhoodChapters(entityId) {
  return BROTHERHOOD_CHAPTERS_PILOT.includes(entityId);
}
