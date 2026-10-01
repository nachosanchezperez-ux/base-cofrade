// Pure presentation policy. All records remain in the server-rendered catalog.
export function representativeHistory(items = []) {
  if (items.length <= 5) return items
  const selected = new Set([0, items.length - 1])
  const themes = [
    /fusi[oó]n|transformaci[oó]n|reorganiz|incorporaci[oó]n|nuev[ao].*(titular|imagen)|sustituci[oó]n/i,
    /primera salida|consolid|reglas|aprobaci[oó]n|erecci[oó]n/i,
    /centenario|coronaci[oó]n|aniversario|restauraci[oó]n/i,
  ]
  for (const theme of themes) {
    const candidates = items.map((item, index) => ({ item, index }))
      .filter(({ item, index }) => !selected.has(index) && theme.test(`${item.titulo} ${item.texto}`))
      .sort((a, b) => Math.min(...[...selected].map(i => Math.abs(b.index - i))) - Math.min(...[...selected].map(i => Math.abs(a.index - i))))
    if (candidates.length) selected.add(candidates[0].index)
  }
  while (selected.size < 5) {
    const next = items.map((_, index) => index).filter(i => !selected.has(i))
      .sort((a, b) => Math.min(...[...selected].map(i => Math.abs(b - i))) - Math.min(...[...selected].map(i => Math.abs(a - i))))[0]
    selected.add(next)
  }
  return [...selected].sort((a,b) => a-b).map(i => items[i])
}

export function nextBrotherhoodAppointment(agenda = [], outings = [], today = '', cults = []) {
  const cutoff = today || new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year:'numeric',month:'2-digit',day:'2-digit' }).format(new Date())
  const futureOutings = outings.filter(item => item.estado === 'announced' && item.fecha && item.fecha >= cutoff).map(item => ({
    key: `outing:${item.id}`, date: item.fecha, startTime: item.hora, title: item.nombre,
    categoryLabel: item.tipo, route: item.destino,
    href: item.slug ? (item.slug.startsWith('gloria/') ? `/procesiones-de-gloria/${item.slug.slice(7)}` : `/extraordinarias/${item.slug}`) : '#salidas',
  }))
  const futureCults = cults.filter(item => item.anunciada && item.fechaInicio && item.fechaInicio >= cutoff).map(item => ({
    key: `cult:${item.id}`, date: item.fechaInicio, title: item.nombre, categoryLabel: item.tipo,
    href: '#cultos',
  }))
  return [...agenda, ...futureOutings, ...futureCults].filter(item => item.date && item.date >= cutoff && !item.isCancelled)
    .sort((a,b) => `${a.date}T${a.startTime || '23:59'}`.localeCompare(`${b.date}T${b.startTime || '23:59'}`))[0] || null
}
