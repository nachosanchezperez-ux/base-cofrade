import 'server-only'
import { agendaEventDetailHref } from '@/lib/agenda-event-url-policy'

import { unstable_cache } from 'next/cache'
import { getConcertEventDirectory } from '@/lib/supabase/concert-events'
import { getGeneralPublicOutings } from '@/lib/supabase/general-public-outings'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getKissingDevotions } from '@/lib/supabase/kissing-devotions'
import { getRosaryOutings } from '@/lib/supabase/rosary-outings'
import { withAgendaOutingContext } from '@/lib/supabase/agenda-outing-context'
import { withAgendaRelations } from '@/lib/supabase/agenda-relations'
import { withAgendaPhotos } from '@/lib/supabase/agenda-photos'
import { pickAgendaPhoto } from '@/lib/agenda-event-photo'
import { withProcessionLiveState } from '@/lib/procession-live-status'
import { agendaMunicipalityHref } from '@/lib/agenda-relations'

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function dateInfo(value, supplied = {}) {
  if (!value) return { day: '—', month: 'FECHA', year: '', label: 'Fecha por confirmar', weekdayLabel: 'Fecha por confirmar', monthKey: 'sin-fecha', monthLabel: 'FECHA POR CONFIRMAR' }

  const date = new Date(`${value}T12:00:00Z`)
  const format = (options) => new Intl.DateTimeFormat('es-ES', { ...options, timeZone: 'Europe/Madrid' }).format(date)
  const weekday = supplied.weekdayLabel || format({ weekday: 'long', day: 'numeric', month: 'long' })
  const monthLong = format({ month: 'long' })
  return {
    day: supplied.day || format({ day: '2-digit' }),
    month: supplied.month || format({ month: 'short' }).replace('.', '').toUpperCase(),
    year: supplied.year || format({ year: 'numeric' }),
    label: supplied.label || format({ day: 'numeric', month: 'long', year: 'numeric' }),
    weekdayLabel: `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}`,
    monthKey: value.slice(0, 7),
    monthLabel: `${monthLong} ${format({ year: 'numeric' })}`.toLocaleUpperCase('es'),
  }
}

function shared(item, category) {
  const date = item.date || ''
  const info = dateInfo(date, item.dateInfo || item.dateParts || {})
  // Foto del acto o de su titular (lib/agenda-event-photo.js); si no hay, escudo.
  const photo = pickAgendaPhoto(item)
  const heroImagePath = photo?.path || ''
  const crestPath = item.crestPath || ''
  const imagePath = heroImagePath || crestPath
  const imageFallbackPath = heroImagePath && crestPath && heroImagePath !== crestPath ? crestPath : ''
  const imageKind = heroImagePath ? (photo.fit === 'contain' ? 'poster' : 'photo') : crestPath ? 'crest' : 'fallback'
  const organizer = item.brotherhoodName || ''
  return {
    id: item.id, key: `${category}:${item.id}`, category, date, endDate: item.endDate || item.returnDate || '', dateInfo: info,
    monthKey: info.monthKey, monthLabel: info.monthLabel,
    municipality: item.municipality || '',
    municipalityHref: agendaMunicipalityHref(item.municipality),
    scope: item.scope || (String(item.municipality || '').toLocaleLowerCase('es') === 'sevilla' ? 'capital' : 'province'),
    organizer, organizerHref: item.brotherhoodHref || '',
    title: item.title || 'Acto cofrade',
    imagePath,
    imageFallbackPath,
    imageKind,
    imageAlt: heroImagePath
      ? (photo.alt || item.title || '')
      : crestPath
        ? `${organizer} · identidad gráfica`
        : '',
    // La foto, con su origen (acto o titular), encuadre y crédito.
    photo: photo || null,
    crestPath,
    routeText: item.routeSummary || '',
    summary: item.description || item.summary || '',
    schedule: item.schedule || [],
    music: item.music || [],
    // Hilo (#agenda): imágenes y pasos confirmados en la base.
    relations: Array.isArray(item.relations) ? item.relations : [],
    place: item.place || item.origin || '', timeText: item.timeText || '',
    daySchedules: Array.isArray(item.daySchedules) ? item.daySchedules : [],
    eventStatus: item.eventStatus || 'announced', isCancelled: Boolean(item.isCancelled),
    isUpcoming: Boolean(item.isUpcoming) && !item.isCancelled,
    isPast: Boolean(item.isPast || item.isCelebrated || item.isHeld),
  }
}

function normalizeRosary(item) {
  return { ...shared(item, 'rosaries'), categoryLabel: item.mode || 'Rosario público', categoryName: 'Rosarios', categoryHref: '/agenda-cofrade#agenda', startTime: item.departureTime || '', endTime: item.returnTime || '', href: item.detailHref || item.brotherhoodHref || '/agenda-cofrade', actionLabel: 'Ver rosario', isExtraordinary: item.isExtraordinary }
}

function normalizeExtraordinary(item) {
  const isTransfer = String(item.outingType || item.title || '').toLocaleLowerCase('es').includes('traslado')
  return { ...shared(item, isTransfer ? 'transfers' : 'processions'), categoryLabel: isTransfer ? 'Traslado' : (item.outingType || 'Procesión extraordinaria'), categoryName: isTransfer ? 'Traslados' : 'Procesiones', categoryHref: '/extraordinarias', startTime: item.departureTime || '', endTime: item.returnTime || '', href: agendaEventDetailHref(item, 'extraordinarias'), actionLabel: 'Ver salida', isExtraordinary: true }
}

