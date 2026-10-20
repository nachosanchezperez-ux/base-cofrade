import Image from 'next/image'
import Link from 'next/link'
import ShareActions, { CalendarAddLink } from '@/components/ShareActions'
import AgendaEventThread from '@/components/AgendaEventThread'
import { agendaItemShare, agendaPeriodShare } from '@/lib/share'
import { agendaEventAnchor, scheduleTimeHint } from '@/lib/agenda-event-presentation'
import { agendaThreadLinks, repeatsPlace } from '@/lib/agenda-event-relations'
import styles from './AgendaTemporalEventList.module.css'

function itemTime(item) {
  if (item.timeText) return item.timeText
  if (item.startTime && item.endTime) return `${item.startTime}–${item.endTime}`
  return item.startTime || scheduleTimeHint(item.schedule) || 'Hora por confirmar'
}

function dayLabel(item) {
  return item.temporalDateInfo?.weekdayLabel || item.dateInfo?.weekdayLabel || item.dateInfo?.label || item.temporalDate || item.date || 'Fecha por confirmar'
}

function groupByDate(items = []) {
  const groups = []
  const byDate = new Map()

  for (const item of items) {
    const key = item.temporalDate || item.date || 'sin-fecha'
    const info = item.temporalDateInfo || item.dateInfo || {}
    if (!byDate.has(key)) {
      const group = {
        key,
        label: dayLabel(item),
        day: info.day || '',
        month: info.month || '',
        items: [],
      }
      byDate.set(key, group)
      groups.push(group)
    }
    byDate.get(key).items.push(item)
  }

  return groups
}

// Foto del acto (#agenda-fotos): la propia del acto va en grande; la del titular
// o el escudo, en miniatura. Sin imagen, la cita no reserva hueco.
const OPTIMIZABLE = /^(\/(?!\/)|https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/)/i

function eventMedia(item) {
  const photo = item.photo
  if (photo?.path && photo.source === 'event') {
    const isPoster = photo.fit === 'contain'
    return {
      variant: 'feature', src: photo.path, alt: photo.alt || item.title || '', fit: photo.fit,
      credit: isPoster ? String(photo.credit || '').replace(/^Fotografía/, 'Cartel') : photo.credit,
    }
  }
  if (photo?.path && photo.source === 'titular') {
    return { variant: 'thumb', src: photo.path, alt: photo.alt || '', fit: 'cover', credit: photo.credit }
  }
  if (item.crestPath) return { variant: 'thumb', src: item.crestPath, alt: '', fit: 'contain', credit: '', crest: true }
  return null
}

function EventMedia({ item, media }) {
  const image = (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={media.variant === 'feature' ? '(max-width: 720px) 100vw, 260px' : '(max-width: 720px) 76px, 104px'}
      unoptimized={!OPTIMIZABLE.test(media.src) || /\.svg(\?|$)/i.test(media.src)}
      style={{ objectFit: media.fit === 'contain' ? 'contain' : 'cover' }}
    />
  )
  return (
    <figure className={styles.media} data-variant={media.variant} data-fit={media.fit} data-crest={media.crest ? 'true' : undefined}>
      {item.eventHref
        ? <Link href={item.eventHref} tabIndex={-1} aria-hidden={media.alt ? undefined : true} className={styles.mediaFrame}>{image}</Link>
        : <span className={styles.mediaFrame}>{image}</span>}
      {media.variant === 'feature' && media.credit ? <figcaption>{media.credit}</figcaption> : null}
    </figure>
  )
}

// En los conciertos `actionLabel` es «Ver banda»: la acción principal abre la cita.
function primaryLabel(item) {
  return item.category === 'concerts' ? 'Ver cita' : item.actionLabel || 'Ver cita'
}

function categoryLabel(item) {
  return item.categoryLabel || item.calendarLabel || item.categoryName || 'Acto'
}

