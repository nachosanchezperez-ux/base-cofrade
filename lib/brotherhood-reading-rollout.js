// Publication cohort, separate from the reusable design. Add IDs only after
// visual QA and explicit publication approval. Slug changes cannot alter it.
export const BROTHERHOOD_READING_COHORT = Object.freeze([
  '10000000-0000-0000-0000-000000000001', // Approved pilot: El Baratillo.
  '36b4d5c1-f7bb-4025-a09a-948e0d5d188f', // Approved second pilot: San Esteban.
]);

export function usesBrotherhoodReading(entityId) {
  return BROTHERHOOD_READING_COHORT.includes(entityId);
}