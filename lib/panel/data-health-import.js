export function buildHealthImportProposal(entity) {
  if (!entity || entity.status !== 'published' || !entity.id || !entity.name) return null

  if (entity.entity_type === 'brotherhood') {
    return {
      label: `Salud · Consolidar ${entity.name}`,
      records: [{
        table: 'brotherhoods',
        operation: 'upsert',
        on_conflict: 'entity_id',
        data: {
          entity_id: entity.id,
          official_name: entity.name,
          popular_name: entity.name,
        },
      }],
    }
  }

  if (entity.entity_type === 'step') {
    return {
      label: `Salud · Consolidar ${entity.name}`,
      records: [{
        table: 'steps',
        operation: 'upsert',
        on_conflict: 'entity_id',
        data: { entity_id: entity.id },
      }],
    }
  }

  return null
}