function normalizeGlory(item) {
  return { ...shared(item, 'processions'), categoryLabel: 'Procesión de Gloria', categoryName: 'Procesiones', categoryHref: '/procesiones-de-gloria', startTime: item.departureTime || '', endTime: item.returnTime || '', href: item.detailHref || '/procesiones-de-gloria', actionLabel: 'Ver procesión', isExtraordinary: false }
}

function normalizeDevotion(item) {
  return { ...shared(item, 'devotions'), categoryLabel: item.devotionType || 'Culto', categoryName: 'Cultos y besamanos', categoryHref: item.brotherhoodHref ? `${item.brotherhoodHref}#cultos` : '/hermandades', startTime: '', endTime: '', href: item.detailHref || item.brotherhoodHref || '/hermandades', actionLabel: 'Ver culto', isExtraordinary: false }
}

const GENERAL_OUTING_KIND = {
  romery: { category: 'romeries', label: 'Romería', name: 'Romerías', action: 'Ver romería' },
  // Traslados ordinarios: misma categoría que los extraordinarios.
  transfer: { category: 'transfers', label: 'Traslado', name: 'Traslados', action: 'Ver traslado' },
  procession: { category: 'processions', label: 'Procesión', name: 'Procesiones', action: 'Ver procesión' },
}

function normalizeGeneralOuting(item) {
  const kind = GENERAL_OUTING_KIND[item.kind] || GENERAL_OUTING_KIND.procession
  return {
    ...shared(item, kind.category),
    categoryLabel: kind.label,
    categoryName: kind.name,
    categoryHref: `/agenda-cofrade?categoria=${kind.category}#agenda`,
    startTime: item.departureTime || '',
    endTime: item.returnTime || '',
    href: item.detailHref || item.brotherhoodHref || '',
    actionLabel: kind.action,
    isExtraordinary: false,
  }
}

function normalizeConcert(item) {
  const bandNames = item.bands?.map((band) => band.name).filter(Boolean).join(' · ') || 'Banda por confirmar'
  const primaryBandHref = item.primaryBand?.href || ''
  const publicNotes = String(item.publicNotes || '').trim()
  const repertoireText = /^repertorio\s*:/i.test(publicNotes) ? publicNotes : ''
  return {
    ...shared({
      ...item,
      brotherhoodName: bandNames,
      brotherhoodHref: primaryBandHref,
      crestPath: item.imagePath || '',
      place: item.placeName || '',
    }, 'concerts'),
    categoryLabel: item.eventTypeLabel || 'Concierto',
    categoryName: 'Conciertos',
    categoryHref: '/agenda-cofrade?categoria=concerts#agenda',
    startTime: item.startTime || '',
    endTime: item.endTime || '',
    href: '',
    actionLabel: 'Ver banda',
    isExtraordinary: false,
    bands: item.bands || [],
    programs: item.programs || [],
    relatedBrotherhoodName: item.brotherhoodName || '',
    relatedBrotherhoodHref: item.brotherhoodHref || '',
    repertoireText,
  }
}

function compareAgendaItems(first, second) {
  if (!first.date && !second.date) return first.title.localeCompare(second.title, 'es')
  if (!first.date) return 1
  if (!second.date) return -1
  return `${first.date}T${first.startTime || '23:59'}`.localeCompare(`${second.date}T${second.startTime || '23:59'}`)
}

// Solo se almacena una lectura completa: un fallo no puede reemplazar la caché
// válida por una agenda vacía o parcial. revalidatePath('/agenda-cofrade') del
// Panel invalida estos datos al estar consumidos por la ruta.
const getCachedAgendaSources = unstable_cache(
  async () => withAgendaPhotos(await withAgendaRelations(await withAgendaOutingContext(await Promise.all([
    getRosaryOutings({ throwOnError: true }),
    getExtraordinaryDirectory({ throwOnError: true }),
    getGloryDirectory({ throwOnError: true }),
    getGeneralPublicOutings({ throwOnError: true }),
    getKissingDevotions({ throwOnError: true, allCults: true }),
    getConcertEventDirectory({ throwOnError: true }),
  ])))),
  ['hilo-cofrade-agenda-sources-v12-traslados'],
  { revalidate: 300 }
)

// Fuentes crudas de la Agenda, con la misma caché diaria que usa la propia
// Agenda. La Home las reutiliza para no repetir lecturas de las mismas salidas.
export async function getAgendaCofradeSources() {
  const [rosaries, extraordinary, glories, generalOutings, devotions, concerts] = await getCachedAgendaSources(madridDateKey())
  return { rosaries, extraordinary, glories, generalOutings, devotions, concerts }
}

export async function getAgendaCofrade() {
  // Los lectores calculan flags diarios: separar por día evita reutilizar los
  // de ayer. El estado horario se calcula después de la caché, por petición.
  const [rosaries, extraordinary, glories, generalOutings, devotions, concerts] = await getCachedAgendaSources(madridDateKey())
  const rosaryIds = new Set(rosaries.map((item) => item.id))
  const now = new Date()
  const items = [
    ...rosaries.map(normalizeRosary),
    ...extraordinary.filter((item) => !rosaryIds.has(item.id)).map(normalizeExtraordinary),
    ...glories.map(normalizeGlory),
    ...generalOutings.map(normalizeGeneralOuting),
    ...devotions.map(normalizeDevotion),
    ...concerts.map(normalizeConcert),
  ]
    .map((item) => {
      if (!['processions', 'transfers', 'rosaries'].includes(item.category)) return item
      const liveItem = withProcessionLiveState(item, now)
      return liveItem.liveState.isLive
        ? { ...liveItem, isUpcoming: true, isPast: false }
        : liveItem
    })
    .sort(compareAgendaItems)
  return { today: madridDateKey(now), items }
}
