import 'server-only'

import { HOLY_WEEK_DAYS, MONTHS, normalizeDirectoryValue } from '@/lib/brotherhood-directory'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { getPublicBandsDirectory } from '@/lib/supabase/bands-directory-public'
import { getImagesDirectory, getStepsDirectory } from '@/lib/supabase/directories'
import { publicText } from '@/lib/supabase/public-entity-page'

function compactNames(values = [], limit = 2) {
  const names = [...new Set(values.map(publicText).filter(Boolean))]
  if (!names.length) return ''
  if (names.length <= limit) return names.join(', ')
  return `${names.slice(0, limit).join(', ')} · +${names.length - limit}`
}

function joinContext(values = []) {
  return values.map(publicText).filter(Boolean).join(' · ')
}

function publicMunicipalityLabel(value) {
  const municipality = publicText(value)
  if (['sevilla', 'sevilla capital'].includes(normalizeDirectoryValue(municipality))) return 'Sevilla capital'
  return municipality
}

function publicImageType(value) {
  const type = publicText(value) || 'Imagen'
  const normalizedType = normalizeDirectoryValue(type).replace(/[·-]+/g, ' ').replace(/\s+/g, ' ')
  if (['virgen gloria', 'virgen gloriosa', 'virgen de gloria'].includes(normalizedType)) {
    return 'Virgen de Gloria'
  }
  return type
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
  const types = (item.tipos || []).map(publicText).filter(Boolean)
  const calendar = processionCalendar(item)
  const municipality = publicMunicipalityLabel(item.localidad)
  const processionDay = publicText(item.diaSalida)
  const seat = publicText(item.sede)

  return {
    id: item.id,
    kind: 'brotherhood',
    name: publicText(item.nombrePopular),
    officialName: publicText(item.nombreOficial),
    href: `/hermandades/${item.slug}`,
    label: 'Hermandad',
    subtype: types.join(' · ') || 'Hermandad',
    subtypeValues: types,
    municipality,
    brotherhoodTypes: types,
    holyWeekDay: calendar.holyWeekDay,
    gloryMonth: calendar.gloryMonth,
    context: joinContext([municipality, processionDay]),
    relation: seat ? `Sede · ${seat}` : '',
    mediaPath: item.escudoPath || '',
    mediaKind: 'crest',
    keywords: [item.nombreOficial, seat, item.barrio, processionDay, calendar.holyWeekDay, calendar.gloryMonth, ...types].map(publicText).filter(Boolean),
  }
}

function normalizeImage(item, brotherhood) {
  const authors = compactNames(item.authorNames)
  const types = brotherhood?.tipos || []
  const calendar = brotherhood ? processionCalendar(brotherhood) : { holyWeekDay: '', gloryMonth: '' }
  const imageType = publicImageType(item.type)
  const normalizedImageType = normalizeDirectoryValue(imageType)
  const explicitGloryImage = normalizedImageType.includes('gloria')
  const parentHasGlory = types.some((type) => normalizeDirectoryValue(type) === 'gloria')
  const parentHasPenitencia = types.some((type) => normalizeDirectoryValue(type) === 'penitencia')
  const parentIsOnlyGlory = parentHasGlory && !parentHasPenitencia
  const holyWeekDay = explicitGloryImage || parentIsOnlyGlory ? '' : calendar.holyWeekDay
  const gloryMonth = explicitGloryImage || parentIsOnlyGlory ? calendar.gloryMonth : ''
  const municipality = publicMunicipalityLabel(item.municipality || brotherhood?.localidad)
  const brotherhoodName = publicText(item.brotherhoodName)
  const place = publicText(item.place)

  return {
    id: item.id,
    kind: 'image',
    name: publicText(item.name),
    officialName: publicText(item.name),
    href: item.href,
    label: 'Imagen',
    subtype: imageType,
    subtypeValues: [imageType],
    municipality,
    brotherhoodTypes: types,
    holyWeekDay,
    gloryMonth,
    context: joinContext([brotherhoodName, municipality]),
    relation: authors ? `Autoría · ${authors}` : (place ? `Ubicación · ${place}` : ''),
    mediaPath: item.coverPath || '',
    mediaAlt: item.coverAlt || '',
    mediaKind: 'photo',
    keywords: [item.summary, brotherhoodName, place, item.date, holyWeekDay, gloryMonth, ...types, ...item.authorNames].map(publicText).filter(Boolean),
  }
}

function normalizeStep(item) {
  const images = compactNames(item.imageNames)
  const authors = compactNames(item.authorNames)
  const municipality = publicMunicipalityLabel(item.municipality)
  const brotherhoodName = publicText(item.brotherhoodName)
  const type = publicText(item.type) || 'Paso procesional'

  return {
    id: item.id,
    kind: 'step',
    name: publicText(item.name),
    officialName: publicText(item.name),
    href: item.href,
    label: 'Paso',
    subtype: type,
    subtypeValues: [type],
    municipality,
    context: joinContext([brotherhoodName, municipality]),
    relation: images ? `Imágenes · ${images}` : (authors ? `Autoría/taller · ${authors}` : ''),
    mediaPath: item.coverPath || '',
    mediaAlt: item.coverAlt || '',
    mediaKind: 'photo',
    keywords: [item.summary, brotherhoodName, item.style, item.materials, item.date, ...item.imageNames, ...item.authorNames, ...item.disciplines].map(publicText).filter(Boolean),
  }
}

function normalizeBand(item) {
  const style = publicText(item.type) || 'Formación musical'
  const municipality = publicMunicipalityLabel(item.municipality)
  const linkedBrotherhood = publicText(item.linkedBrotherhood)

  return {
    id: item.id,
    kind: 'band',
    name: publicText(item.popularName),
    officialName: publicText(item.officialName),
    href: `/bandas/${item.slug}`,
    label: 'Banda',
    subtype: style,
    subtypeValues: [style],
    bandStyle: style,
    municipality,
    context: joinContext([municipality, publicText(item.foundation) ? `Desde ${publicText(item.foundation)}` : '']),
    relation: linkedBrotherhood ? `Vinculada a · ${linkedBrotherhood}` : '',
    mediaPath: item.logoPath || '',
    mediaKind: 'logo',
    primaryColor: item.primaryColor || '',
    secondaryColor: item.secondaryColor || '',
    keywords: [item.officialName, item.officialShortName, item.summary, linkedBrotherhood, style].map(publicText).filter(Boolean),
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
