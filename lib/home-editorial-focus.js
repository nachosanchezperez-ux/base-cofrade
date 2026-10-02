export const HOME_EDITORIAL_FOCUSES = [
  {
    id: 'regla-panaderos-425',
    outingId: 'f56e21cf-098f-4fc8-a956-bec1b6ec1ac9',
    startsOn: '2026-10-02',
    endsOn: '2026-10-04',
    priority: 100,
  },
]

export function getHomeEditorialFocus(outings = [], dateKey = '') {
  const active = HOME_EDITORIAL_FOCUSES
    .filter((focus) => (
      focus.outingId
      && dateKey
      && dateKey >= focus.startsOn
      && dateKey <= focus.endsOn
    ))
    .sort((a, b) => b.priority - a.priority)

  for (const focus of active) {
    const outing = outings.find((item) => item?.id === focus.outingId)
    if (outing) return { focus, outing }
  }

  return null
}
