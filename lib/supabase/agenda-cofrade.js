import 'server-only'

import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { getKissingDevotions } from '@/lib/supabase/kissing-devotions'
import { getRosaryOutings } from '@/lib/supabase/rosary-outings'

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
  return {
    id: item.id, key: `${category}:${item.id}`, category, date, endDate: item.endDate || item.returnDate || '', dateInfo: info,
    monthKey: info.monthKey, monthLabel: info.monthLabel,
    municipality: item.municipality || '',
    scope: item.scope || (String(item.municipality || '').toLocaleLowerCase('es') === 'sevilla' ? 'capital' : 'province'),
    organizer: item.brotherhoodName || 'Entidad organizadora', organizerHref: item.brotherhoodHref || '',
    title: item.title || 'Acto cofrade', imagePath: item.heroImagePath || item.crestPath || '',
    imageAlt: item.heroImagePath ? (item.heroImageAlt || item.title || '') : '',
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

function compareAgendaItems(first, second) {
  if (!first.date && !second.date) return first.title.localeCompare(second.title, 'es')
  if (!first.date) return 1
  if (!second.date) return -1
  return `${first.date}T${first.startTime || '23:59'}`.localeCompare(`${second.date}T${second.startTime || '23:59'}`)
}

export async function getAgendaCofrade() {
  const [rosaries, extraordinary, glories, devotions] = await Promise.all([
    getRosaryOutings(), getExtraordinaryDirectory(), getGloryDirectory(), getKissingDevotions(),
  ])
  const rosaryIds = new Set(rosaries.map((item) => item.id))
  const items = [
    ...rosaries.map(normalizeRosary),
    ...extraordinary.filter((item) => !rosaryIds.has(item.id)).map(normalizeExtraordinary),
    ...glories.map(normalizeGlory),
    ...devotions.map(normalizeDevotion),
  ].sort(compareAgendaItems)
  return { today: madridDateKey(), items }
}
