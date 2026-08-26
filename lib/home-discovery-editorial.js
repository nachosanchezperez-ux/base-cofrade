export function isEditorialHomeThread(row) {
  return Boolean(row?.activity_kind) && row.activity_kind !== 'entity_new'
}
