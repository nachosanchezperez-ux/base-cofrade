function identityValues(item = {}) {
  return [item.id, item.key].filter(Boolean).map(String)
}

export function buildComplementaryHomeTemporal(temporal, coveredItems = []) {
  if (!temporal) return null

  const covered = new Set(
    (Array.isArray(coveredItems) ? coveredItems : [])
      .flatMap(identityValues)
  )

  if (!covered.size) return temporal

  const candidates = (Array.isArray(temporal.remainingTodayItems) ? temporal.remainingTodayItems : [])
    .filter((item) => identityValues(item).every((value) => !covered.has(value)))

  if (!candidates.length) return null

  return {
    ...temporal,
    mode: 'complement',
    eyebrow: 'También ocurre hoy',
    title: 'Qué más ocurre hoy',
    description: 'Además de las salidas que ya están en la calle, estos otros actos siguen formando parte de la jornada.',
    href: '/agenda-cofrade/hoy',
    focusItems: candidates.slice(0, 4),
  }
}
