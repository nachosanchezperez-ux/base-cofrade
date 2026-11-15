// Dedicatorias de la ficha de Marcha, sin repeticiones. Módulo puro.
//
// Es habitual que una marcha esté dedicada a la vez a una Imagen y a su propia
// Hermandad. Cuando ambas se llaman igual («Nuestra Señora del Amparo»), la
// ficha mostraba dos «Dedicada a» idénticos. Ahora se queda una sola dedicatoria,
// la de la Imagen, con su Hermandad debajo por su nombre popular («El Amparo»).
// Una Hermandad sin Imagen dedicataria propia se muestra con su nombre popular.

function sameDate(first, second) {
  return String(first.date || '') === String(second.date || '')
}

export function mergeMarchDedications(items = []) {
  const list = items.filter(Boolean)
  const merged = new Set()
  const result = list.map((item) => ({ ...item }))

  for (const brotherhood of result) {
    if (brotherhood.kind !== 'brotherhood') continue
    const image = result.find((item) => (
      item.kind === 'image'
      && !item.brotherhood
      && (item.ownerIds || []).includes(brotherhood.id)
      && sameDate(item, brotherhood)
      && !brotherhood.text
    ))
    if (!image) continue
    image.brotherhood = { name: brotherhood.popularName || brotherhood.name, href: brotherhood.href || '' }
    merged.add(brotherhood)
  }

  return result
    .filter((item) => !merged.has(item))
    .map(({ kind, ownerIds, popularName, ...item }) => (
      kind === 'brotherhood' && popularName ? { ...item, name: popularName } : item
    ))
}
