'use client'

import Image from 'next/image'
import ShareActions from '@/components/ShareActions'
import { crewEventShare } from '@/lib/share'
import useFollowedBrotherhoods from '@/components/useFollowedBrotherhoods'
import { brotherhoodSlugFromHref } from '@/lib/followed-brotherhoods'
import followStyles from './AgendaMyBrotherhoods.module.css'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { crewEventDisplayStatus } from '@/lib/crew-events'
import {
  CREW_FILTERS,
  activeCrewFilterCount,
  crewFacetOptions,
  emptyCrewFilters,
  filterCrewEntries,
  findFacetLabel,
  indexCrewEvents,
  parseCrewFilterParams,
  serializeCrewFilterParams,
} from '@/lib/crew-event-filters'
import { trackEvent } from '@/lib/analytics/client'
import styles from './CrewEventDirectory.module.css'
import { hasCrewEventPage } from '@/lib/crew-event-url-policy'
import { crewPhotoCaption } from '@/lib/crew-event-photo'

const OPTIMIZABLE = /^(\/(?!\/)|https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/)/i

// Foto de la convocatoria (o de su titular o Paso). Un cartel no se recorta.
function CrewPhoto({ photo, sizes, eager = false }) {
  return (
    <Image
      src={photo.path}
      alt={photo.alt || ''}
      fill
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      unoptimized={!OPTIMIZABLE.test(photo.path) || /\.svg(\?|$)/i.test(photo.path)}
      style={{ objectFit: photo.fit === 'contain' ? 'contain' : 'cover', objectPosition: photo.position || '50% 50%' }}
    />
  )
}

const AGENDA_TYPE = 'igualas_ensayos'

function groupByMonth(items) {
  const groups = []
  const byKey = new Map()
  items.forEach((item) => {
    if (!byKey.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      byKey.set(item.monthKey, group)
      groups.push(group)
    }
    byKey.get(item.monthKey).items.push(item)
  })
  return groups
}

function SelectFilter({ id, label, value, onChange, options, allLabel }) {
  return (
    <label className={styles.selectFilter} htmlFor={id} data-active={value ? 'true' : undefined}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={!option.count && option.value !== value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </label>
  )
}

function EventStatus({ event }) {
  const { status, label } = crewEventDisplayStatus(event)
  return <span className={styles.status} data-status={status}>{label}</span>
}

function trackCrewOpen(event) {
  trackEvent('agenda_event_open', {
    event_name: event.title,
    event_type: event.eventType,
    municipality: event.municipality,
    event_date: event.date,
    agenda_type: AGENDA_TYPE,
  })
}

function trackCrewBrotherhood(event) {
  trackEvent('entity_click', {
    source_entity_type: 'evento',
    source_entity_name: event.title,
    destination_entity_type: 'hermandad',
    destination_entity_name: event.brotherhoodName,
    link_context: 'agenda_igualas_ensayos',
  })
}

// Paso y capataz enlazados a su ficha cuando la tienen (hilo de Hilo Cofrade).
function EntityNames({ items }) {
  return items.map((item, index) => (
    <span key={item.id || item.name}>
      {index ? ' · ' : null}
      {item.href ? <Link href={item.href} data-analytics-destination-name={item.name}>{item.name}</Link> : item.name}
    </span>
  ))
}

function EventCard({ event, isMine = false }) {
  const time = event.timeText || event.startTime || 'Hora por confirmar'
  const primaryAgent = event.agents.find((item) => item.isPrimary) || event.agents[0]
  const hasPage = hasCrewEventPage(event.detailHref)
  return (
    <article className={styles.card} id={event.anchor}>
      <time className={styles.dateBlock} dateTime={event.date}>
        <strong>{event.dateParts.day}</strong>
        <span>{event.dateParts.month}</span>
        <small>{event.dateParts.year}</small>
      </time>

      <div className={styles.cardMain}>
        <div className={styles.cardTopline}>
          <span>{event.eventTypeLabel}</span>
          <EventStatus event={event} />
          {isMine ? <small className={followStyles.badge} title="Sigues a esta hermandad"><span aria-hidden="true">★</span> Tu hermandad</small> : null}
        </div>
        <h3>{hasPage ? <Link href={event.detailHref} onClick={() => trackCrewOpen(event)}>{event.title}</Link> : event.title}</h3>
        {event.brotherhoodHref ? (
          <Link className={styles.brotherhood} href={event.brotherhoodHref} onClick={() => trackCrewBrotherhood(event)} data-analytics-skip-entity="true">{event.brotherhoodName}</Link>
        ) : <strong className={styles.brotherhood}>{event.brotherhoodName}</strong>}

        <div className={styles.relations} data-analytics-related-section="iguala_hilo" data-analytics-source-type="iguala">
          {event.steps.length ? <span><b>Paso</b><EntityNames items={event.steps} /></span> : null}
          {primaryAgent ? <span><b>{primaryAgent.roleName}</b><EntityNames items={[primaryAgent]} /></span> : null}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.facts}>
            <span><b>Hora</b>{time}</span>
            <span><b>Localidad</b>{event.municipality}</span>
            {event.location ? <span><b>Lugar</b>{event.location}</span> : null}
          </div>
          {hasPage ? <Link className={styles.detailLink} href={event.detailHref} onClick={() => trackCrewOpen(event)}>Ver convocatoria <span>→</span></Link> : null}
        </div>
        {event.photo && crewPhotoCaption(event.photo) ? <p className={styles.photoCredit}>{crewPhotoCaption(event.photo)}</p> : null}
        <ShareActions compact iconsOnly className={styles.cardShare} share={crewEventShare(event, { hasPage })} contentType="iguala" analytics={{ event_type: event.eventType || event.eventTypeLabel, municipality: event.municipality }} />
      </div>

      {event.photo ? (
        <div className={styles.cardPhoto} data-fit={event.photo.fit}>
          <CrewPhoto photo={event.photo} sizes="(max-width: 720px) 84px, 132px" />
        </div>
      ) : event.crestPath ? (
        <div className={styles.cardCrest} aria-hidden="true">
          <Image src={event.crestPath} alt="" width={78} height={78} sizes="78px" />
        </div>
      ) : null}
    </article>
  )
}

