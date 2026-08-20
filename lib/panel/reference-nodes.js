export function mergeEditableEntities(entities, subtypeRows, subtypeKey, defaults = {}) {
  const subtypeById = new Map(subtypeRows.map((row) => [row.entity_id, row]))

  return entities.map((entity) => {
    const subtype = subtypeById.get(entity.id)

    return {
      ...entity,
      ...defaults,
      ...(subtype || {}),
      isEditable: Boolean(subtype),
      referenceReason: subtype ? '' : `Falta la ficha especializada de ${subtypeKey}`,
    }
  })
}
