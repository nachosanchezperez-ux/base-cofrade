// Editorial classification for the brotherhood profile. Operational outing records
// stay intact so agenda, routes, music and existing public guides keep working.
const normalized = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export function isExtraordinaryEvent(outing) {
  const character = normalized(outing?.caracter)
  return ['extraordinaria', 'extraordinary'].includes(character)
    || /\bextraordinari[ao]\b/.test(normalized(outing?.tipo))
}

export function classifyBrotherhoodOutings(outings = [], chronology = []) {
  const salidas = outings.filter(item => !isExtraordinaryEvent(item))
  const acontecimientosSalidas = outings.filter(isExtraordinaryEvent)
  const cronologia = chronology.map(item => ({ ...item }))
  for (const outing of acontecimientosSalidas) {
    const year = String(outing.fecha || '').slice(0, 4)
      || String(outing.momento || '').match(/\b(?:18|19|20)\d{2}\b/)?.[0] || ''
    const href = outing.slug ? `/extraordinarias/${outing.slug}` : ''
    const existing = cronologia.find(item => item.salidaId === outing.id || (
      year && String(item.fecha) === year && normalized(item.titulo) === normalized(outing.nombre)
    ))
    if (existing) {
      existing.salidaId = outing.id
      if (href) existing.href = href
      continue
    }
    cronologia.push({
      id: `outing-event:${outing.id}`,
      salidaId: outing.id,
      fecha: year,
      titulo: outing.nombre,
      texto: [outing.momento, outing.titulares].filter(Boolean).join(' · '),
      estado: ({ announced: 'Acontecimiento anunciado', cancelled: 'Acontecimiento cancelado', postponed: 'Acontecimiento aplazado' })[outing.estado] || 'Salida extraordinaria',
      href,
    })
  }
  cronologia.sort((a, b) => String(a.fecha || '').localeCompare(String(b.fecha || ''), 'es', { numeric: true }))
  return { salidas, acontecimientosSalidas, cronologia }
}
