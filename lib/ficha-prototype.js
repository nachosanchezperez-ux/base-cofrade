// Tarea 09 · Prototipo de renovación visual de fichas.
// Cohorte de revisión, solo para la preview de la rama de prototipo: no se
// fusiona. Activación por ID de entidad (no por slug), como la lectura de
// Hermandades. Cualquier ficha fuera de esta lista conserva su diseño.
export const FICHA_PROTOTYPE_COHORT = Object.freeze([
  '206cf962-fd63-4fae-ad0d-9454554283d8', // Hermandad · San Benito (Sevilla)
  '0e82c8a9-26c1-4ac6-bf22-832d169751d4', // Imagen · Nuestra Señora del Amparo
  'c5008d70-a6aa-46df-8314-693ecaa541bb', // Paso · Misterio del Cristo de las Aguas
  '0a86bfb1-afe6-448a-88b9-127867f5b1a9', // Banda · Tres Caídas de Triana
])

export function usesFichaPrototype(entityId) {
  return FICHA_PROTOTYPE_COHORT.includes(entityId)
}