export default function AgendaTemporalEventList({ landing }) {
  const groups = groupByDate(landing.items)
  // Actos distintos: el de varios días se lista en cada uno de sus días.
  const count = landing.count ?? landing.items.length
  const periodShare = agendaPeriodShare(landing)

  return (
    <section className={styles.section} id="agenda-del-periodo" aria-labelledby="agenda-periodo-title">
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span>{landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}</span>
            <h2 id="agenda-periodo-title">{landing.listHeading || 'Todos los actos cofrades'}</h2>
          </div>
          <strong>{count} {count === 1 ? 'acto' : 'actos'}</strong>
        </header>
        {/* Toda la agenda del periodo en un mensaje, para grupos de WhatsApp. */}
        {periodShare ? (
          <div className={styles.periodShare}>
            <span>{landing.period === 'weekend' ? 'Pásala a tu grupo: la agenda del fin de semana' : landing.period === 'tomorrow' ? 'Pásala a tu grupo: la agenda de mañana' : 'Pásala a tu grupo: la agenda de hoy'}</span>
            <ShareActions share={periodShare} contentType="agenda_period" analytics={{ agenda_period: landing.period, items_count: count }} />
          </div>
        ) : null}

        <div className={styles.groups}>
          {groups.map((group) => (
            <section className={styles.dayGroup} key={group.key} aria-labelledby={`agenda-dia-${group.key}`}>
              <header className={styles.dayHeading}>
                <time dateTime={group.key !== 'sin-fecha' ? group.key : undefined}>
                  <strong>{group.day || '—'}</strong>
                  <span>{group.month || 'FECHA'}</span>
                </time>
                <div>
                  <span>Jornada</span>
                  <h3 id={`agenda-dia-${group.key}`}>{group.label}</h3>
                  <small>{group.items.length} {group.items.length === 1 ? 'cita' : 'citas'}</small>
                </div>
              </header>

              <div className={styles.list}>
                {group.items.map((item) => {
                  const media = eventMedia(item)
                  return (
                  <article
                    className={styles.row}
                    data-category={item.category || 'other'}
                    data-media={media?.variant}
                    key={item.displayKey || item.key || item.href || item.id}
                  >
                    {media ? <EventMedia item={item} media={media} /> : null}
                    <div className={styles.time}>
                      <span className="sr-only">Hora: </span>
                      <strong>{itemTime(item)}</strong>
                    </div>

                    <div className={styles.copy}>
                      <div className={styles.topline}>
                        <span>{categoryLabel(item)}</span>
                        <ShareActions
                          compact
                          iconsOnly
                          className={styles.shareIcons}
                          share={agendaItemShare(item)}
                          contentType="agenda"
                          analytics={{ event_type: item.category, municipality: item.municipality, agenda_period: landing.period }}
                        />
                      </div>
                      <h4 className={styles.title}>{item.eventHref ? <Link href={item.eventHref}>{item.title}</Link> : item.title}</h4>
                      {/* Lugar en una línea de texto: el separador va pegado al dato anterior
                          (espacio duro), así nunca empieza una línea con «·». */}
                      <p className={styles.meta}>
                        {item.municipality ? (
                          item.municipalityHref
                            ? <Link className={styles.municipality} href={item.municipalityHref} aria-label={`Guía local de ${item.municipality}`}>{item.municipality}</Link>
                            : <strong className={styles.municipality}>{item.municipality}</strong>
                        ) : null}
                        {item.place ? <span className={styles.place}>{item.municipality ? '\u00a0· ' : ''}{item.place}</span> : null}
                        {/* Si la entidad tiene ficha, su nombre ya va enlazado en el hilo; si
                            solo repite el lugar, tampoco se muestra. */}
                        {item.organizer
                          && !agendaThreadLinks(item).some((link) => link.kind === 'brotherhood' || link.kind === 'band')
                          && !repeatsPlace(item.organizer, item.place)
                          ? <span className={styles.organizer}>{item.municipality || item.place ? '\u00a0· ' : ''}{item.organizer}</span>
                          : null}
                      </p>
                      {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
                      {media?.variant === 'thumb' && media.credit ? <p className={styles.photoCredit}>{item.photo?.name ? `Fotografía de ${item.photo.name}` : 'Fotografía'} · {media.credit.replace(/^Fotografía · /, '')}</p> : null}
                      <AgendaEventThread item={item} compact className={styles.thread} />
                    </div>
                    <div className={styles.actions}>
                      {item.eventHref ? <Link className={styles.primary} href={item.eventHref}>{primaryLabel(item)}<span aria-hidden="true" className={styles.arrow}>→</span></Link> : null}
                      <CalendarAddLink
                        href={item.date ? `/calendario/acto/${agendaEventAnchor(item)}.ics` : ''}
                        title={item.title}
                        contentType="agenda"
                        analytics={{ event_type: item.category, municipality: item.municipality, agenda_period: landing.period }}
                      />
                    </div>
                  </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <nav className={styles.footer} aria-label="Seguir explorando la Agenda Cofrade">
          <span>Seguir explorando</span>
          <Link href="/agenda-cofrade">Agenda completa</Link>
          <Link href="/procesiones-de-gloria">Glorias</Link>
          <Link href="/extraordinarias">Extraordinarias</Link>
          <Link href="/igualas-y-ensayos">Igualás y ensayos</Link>
        </nav>
      </div>
    </section>
  )
}
