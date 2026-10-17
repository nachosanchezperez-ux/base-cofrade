'use client'

import Image from 'next/image'
import ShareActions from '@/components/ShareActions'
import { crewEventShare } from '@/lib/share'
import useFollowedBrotherhoods from '@/components/useFollowedBrotherhoods'
import { brotherhoodSlugFromHref } from '@/lib/followed-brotherhoods'
import followStyles from './AgendaMyBrotherhoods.module.css'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CREW_EVENT_TYPES, crewEventStatusLabel } from '@/lib/crew-events'
import { trackEvent } from '@/lib/analytics/client'
import styles from './CrewEventDirectory.module.css'
import { hasCrewEventPage } from '@/lib/crew-event-url-policy'

const AGENDA_TYPE = 'igualas_ensayos'

function uniqueOptions(items, selector) {
  const byValue = new Map()
  items.flatMap(selector).forEach((item) => {
    if (item?.value && item?.label) byValue.set(item.value, item)
  })
  return [...byValue.values()].sort((a, b) => a.label.localeCompare(b.label, 'es'))
}
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

function SelectFilter({ label, value, onChange, options, allLabel }) {
  return (
    <label className={styles.selectFilter}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function EventStatus({ event }) {
  const label = event.urgencyLabel || crewEventStatusLabel(event.eventStatus)
  return <span className={styles.status} data-status={event.eventStatus}>{label}</span>
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

        <div className={styles.relations}>
          {event.steps.length ? <span><b>Paso</b>{event.steps.map((item) => item.name).join(' · ')}</span> : null}
          {primaryAgent ? <span><b>{primaryAgent.roleName}</b>{primaryAgent.name}</span> : null}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.facts}>
            <span><b>Hora</b>{time}</span>
            <span><b>Localidad</b>{event.municipality}</span>
            {event.location ? <span><b>Lugar</b>{event.location}</span> : null}
          </div>
          {hasPage ? <Link className={styles.detailLink} href={event.detailHref} onClick={() => trackCrewOpen(event)}>Ver convocatoria <span>→</span></Link> : null}
        </div>
        <ShareActions compact share={crewEventShare(event, { hasPage })} contentType="iguala" analytics={{ event_type: event.eventType || event.eventTypeLabel, municipality: event.municipality }} />
      </div>

      {event.crestPath ? (
        <div className={styles.cardCrest} aria-hidden="true">
          <Image src={event.crestPath} alt="" width={78} height={78} sizes="78px" />
        </div>
      ) : null}
    </article>
  )
}

