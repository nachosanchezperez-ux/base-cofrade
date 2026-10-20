// «Marcha del día» en la portada: la grabación solo se muestra cuando añade algo.
// Muchas grabaciones sin disco se titulan «<marcha> · <banda>», que repite lo que
// ya dicen el título y la línea «Interpretación».

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function informativeReleaseTitle(releaseTitle, marchTitle, bandName) {
  const release = normalize(releaseTitle)
  if (!release) return ''
  const title = normalize(marchTitle)
  const band = normalize(bandName)
  const redundant = new Set([title, `${title} ${band}`.trim(), `${band} ${title}`.trim()])
  return redundant.has(release) ? '' : String(releaseTitle).trim()
}
