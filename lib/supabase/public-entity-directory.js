import 'server-only'

import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getPublicBandsDirectory } from '@/lib/supabase/bands-directory-public'
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories'

function compactNames(values = [], limit = 2) {
  const names = [...new Set(values.filter(Boolean))]
  if (!names.length) return ''
  if (names.length <= limit) return names.join(', ')
  return `${names.slice(0, limit).join(', ')} · +${names.length - limit}`
}

function joinContext(values = []) {
  return values.filter(Boolean).join(' · ')
}

function normalizeBrotherhood(item) {
  const types = item.tipos || []

  return {
    id: item.id,
    kind: 'brotherhood',
    name: item.nombrePopular,
    officialName: item.nombreOficial,
    href: `/hermandades/${item.slug}`,
    label: 'Hermandad',
    subtype: types.join(' · ') || 'Hermandad',
    subtypeValues: types,
    municipality: item.localidad || '',
    context: joinContext([item.localidad, item.diaSalida]),
    relation: item.sede ? `Sede · ${item.sede}` : '',
    mediaPath: item.escudoPath || '',
    mediaKind: 'crest',
    keywords: [item.nombreOficial, item.sede, item.barrio, item.diaSalida, ...types].filter(Boolean),
  }
}

function normalizeImage(item) {
  const authors = compactNames(item.authorNames)

  return {
    id: item.id,
    kind: 'image',
    name: item.name,
    officialName: item.name,
    href: item.href,
    label: 'Imagen',
    subtype: item.type || 'Imagen',
    subtypeValues: [item.type || 'Imagen'],
    municipality: item.municipality || '',
    context: joinContext([item.brotherhoodName, item.municipality]),
    relation: authors ? `Autoría · ${authors}` : (item.place ? `Ubicación · ${item.place}` : ''),
    mediaPath: item.coverPath || '',
    mediaAlt: item.coverAlt || '',
    mediaKind: 'photo',
    keywords: [item.summary, item.brotherhoodName, item.place, item.date, ...item.authorNames].filter(Boolean),
  }
}

function normalizeStep(item) {
  const images = compactNames(item.imageNames)
  const authors = compactNames(item.authorNames)

  return {
    id: item.id,
    kind: 'step',
    name: item.name,
    officialName: item.name,
    href: item.href,
    label: 'Paso',
    subtype: item.type || 'Paso procesional',
    subtypeValues: [item.type || 'Paso procesional'],
    municipality: item.municipality || '',
    context: joinContext([item.brotherhoodName, item.municipality]),
    relation: images ? `Imágenes · ${images}` : (authors ? `Autoría/taller · ${authors}` : ''),
    mediaPath: item.coverPath || '',
    mediaAlt: item.coverAlt || '',
    mediaKind: 'photo',
    keywords: [item.summary, item.brotherhoodName, item.style, item.materials, item.date, ...item.imageNames, ...item.authorNames, ...item.disciplines].filter(Boolean),
  }
}

function normalizeBand(item) {
  return {
    id: item.id,
    kind: 'band',
    name: item.popularName,
    officialName: item.officialName,
    href: `/bandas/${item.slug}`,
    label: 'Banda',
    subtype: item.type || 'Formación musical',
    subtypeValues: [item.type || 'Formación musical'],
    municipality: item.municipality || '',
    context: joinContext([item.municipality, item.foundation ? `Desde ${item.foundation}` : '']),
    relation: item.linkedBrotherhood ? `Vinculada a · ${item.linkedBrotherhood}` : '',
    mediaPath: item.logoPath || '',
    mediaKind: 'logo',
    primaryColor: item.primaryColor || '',
    secondaryColor: item.secondaryColor || '',
    keywords: [item.officialName, item.officialShortName, item.summary, item.linkedBrotherhood, item.type].filter(Boolean),
  }
}

export async function getPublicEntityDirectory() {
  const [brotherhoods, images, steps, bands] = await Promise.all([
    getHermandadesDirectory(),
    getImagesDirectory(),
    getStepsDirectory(),
    getPublicBandsDirectory(),
  ])

  return [
    ...brotherhoods.map(normalizeBrotherhood),
    ...images.map(normalizeImage),
    ...steps.map(normalizeStep),
    ...bands.map(normalizeBand),
  ]
}
