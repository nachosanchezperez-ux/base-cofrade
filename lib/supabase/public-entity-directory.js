import 'server-only'

import { HOLY_WEEK_DAYS, MONTHS, normalizeDirectoryValue } from '@/lib/brotherhood-directory'
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

function processionCalendar(item) {
  const types = item.tipos || []
  const processionDay = String(item.diaSalida || '')
  const normalizedDay = normalizeDirectoryValue(processionDay)
  const isPenitencia = types.some((type) => normalizeDirectoryValue(type) === 'penitencia')
  const isGloria = types.some((type) => normalizeDirectoryValue(type) === 'gloria')

  const holyWeekDay = isPenitencia
    ? HOLY_WEEK_DAYS.find((day) => normalizedDay.includes(normalizeDirectoryValue(day))) || ''
    : ''
  const gloryMonth = isGloria
    ? MONTHS.find((month) => normalizedDay.includes(normalizeDirectoryValue(month))) || ''
    : ''

  return { holyWeekDay, gloryMonth }
}

function normalizeBrotherhood(item) {
  const types = item.tipos || []
  const calendar = processionCalendar(item)

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
    brotherhoodTypes: types,
    holyWeekDay: calendar.holyWeekDay,
    gloryMonth: calendar.gloryMonth,
    context: joinContext([item.localidad, item.diaSalida]),
    relation: item.sede ? `Sede · ${item.sede}` : '',
    mediaPath: item.escudoPath || '',
    mediaKind: 'crest',
    keywords: [item.nombreOficial, item.sede, item.barrio, item.diaSalida, calendar.holyWeekDay, calendar.gloryMonth, ...types].filter(Boolean),
  }
}

function normalizeImage(item, brotherhood) {
  const authors = compactNames(item.authorNames)
  const types = brotherhood?.tipos || []
  const calendar = brotherhood ? processionCalendar(brotherhood) : { holyWeekDay: '', gloryMonth: '' }

  return {
    id: item.id,
    kind: 'image',
    name: item.name,
    officialName: item.name,
    href: item.href,
    label: 'Imagen',
    subtype: item.type || 'Imagen',
    subtypeValues: [item.type || 'Imagen'],
    municipality: item.municipality || brotherhood?.localidad || '',
    brotherhoodTypes: types,
    holyWeekDay: calendar.holyWeekDay,
    gloryMonth: calendar.gloryMonth,
    context: joinContext([item.brotherhoodName, item.municipality || brotherhood?.localidad]),
    relation: authors ? `Autoría · ${authors}` : (item.place ? `Ubicación · ${item.place}` : ''),
    mediaPath: item.coverPath || '',
    mediaAlt: item.coverAlt || '',
    mediaKind: 'photo',
    keywords: [item.summary, item.brotherhoodName, item.place, item.date, calendar.holyWeekDay, calendar.gloryMonth, ...types, ...item.authorNames].filter(Boolean),
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
  const style = item.type || 'Formación musical'

  return {
    id: item.id,
    kind: 'band',
    name: item.popularName,
    officialName: item.officialName,
    href: `/bandas/${item.slug}`,
    label: 'Banda',
    subtype: style,
    subtypeValues: [style],
    bandStyle: style,
    municipality: item.municipality || '',
    context: joinContext([item.municipality, item.foundation ? `Desde ${item.foundation}` : '']),
    relation: item.linkedBrotherhood ? `Vinculada a · ${item.linkedBrotherhood}` : '',
    mediaPath: item.logoPath || '',
    mediaKind: 'logo',
    primaryColor: item.primaryColor || '',
    secondaryColor: item.secondaryColor || '',
    keywords: [item.officialName, item.officialShortName, item.summary, item.linkedBrotherhood, style].filter(Boolean),
  }
}

export async function getPublicEntityDirectory() {
  const [brotherhoods, images, steps, bands] = await Promise.all([
    getHermandadesDirectory(),
    getImagesDirectory(),
    getStepsDirectory(),
    getPublicBandsDirectory(),
  ])

  const brotherhoodBySlug = new Map(brotherhoods.map((item) => [item.slug, item]))

  return [
    ...brotherhoods.map(normalizeBrotherhood),
    ...images.map((item) => normalizeImage(item, brotherhoodBySlug.get(item.brotherhoodSlug))),
    ...steps.map(normalizeStep),
    ...bands.map(normalizeBand),
  ]
}
