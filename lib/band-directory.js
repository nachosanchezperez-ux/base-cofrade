const BAND_LOGO_PRESENTATION = {
  'banda-del-sol': { mode: 'integrated', background: 'secondary' },
  'sangre-de-san-benito': { mode: 'integrated', background: 'primary' },
  'banda-de-musica-del-maestro-tejera': { mode: 'integrated', background: 'secondary' },
  'banda-municipal-de-musica-de-la-puebla-del-rio': { mode: 'contained', color: '#FCEBEC' },
  'banda-de-musica-nuestra-senora-de-la-soledad-cantillana': { mode: 'integrated', background: 'secondary' },
}

function compareLabels(first = '', second = '') {
  return String(first).localeCompare(String(second), 'es', { sensitivity: 'base' })
}

function logoPresentationFor(band) {
  const presentation = BAND_LOGO_PRESENTATION[band.slug]
  if (!presentation) return { mode: 'contained', backgroundColor: '' }

  const backgroundColor = presentation.color
    || (presentation.background === 'secondary'
      ? band.secondaryColor
      : presentation.background === 'primary'
        ? band.primaryColor
        : '')

  return {
    mode: presentation.mode,
    backgroundColor,
  }
}

export function bandDirectoryItems(bands = []) {
  return bands.map((band) => {
    const logoPresentation = logoPresentationFor(band)

    return {
      id: band.id,
      name: band.popularName,
      officialName: band.officialName,
      href: `/bandas/${band.slug}`,
      type: band.type,
      typeSlug: band.typeSlug,
      municipality: band.municipality,
      municipalitySlug: band.municipalitySlug,
      foundation: band.foundation,
      linkedBrotherhood: band.linkedBrotherhood,
      logoPath: band.logoPath,
      logoPresentationMode: logoPresentation.mode,
      logoBackgroundColor: logoPresentation.backgroundColor,
      primaryColor: band.primaryColor,
      secondaryColor: band.secondaryColor,
      keywords: [band.officialShortName, band.summary, band.linkedBrotherhood].filter(Boolean),
    }
  })
}

export function bandDirectoryFacetPath(kind, slug) {
  if (!slug || !['tipo', 'localidad'].includes(kind)) return ''
  return `/bandas/${kind}/${slug}`
}

export function bandDirectoryFacets(bands = []) {
  const group = (slugKey, labelKey, kind) => [...new Map(
    bands
      .filter((band) => band[slugKey] && band[labelKey])
      .map((band) => [band[slugKey], {
        slug: band[slugKey],
        label: band[labelKey],
        href: bandDirectoryFacetPath(kind, band[slugKey]),
        count: bands.filter((candidate) => candidate[slugKey] === band[slugKey]).length,
      }])
  ).values()].sort((first, second) => compareLabels(first.label, second.label))

  return {
    types: group('typeSlug', 'type', 'tipo'),
    municipalities: group('municipalitySlug', 'municipality', 'localidad'),
  }
}

export function bandsForDirectoryFacet(bands = [], kind, slug) {
  const key = kind === 'tipo' ? 'typeSlug' : kind === 'localidad' ? 'municipalitySlug' : ''
  return key ? bands.filter((band) => band[key] === slug) : []
}