export default function CrewEventDirectory({ events }) {
  const [phase, setPhase] = useState('upcoming')
  const [filters, setFilters] = useState(emptyCrewFilters)
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const urlReady = useRef(false)
  const resultsRef = useRef(null)
  const { followed } = useFollowedBrotherhoods()
  const [mineOnly, setMineOnly] = useState(false)
  const followedSlugs = useMemo(() => new Set(followed.map((item) => item.slug)), [followed])
  const isMine = (item) => followedSlugs.has(brotherhoodSlugFromHref(item.brotherhoodHref))

  // El orden importa: estos efectos van antes de leer la URL para no
  // sobrescribirla con el estado inicial vacío en el primer render.
  useEffect(() => {
    if (!urlReady.current) return
    const search = serializeCrewFilterParams({ filters, query, phase })
    const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
    if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, '', next)
    }
  }, [filters, query, phase])

  // La búsqueda se mide al dejar de escribir, no en cada tecla.
  useEffect(() => {
    const term = query.trim()
    if (!urlReady.current || term.length < 3) return undefined
    const timer = window.setTimeout(() => trackFilter('busqueda', term), 1200)
    return () => window.clearTimeout(timer)
  }, [query])

  // Filtros compartidos por enlace (?hermandad=…&paso=…&ver=historico).
  // Links from Hermandades, Agenda or hubs point to /igualas-y-ensayos#convocatoria-…;
  // a past convocatoria is only rendered under «Histórico», so open that tab.
  useEffect(() => {
    const fromUrl = parseCrewFilterParams(window.location.search)
    setFilters(fromUrl.filters)
    setQuery(fromUrl.query)
    setPhase(fromUrl.phase)
    urlReady.current = true
    const anchor = decodeURIComponent(window.location.hash.slice(1))
    if (!anchor) return
    const target = events.find((item) => item.anchor === anchor)
    if (!target) return
    if (!target.isUpcoming) setPhase('archive')
    window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ block: 'start' }))
  }, [events])

  const upcoming = useMemo(() => events.filter((item) => item.isUpcoming), [events])
  const archived = useMemo(() => events.filter((item) => !item.isUpcoming), [events])
  const upcomingEntries = useMemo(() => indexCrewEvents(upcoming), [upcoming])
  const archivedEntries = useMemo(() => indexCrewEvents([...archived].reverse()), [archived])
  const allEntries = phase === 'upcoming' ? upcomingEntries : archivedEntries
  const entries = useMemo(
    () => (mineOnly ? allEntries.filter((entry) => isMine(entry.event)) : allEntries),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allEntries, mineOnly, followedSlugs],
  )

  const filtered = useMemo(() => filterCrewEntries(entries, filters, { query }).map((entry) => entry.event), [entries, filters, query])
  const facetOptions = useMemo(() => Object.fromEntries(CREW_FILTERS.map(({ key }) => [
    key,
    crewFacetOptions(entries, filters, key, { query, descendingMonths: phase === 'archive', allEntries }),
  ])), [entries, allEntries, filters, query, phase])

  const groups = groupByMonth(filtered)
  const activeCount = activeCrewFilterCount(filters, query) + (mineOnly ? 1 : 0)
  const hasFilters = activeCount > 0
  const featured = upcoming[0] || null
  const chips = CREW_FILTERS
    .filter(({ key }) => filters[key])
    .map(({ key, label }) => ({ key, label, value: findFacetLabel(allEntries, key, filters[key]) || filters[key] }))

  function trackFilter(filterType, filterValue) {
    trackEvent('agenda_filter', {
      filter_type: filterType,
      filter_value: filterValue,
      agenda_type: AGENDA_TYPE,
    })
  }

  function setFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }))
    trackFilter(key === 'tipo' ? 'tipo_evento' : key === 'localidad' ? 'municipio' : key, value ? findFacetLabel(allEntries, key, value) || value : 'todos')
  }

  function changePhase(next) {
    if (next === phase) return
    setPhase(next)
    setFilters((current) => ({ ...current, mes: '' }))
    trackFilter('estado', next === 'upcoming' ? 'proximas' : 'historico')
  }

  function clearFilters() {
    setFilters(emptyCrewFilters())
    setQuery('')
    setMineOnly(false)
    trackFilter('filtros', 'restablecidos')
  }

  function showResults() {
    setFiltersOpen(false)
    window.requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }))
  }

  if (!events.length) {
    return (
      <div className={styles.initialEmpty}>
        <span className={styles.emptyMark} aria-hidden="true">I/E</span>
        <div>
          <strong>Aún no hay convocatorias publicadas</strong>
          <p>Las próximas igualás, ensayos y citas de cuadrilla aparecerán aquí cuando estén documentadas y verificadas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.directory}>
      {featured ? (
        <article className={styles.featured} data-photo={featured.photo ? 'true' : undefined}>
          <figure className={styles.featuredVisual} data-fit={featured.photo?.fit}>
            {featured.photo ? (
              <CrewPhoto photo={featured.photo} sizes="(max-width: 720px) 100vw, 46vw" eager />
            ) : featured.crestPath ? (
              <span className={styles.featuredCrestMark} aria-hidden="true">
                <Image src={featured.crestPath} alt="" width={220} height={220} sizes="220px" />
              </span>
            ) : null}
            <div className={styles.featuredOverlay}>
              <EventStatus event={featured} />
              <time className={styles.featuredDateBadge} dateTime={featured.date}>
                <strong>{featured.dateParts.day}</strong>
                <span>{featured.dateParts.month}</span>
                <small>{featured.dateParts.year}</small>
              </time>
            </div>
            {featured.photo && crewPhotoCaption(featured.photo) ? <figcaption>{crewPhotoCaption(featured.photo)}</figcaption> : null}
          </figure>
          <div className={styles.featuredCopy}>
            <span className={styles.kicker}>Próxima convocatoria · {featured.eventTypeLabel}</span>
            <h2>{hasCrewEventPage(featured.detailHref) ? <Link href={featured.detailHref} onClick={() => trackCrewOpen(featured)}>{featured.title}</Link> : featured.title}</h2>
            <p className={styles.featuredBrotherhood}>
              {featured.photo && featured.crestPath ? <Image src={featured.crestPath} alt="" width={34} height={34} sizes="34px" /> : null}
              <span>{featured.brotherhoodName} · {featured.municipality}</span>
            </p>
            <div className={styles.featuredFacts}>
              <span><b>Fecha</b>{featured.dateParts.weekdayLabel}</span>
              <span><b>Hora</b>{featured.timeText || featured.startTime || 'Por confirmar'}</span>
              <span><b>Paso</b>{featured.steps.length ? <EntityNames items={featured.steps} /> : 'Por confirmar'}</span>
              <span><b>Capataz</b>{featured.agents.length ? <EntityNames items={featured.agents} /> : 'Por confirmar'}</span>
            </div>
            <div className={styles.featuredActions}>
              {hasCrewEventPage(featured.detailHref) ? <Link className={styles.primaryAction} href={featured.detailHref} onClick={() => trackCrewOpen(featured)}>Ver convocatoria <span>→</span></Link> : <a className={styles.primaryAction} href={`#${featured.anchor}`}>Ver en el calendario <span>→</span></a>}
              <ShareActions share={crewEventShare(featured, { hasPage: hasCrewEventPage(featured.detailHref) })} contentType="iguala" analytics={{ event_type: featured.eventType || featured.eventTypeLabel, municipality: featured.municipality, placement: 'featured' }} />
            </div>
          </div>
        </article>
      ) : null}

      <section className={styles.explorer} aria-labelledby="calendario-igualas-ensayos">
        <div className={styles.explorerHead}>
          <div><span className={styles.kicker}>Calendario</span><h2 id="calendario-igualas-ensayos">Convocatorias por fecha</h2></div>
          <p>Busca tu Hermandad, Paso o capataz, o filtra por Tipo de cita, Mes y Localidad. Los filtros se guardan en el enlace para compartirlos.</p>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.phaseTabs} role="group" aria-label="Filtrar por fecha de celebración">
            <button type="button" className={phase === 'upcoming' ? styles.active : ''} aria-pressed={phase === 'upcoming'} onClick={() => changePhase('upcoming')}>
              Próximas <small>{upcoming.length}</small>
            </button>
            <button type="button" className={phase === 'archive' ? styles.active : ''} aria-pressed={phase === 'archive'} onClick={() => changePhase('archive')}>
              Histórico <small>{archived.length}</small>
            </button>
          </div>

          {followed.length ? (
            <button type="button" className={`${followStyles.toggle} ${mineOnly ? followStyles.toggleActive : ''}`} aria-pressed={mineOnly} onClick={() => { setMineOnly(!mineOnly); trackFilter('mis_hermandades', mineOnly ? 'no' : 'si') }}>
              <span aria-hidden="true">★</span> Mis hermandades <b>{allEntries.filter((entry) => isMine(entry.event)).length}</b>
            </button>
          ) : null}
        </div>

        <div className={styles.toolbar}>
          <label className={styles.search} htmlFor="crew-search">
            <span className={styles.srOnly}>Buscar convocatorias</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            <input
              id="crew-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Hermandad, Paso, capataz o lugar"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? <button type="button" className={styles.searchClear} onClick={() => setQuery('')} aria-label="Borrar búsqueda">×</button> : null}
          </label>
          <button
            type="button"
            className={styles.filterToggle}
            aria-expanded={filtersOpen}
            aria-controls="crew-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" /></svg>
            Filtros{activeCount ? <b>{activeCount}</b> : null}
          </button>
        </div>

        <div id="crew-filters" className={styles.filters} data-open={filtersOpen ? 'true' : undefined}>
          {CREW_FILTERS.map(({ key, label, allLabel }) => (
            <SelectFilter
              key={key}
              id={`crew-filter-${key}`}
              label={label}
              value={filters[key]}
              onChange={(value) => setFilter(key, value)}
              options={facetOptions[key]}
              allLabel={allLabel}
            />
          ))}
          <div className={styles.filtersFooter}>
            {hasFilters ? <button type="button" className={styles.clearButton} onClick={clearFilters}>Limpiar</button> : <span />}
            <button type="button" className={styles.applyButton} onClick={showResults}>
              Ver {filtered.length} convocatoria{filtered.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>

        {chips.length || query.trim() ? (
          <ul className={styles.chips} aria-label="Filtros activos">
            {query.trim() ? (
              <li><button type="button" onClick={() => setQuery('')} aria-label={`Quitar búsqueda «${query.trim()}»`}>«{query.trim()}» <span aria-hidden="true">×</span></button></li>
            ) : null}
            {chips.map((chip) => (
              <li key={chip.key}>
                <button type="button" onClick={() => setFilter(chip.key, '')} aria-label={`Quitar filtro ${chip.label}: ${chip.value}`}>
                  <small>{chip.label}</small> {chip.value} <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className={styles.resultHead} ref={resultsRef} aria-live="polite">
          <div><strong>{filtered.length} convocatoria{filtered.length === 1 ? '' : 's'}</strong><span>{phase === 'upcoming' ? 'por celebrar' : 'en el histórico'}</span></div>
          {hasFilters ? <button type="button" onClick={clearFilters}>Limpiar filtros</button> : null}
        </div>

        {groups.length ? (
          <div className={styles.months}>
            {groups.map((group) => (
              <section className={styles.monthGroup} key={group.key} aria-labelledby={`crew-events-${group.key}`}>
                <div className={styles.monthHeading}><h3 id={`crew-events-${group.key}`}>{group.label}</h3><span>{group.items.length}</span></div>
                <div className={styles.list}>{group.items.map((event) => <EventCard event={event} key={event.id} isMine={isMine(event)} />)}</div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.filteredEmpty}>
            <strong>No hay convocatorias con estos filtros</strong>
            <span>{phase === 'upcoming' && archived.length ? 'Puede que ya se hayan celebrado: prueba en el Histórico o quita algún filtro.' : 'Prueba con otra fecha, Hermandad o Tipo de cita.'}</span>
            <div className={styles.emptyActions}>
              {phase === 'upcoming' && archived.length ? <button type="button" onClick={() => changePhase('archive')}>Buscar en el Histórico</button> : null}
              {hasFilters ? <button type="button" onClick={clearFilters}>Limpiar filtros</button> : null}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
