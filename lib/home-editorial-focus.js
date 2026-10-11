export const HOME_EDITORIAL_FOCUSES = [
  {
    id: 'regla-panaderos-425',
    outingId: 'f56e21cf-098f-4fc8-a956-bec1b6ec1ac9',
    startsOn: '2026-10-02',
    endsOn: '2026-10-04',
    priority: 100,
  },
  {
    id: 'montellano-dolores-300',
    outingId: '38e2190f-b777-4f80-bcf4-1b81f7a73a8b',
    startsOn: '2026-10-11',
    endsOn: '2026-10-12',
    priority: 100,
  },
  {
    id: 'padre-pio-divina-gracia-25',
    outingId: 'e96dbd17-b00f-4f66-9c01-8e75b5b95c57',
    startsOn: '2026-10-11',
    endsOn: '2026-10-12',
    priority: 90,
  },
]

export function getHomeEditorialFocuses(outings = [], dateKey = '') {
  const active = HOME_EDITORIAL_FOCUSES
    .filter((focus) => (
      focus.outingId
      && dateKey
      && dateKey >= focus.startsOn
      && dateKey <= focus.endsOn
    ))
    .sort((a, b) => b.priority - a.priority)

  return active.flatMap((focus) => {
    const outing = outings.find((item) => item?.id === focus.outingId && item.liveState?.state !== 'done')
    return outing ? [{ focus, outing }] : []
  })
}

export function getHomeEditorialFocus(outings = [], dateKey = '') {
  return getHomeEditorialFocuses(outings, dateKey)[0] || null
}
