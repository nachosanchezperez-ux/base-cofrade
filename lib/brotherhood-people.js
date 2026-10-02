export function relationPeriod(item = {}) {
  const from = String(item.date_from_text || item.date_from?.slice(0, 4) || '').trim()
  const to = String(item.date_to_text || item.date_to?.slice(0, 4) || '').trim()
  if (from && to) return `${from.match(/\b(?:19|20)\d{2}\b/g)?.at(-1) || from}–${to.match(/\b(?:19|20)\d{2}\b/g)?.at(-1) || to}`
  if (from) return /^(desde|vigente|actual|documentad)/i.test(from) ? from : `Desde ${from}`
  if (to) return /^hasta\b/i.test(to) ? to : `Hasta ${to}`
  return ''
}

// Count people by entity identity, retaining every distinct image/period link.
export function groupBrotherhoodDressers(relations = []) {
  const people = new Map()
  for (const relation of relations) {
    const key = relation.agentId || relation.slug || relation.id
    if (!people.has(key)) people.set(key, { ...relation, images: [] })
    const person = people.get(key)
    if (!person.images.some(image => image.imageId === relation.imageId && image.period === relation.period)) {
      person.images.push(relation)
    }
  }
  return [...people.values()].map(person => ({
    ...person,
    commonPeriod: new Set(person.images.map(image => image.period)).size === 1 ? person.images[0].period : '',
  }))
}
