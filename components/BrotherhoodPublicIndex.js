'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrotherhoodDirectoryCrestImage from '@/components/BrotherhoodDirectoryCrestImage'
import { directorySlug, displayName, hasDirectoryType } from '@/lib/brotherhood-directory'
import { groupBrotherhoodsByLocality } from '@/lib/brotherhood-public-index'
import { CALENDAR_VIEWS, calendarSelection, calendarSections, localityAnchor } from '@/lib/brotherhood-locality-calendar'
import styles from './BrotherhoodPublicIndex.module.css'

function BrotherhoodRow({ item, showCrest }) {
  const secondary = [
    hasDirectoryType(item, 'sacramentales') ? 'Sacramental' : '',
    hasDirectoryType(item, 'agrupaciones-parroquiales') ? 'Agrupación Parroquial' : '',
  ].filter(Boolean).join(' · ')
  return (
    <li>
      <Link href={`/hermandades/${item.slug}`} prefetch={false} className={styles.row}>
        {item.escudoPath ? (
          <span className={styles.crest} aria-hidden="true">
            {showCrest ? <BrotherhoodDirectoryCrestImage src={item.escudoPath} alt="" width={44} height={52}
              sizes="44px" maxScale={1} className={styles.crestImage} fallbackClassName={styles.crestFallback} /> : null}
          </span>
        ) : null}
        <span className={styles.copy}><strong>{displayName(item)}</strong>{secondary ? <span>{secondary}</span> : null}</span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>
    </li>
  )
}

function LocalityCalendar({ group, navigation, expand }) {
  const [open, setOpen] = useState(expand)
  const [view, setView] = useState('todos')
  const [character, setCharacter] = useState('todos')
  const id = localityAnchor(group)
  const name = group.key === 'sevilla' ? 'Sevilla capital' : group.locality
  const selected = calendarSelection(group.items, view, character)
  const sections = calendarSections(group.items, view, character)
  const characterOptions = [
    ['sacramentales', 'Sacramentales'],
    ['agrupaciones-parroquiales', 'Agrupaciones Parroquiales'],
  ].filter(([key]) => group.items.some((item) => hasDirectoryType(item, key)))
  const localityPage = navigation.localities.find((item) => item.slug === group.slug)

  useEffect(() => { if (expand) setOpen(true) }, [expand])

  return (
    <details id={id} className={`${styles.locality} ${group.key === 'sevilla' ? styles.capital : ''}`}
      open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary className={styles.summary}>
        <h3 id={`${id}-titulo`}>{name}</h3>
        <span className={styles.count}>{selected.length} {selected.length === 1 ? 'corporación' : 'corporaciones'}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      <div className={styles.content}>
        <div className={styles.controls}>
          <div role="group" aria-label={`Calendario de ${name}`} className={styles.views}>
            {CALENDAR_VIEWS.filter((entry) => entry.key === 'todos' || group.items.some((item) => hasDirectoryType(item, entry.key))).map((entry) => (
              <button type="button" key={entry.key} aria-pressed={view === entry.key}
                className={view === entry.key ? styles.selected : ''} onClick={() => setView(entry.key)}>
                {entry.label}<span>{calendarSelection(group.items, entry.key, character).length}</span>
              </button>
            ))}
          </div>
          {characterOptions.length ? (
            <label className={styles.character} htmlFor={`${id}-caracter`}>
              <span>Carácter</span>
              <select id={`${id}-caracter`} value={character} onChange={(event) => setCharacter(event.target.value)}>
                <option value="todos">Todos</option>
                {characterOptions.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
          ) : null}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{selected.length} corporaciones en {name}</p>
        {sections.length ? sections.map((section) => (
          <section className={styles.calendar} key={section.key} aria-labelledby={`${id}-${section.key}`}>
            <h4 id={`${id}-${section.key}`}>{section.label}</h4>
            {section.key === 'gloria' ? <p className={styles.note}>Mes de salida documentado; no equivale a una convocatoria confirmada de este año.</p> : null}
            {section.periods.map((period) => {
              const href = `/hermandades/${section.key}/${group.slug}/${directorySlug(period.period)}`
              const canLink = !expand && character === 'todos' && Boolean(period.period) && Boolean(navigation.routes[href])
              return (
                <div className={styles.period} key={period.key}>
                  {period.label ? <h5>{canLink ? <Link href={href} prefetch={false} title={`Ver el directorio completo de ${period.label} en ${name}`}>{period.label} <span aria-hidden="true">→</span></Link> : period.label}</h5> : null}
                  <ul className={styles.rows}>{period.items.map((item) => <BrotherhoodRow key={item.id || item.slug} item={item} showCrest={open} />)}</ul>
                </div>
              )
            })}
          </section>
        )) : (
          <div className={styles.empty}>
            <p>No hay corporaciones con esta combinación de calendario y carácter.</p>
            <button type="button" onClick={() => { setView('todos'); setCharacter('todos') }}>Ver todas las de {name}</button>
          </div>
        )}
        {localityPage ? <Link href={localityPage.href} prefetch={false} className={styles.localityLink}>Ver directorio completo de {name} <span>({localityPage.count} fichas)</span> <span aria-hidden="true">→</span></Link> : null}
      </div>
    </details>
  )
}

export default function BrotherhoodPublicIndex({ brotherhoods = [], navigation, expand = false }) {
  const groups = useMemo(() => groupBrotherhoodsByLocality(brotherhoods), [brotherhoods])
  return <div className={styles.index}>{groups.map((group) => <LocalityCalendar key={group.key} group={group} navigation={navigation} expand={expand} />)}</div>
}
