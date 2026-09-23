import 'server-only'

import { getConcertEventDirectory } from '@/lib/supabase/concert-events'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getKissingDevotions } from '@/lib/supabase/kissing-devotions'
import { getRosaryOutings } from '@/lib/supabase/rosary-outings'
import { withProcessionLiveState } from '@/lib/procession-live-status'

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
  const heroImagePath = item.heroImagePath || ''
  const crestPath = item.crestPath || ''
  const imagePath = heroImagePath || crestPath
  const imageFallbackPath = heroImagePath && crestPath && heroImagePath !== crestPath ? crestPath : ''
  const imageKind = heroImagePath ? 'photo' : crestPath ? 'crest' : 'fallback'
  const organizer = item.brotherhoodName || 'Entidad organizadora'
  return {
    id: item.id, key: `${category}:${item.id}`, category, date, endDate: item.endDate || item.returnDate || '', dateInfo: info,
    monthKey: info.monthKey, monthLabel: info.monthLabel,
    municipality: item.municipality || '',
    scope: item.scope || (String(item.municipality || '').toLocaleLowerCase('es') === 'sevilla' ? 'capital' : 'province'),
    organizer, organizerHref: item.brotherhoodHref || '',
    title: item.title || 'Acto cofrade',
    imagePath,
    imageFallbackPath,
    imageKind,
    imageAlt: heroImagePath
      ? (item.heroImageAlt || item.title || '')
      : crestPath
        ? `${organizer} · identidad gráfica`
        : '',
    summary: item.routeSummary || item.description || item.summary || '',
    place: item.place || item.origin || '', timeText: item.timeText || '',
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
  return { ...shared(item, isTransfer ? 'transfers' : 'processions'), categoryLabel: isTransfer ? 'Traslado' : (item.outingType || 'Procesión extraordinaria'), categoryName: isTransfer ? 'Traslados' : 'Procesiones', categoryHref: '/extraordinarias', startTime: item.departureTime || '', endTime: item.returnTime || '', href: item.slug ? `/extraordinarias/${item.slug}` : item.anchorHref || '/extraordinarias', actionLabel: 'Ver salida', isExtraordinary: true }
}

function normalizeGlory(item) {
  return { ...shared(item, 'processions'), categoryLabel: 'Procesión de Gloria', categoryName: 'Procesiones', categoryHref: '/procesiones-de-gloria', startTime: item.departureTime || '', endTime: item.returnTime || '', href: item.detailHref || '/procesiones-de-gloria', actionLabel: 'Ver procesión', isExtraordinary: false }
}

function normalizeDevotion(item) {
  return { ...shared(item, 'devotions'), categoryLabel: item.devotionType || 'Besamanos', categoryName: 'Besamanos y besapiés', categoryHref: item.brotherhoodHref ? `${item.brotherhoodHref}#cultos` : '/hermandades', startTime: '', endTime: '', href: item.detailHref || item.brotherhoodHref || '/hermandades', actionLabel: 'Ver culto', isExtraordinary: false }
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

export async function getAgendaCofrade() {
  const [rosaries, extraordinary, glories, devotions, concerts] = await Promise.all([
    getRosaryOutings(), getExtraordinaryDirectory(), getGloryDirectory(), getKissingDevotions(), getConcertEventDirectory(),
  ])
  const rosaryIds = new Set(rosaries.map((item) => item.id))
  const now = new Date()
  const items = [
    ...rosaries.map(normalizeRosary),
    ...extraordinary.filter((item) => !rosaryIds.has(item.id)).map(normalizeExtraordinary),
    ...glories.map(normalizeGlory),
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