export default function CrewEventDirectory({ events }) {
  const [phase, setPhase] = useState('upcoming')

  // Links from Hermandades, Agenda or hubs point to /igualas-y-ensayos#convocatoria-…;
  // a past convocatoria is only rendered under «Celebradas», so open that tab.
  useEffect(() => {
    const anchor = decodeURIComponent(window.location.hash.slice(1))
    if (!anchor) return
    const target = events.find((item) => item.anchor === anchor)
    if (!target) return
    if (!target.isUpcoming) setPhase('archive')
    window.requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ block: 'start' }))
  }, [events])
  const [month, setMonth] = useState('all')
  const [type, setType] = useState('all')
  const [brotherhood, setBrotherhood] = useState('all')
  const [step, setStep] = useState('all')
  const [agent, setAgent] = useState('all')
  const [municipality, setMunicipality] = useState('all')
  const { followed } = useFollowedBrotherhoods()
  const [mineOnly, setMineOnly] = useState(false)
  const followedSlugs = useMemo(() => new Set(followed.map((item) => item.slug)), [followed])
  const isMine = (item) => followedSlugs.has(brotherhoodSlugFromHref(item.brotherhoodHref))

  const upcoming = useMemo(() => events.filter((item) => item.isUpcoming), [events])
  const archived = useMemo(() => events.filter((item) => !item.isUpcoming), [events])
  const source = phase === 'upcoming' ? upcoming : [...archived].reverse()
  const months = uniqueOptions(source, (item) => [{ value: item.monthKey, label: item.monthLabel }])
  const brotherhoods = uniqueOptions(events, (item) => [{ value: item.brotherhoodId, label: item.brotherhoodName }])
  const steps = uniqueOptions(events, (item) => item.steps.map((entry) => ({ value: entry.id, label: entry.name })))
  const agents = uniqueOptions(events, (item) => item.agents.map((entry) => ({ value: entry.id, label: entry.name })))
  const municipalities = uniqueOptions(events, (item) => [{ value: item.municipalityId, label: item.municipality }])
  const typeOptions = CREW_EVENT_TYPES.map(([value, label]) => ({ value, label }))

  const filtered = source.filter((item) => (
    (month === 'all' || item.monthKey === month)
    && (type === 'all' || item.eventType === type)
    && (brotherhood === 'all' || item.brotherhoodId === brotherhood)
    && (step === 'all' || item.steps.some((entry) => entry.id === step))
    && (agent === 'all' || item.agents.some((entry) => entry.id === agent))
    && (municipality === 'all' || item.municipalityId === municipality)
    && (!mineOnly || isMine(item))
  ))
  const groups = groupByMonth(filtered)
  const hasFilters = mineOnly || [month, type, brotherhood, step, agent, municipality].some((value) => value !== 'all')
  const featured = upcoming[0] || null

  function trackFilter(filterType, filterValue) {
    trackEvent('agenda_filter', {
      filter_type: filterType,
      filter_value: filterValue,
      agenda_type: AGENDA_TYPE,
    })
  }

  function setTrackedFilter(setter, filterType, value) {
    setter(value)
    trackFilter(filterType, value)
  }

  function clearFilters() {
    setMonth('all')
    setType('all')
    setBrotherhood('all')
    setStep('all')
    setAgent('all')
    setMunicipality('all')
    setMineOnly(false)
    trackFilter('filtros', 'restablecidos')
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
        <article className={styles.featured}>
          <div className={styles.featuredDate}>
            <time dateTime={featured.date}>
              <strong>{featured.dateParts.day}</strong>
              <span>{featured.dateParts.month}</span>
              <small>{featured.dateParts.year}</small>
            </time>
            <EventStatus event={featured} />
          </div>
          <div className={styles.featuredCopy}>
            <span className={styles.kicker}>Próxima convocatoria · {featured.eventTypeLabel}</span>
            <h2>{hasCrewEventPage(featured.detailHref) ? <Link href={featured.detailHref} onClick={() => trackCrewOpen(featured)}>{featured.title}</Link> : featured.title}</h2>
            <p className={styles.featuredBrotherhood}>{featured.brotherhoodName} · {featured.municipality}</p>
            <div className={styles.featuredFacts}>
              <span><b>Fecha</b>{featured.dateParts.weekdayLabel}</span>
              <span><b>Hora</b>{featured.timeText || featured.startTime || 'Por confirmar'}</span>
              <span><b>Paso</b>{featured.steps.map((item) => item.name).join(' · ') || 'Por confirmar'}</span>
              <span><b>Capataz</b>{featured.agents.map((item) => item.name).join(' · ') || 'Por confirmar'}</span>
            </div>
            {hasCrewEventPage(featured.detailHref) ? <Link className={styles.primaryAction} href={featured.detailHref} onClick={() => trackCrewOpen(featured)}>Ver convocatoria <span>→</span></Link> : <a className={styles.primaryAction} href={`#${featured.anchor}`}>Ver en el calendario <span>→</span></a>}
            <ShareActions share={crewEventShare(featured, { hasPage: hasCrewEventPage(featured.detailHref) })} contentType="iguala" analytics={{ event_type: featured.eventType || featured.eventTypeLabel, municipality: featured.municipality, placement: 'featured' }} />
          </div>
          {featured.crestPath ? (
            <Image className={styles.featuredCrest} src={featured.crestPath} alt={`Escudo de ${featured.brotherhoodName}`} width={150} height={150} sizes="150px" />
          ) : null}
        </article>
      ) : null}

      <section className={styles.explorer} aria-labelledby="calendario-igualas-ensayos">
        <div className={styles.explorerHead}>
          <div><span className={styles.kicker}>Calendario</span><h2 id="calendario-igualas-ensayos">Convocatorias por fecha</h2></div>
          <p>Filtra el calendario por Hermandad, Paso, capataz, localidad o tipo de cita.</p>
        </div>

        <div className={styles.phaseTabs} aria-label="Filtrar por fecha de celebración">
          <button type="button" className={phase === 'upcoming' ? styles.active : ''} aria-pressed={phase === 'upcoming'} onClick={() => { setPhase('upcoming'); setMonth('all'); trackFilter('estado', 'proximas') }}>
            Próximas <small>{upcoming.length}</small>
          </button>
          <button type="button" className={phase === 'archive' ? styles.active : ''} aria-pressed={phase === 'archive'} onClick={() => { setPhase('archive'); setMonth('all'); trackFilter('estado', 'historico') }}>
            Histórico <small>{archived.length}</small>
          </button>
        </div>

        {followed.length ? (
          <div className={followStyles.bar}>
            <button type="button" className={`${followStyles.toggle} ${mineOnly ? followStyles.toggleActive : ''}`} aria-pressed={mineOnly} onClick={() => { setMineOnly(!mineOnly); trackFilter('mis_hermandades', mineOnly ? 'no' : 'si') }}>
              <span aria-hidden="true">★</span> Mis hermandades <b>{source.filter(isMine).length}</b>
            </button>
          </div>
        ) : null}

        <div className={styles.filters}>
          <SelectFilter label="Mes" value={month} onChange={(value) => setTrackedFilter(setMonth, 'mes', value)} options={months} allLabel="Todos los meses" />
          <SelectFilter label="Tipo" value={type} onChange={(value) => setTrackedFilter(setType, 'tipo_evento', value)} options={typeOptions} allLabel="Todas las citas" />
          <SelectFilter label="Hermandad" value={brotherhood} onChange={(value) => setTrackedFilter(setBrotherhood, 'hermandad', brotherhoods.find((item) => item.value === value)?.label || value)} options={brotherhoods} allLabel="Todas" />
          <SelectFilter label="Paso" value={step} onChange={(value) => setTrackedFilter(setStep, 'paso', steps.find((item) => item.value === value)?.label || value)} options={steps} allLabel="Todos" />
          <SelectFilter label="Capataz" value={agent} onChange={(value) => setTrackedFilter(setAgent, 'capataz', agents.find((item) => item.value === value)?.label || value)} options={agents} allLabel="Todos" />
          <SelectFilter label="Localidad" value={municipality} onChange={(value) => setTrackedFilter(setMunicipality, 'municipio', municipalities.find((item) => item.value === value)?.label || value)} options={municipalities} allLabel="Todas" />
        </div>

        <div className={styles.resultHead}>
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
          <div className={styles.filteredEmpty}><strong>No hay convocatorias con estos filtros</strong><span>Prueba con otra fecha, Hermandad o tipo de cita.</span></div>
        )}
      </section>
    </div>
  )
}
