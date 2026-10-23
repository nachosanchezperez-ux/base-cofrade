// «Tira del hilo» de una Hermandad: una cadena verificable de relaciones ya
// publicadas (Hermandad → titular → paso → banda actual → marcha → autor).
// Política pura: solo encadena relaciones presentes en los datos; nunca infiere.
// Cada eslabón es opcional a partir del paso y la cadena se corta en el primero
// que falte, para no saltar relaciones.

function text(value) {
  return String(value ?? '').trim()
}

function stepImages(step, titulars) {
  const ids = new Set(step?.imagenes || [])
  const detail = (step?.imagenesDetalle || []).map((item) => item.id)
  detail.forEach((id) => ids.add(id))
  return titulars.filter((titular) => ids.has(titular.id))
}

function marchForBand(marches, bandSlug) {
  if (!bandSlug) return null
  // Preferimos la marcha estrenada por la banda; si no, la grabada por ella.
  const related = marches.filter((march) => march?.slug && march.bandRelation?.slug === bandSlug)
  return related.find((march) => march.bandRelation.label === 'Estrenada por') || related[0] || null
}

export function brotherhoodThread({ brotherhood = {}, titulars = [], steps = [], accompaniments = [], marches = [] } = {}) {
  const candidates = []
  const publishedTitulars = titulars.filter((item) => item?.slug && item.fichaDisponible)

  for (const step of steps) {
    if (!step?.slug || !step.fichaDisponible) continue
    const titular = stepImages(step, publishedTitulars).find((item) => item.rol !== 'secundaria')
    if (!titular) continue

    const nodes = [
      { kind: 'brotherhood', label: text(brotherhood.nombrePopular || brotherhood.nombreOficial), href: brotherhood.slug ? `/hermandades/${brotherhood.slug}` : '', current: true },
      { kind: 'image', relation: 'Titular', label: text(titular.nombre), href: `/imagenes/${titular.slug}`, detail: [text(titular.autor), text(titular.fecha)].filter(Boolean).join(' · ') },
      { kind: 'step', relation: 'Procesiona en', label: text(step.nombre), href: `/pasos/${step.slug}` },
    ]

    const bands = accompaniments.filter((item) => item?.pasoId === step.id && item.bandaSlug && text(item.banda))
    let best = null
    for (const band of bands) {
      const march = marchForBand(marches, band.bandaSlug)
      const score = march ? (march.composers?.some((item) => item.slug) ? 3 : 2) : 1
      if (!best || score > best.score) best = { band, march, score }
    }

    if (best) {
      nodes.push({ kind: 'band', relation: 'Lo acompaña', label: text(best.band.banda), href: `/bandas/${best.band.bandaSlug}`, detail: text(best.band.periodo) })
      if (best.march) {
        nodes.push({
          kind: 'march',
          relation: `Marcha dedicada · ${best.march.bandRelation.label.toLowerCase()} esta banda`,
          label: text(best.march.name),
          href: `/marchas/${best.march.slug}`,
          detail: text(best.march.year),
        })
        const composer = best.march.composers?.find((item) => item.slug && text(item.name))
        if (composer) nodes.push({ kind: 'author', relation: 'Compuesta por', label: text(composer.name), href: `/autores/${composer.slug}` })
      }
    }

    candidates.push(nodes)
  }

  // La cadena más larga; a igualdad, el orden procesional de los pasos.
  return candidates.reduce((best, nodes) => (nodes.length > best.length ? nodes : best), [])
}

// Historia por capítulos: lo celebrado es historia; lo anunciado sigue siendo
// agenda y actualidad hasta que ocurra.
export function splitHistory(items = [], today = '') {
  const year = Number(String(today).slice(0, 4)) || new Date().getUTCFullYear()
  const past = []
  const upcoming = []
  for (const item of items) {
    const itemYear = Number(String(item?.fecha || '').match(/\d{4}/)?.[0])
    const announced = /anunciad|aplazad/i.test(text(item?.estado))
    if (announced || (itemYear && itemYear > year)) upcoming.push(item)
    else past.push(item)
  }
  return { past, upcoming }
}

// Entradilla de la historia: primer párrafo visible y el resto plegado.
export function historyParagraphs(value = '') {
  const paragraphs = String(value || '').split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)
  return { lead: paragraphs[0] || '', rest: paragraphs.slice(1) }
}
