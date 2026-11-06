// Cohorte piloto de la ficha por capítulos (modo aplicación en móvil).
// Separada del diseño, que se deriva del tipo de Hermandad. Por ID de entidad:
// un cambio de slug no altera la cohorte.
export const BROTHERHOOD_CHAPTERS_PILOT = Object.freeze([
  '206cf962-fd63-4fae-ad0d-9454554283d8', // San Benito · Penitencia (y Sacramental).
  '10000000-0000-0000-0000-000000000001', // El Baratillo · Penitencia.
  'fc0942dd-d555-43b2-9495-399daba54903', // El Amparo (Magdalena) · Gloria.
  '73ab8507-9ee3-4d03-914e-ca7e813061a0', // Reina de Todos los Santos (Omnium Sanctorum) · Gloria y Sacramental.
  '5d8d6faa-95b3-415e-9aab-42e38b813c6a', // Pura y Limpia del Postigo · Gloria (procesión del 6 de diciembre).
  'd71b4c6c-af75-467d-be1e-de7bc8d4c29d', // Divina Pastora de San Antonio · Gloria (Rosario vespertino).
]);

export function usesBrotherhoodChapters(entityId) {
  return BROTHERHOOD_CHAPTERS_PILOT.includes(entityId);
}
