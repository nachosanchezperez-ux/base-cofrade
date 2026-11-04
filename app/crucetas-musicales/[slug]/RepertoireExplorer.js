'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from '../crucetas.module.css'

function normalize(value = '') {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function mainAuthors(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  return composers.length ? composers : entry.authors
}

function authorNames(entry) {
  return mainAuthors(entry).map((author) => author.name).join(' · ') || entry.credit || ''
}

function secondaryAuthors(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  if (!composers.length) return []
  return entry.authors.filter((author) => author.role !== 'composer')
}

const SECONDARY_ROLE = { adapter: 'Adaptación', lyricist: 'Letra' }

// «Marcha procesional» es lo esperable en una cruceta: solo se nombra el tipo
// cuando es otro (adaptación, himno, pieza de capilla…).
function distinctWorkType(entry) {
  const type = String(entry.workType || '').trim()
  return type && !/^marcha( procesional)?$/i.test(type) ? type : ''
}

const SORTS = [
  ['source', 'Orden de la fuente'],
  ['most', 'Más interpretadas'],
  ['az', 'A–Z'],
]

function entryKey(entry) {
  return entry.marchId || `titulo:${String(entry.title || '').toLowerCase()}`
}

function WorkRow({ entry, isHabitual, bandName }) {
  const authors = mainAuthors(entry)
  const type = distinctWorkType(entry)
  const extras = secondaryAuthors(entry)

  return (
    <li className={styles.workRow}>
      <div className={styles.workMain}>
        <h3>{entry.marchHref ? <Link href={entry.marchHref}>{entry.title}</Link> : entry.title}</h3>
        <p className={styles.workMeta}>
          {authors.length
            ? authors.map((author, index) => <span key={author.id}>{index ? ' · ' : ''}{author.href ? <Link href={author.href}>{author.name}</Link> : author.name}</span>)
            : <span>{entry.credit || 'Autoría no documentada'}</span>}
          {extras.map((author) => <span key={`${entry.id}-${author.id}`}> · {SECONDARY_ROLE[author.role] || 'Con'} {author.name}</span>)}
          {entry.compositionYear ? <span> · {entry.compositionYear}</span> : null}
          {type ? <span> · {type}</span> : null}
        </p>
        {entry.dedications.length ? (
          <p className={styles.workDedication}>
            Dedicada a {entry.dedications.map((dedication, index) => (
              <span key={`${dedication.id}-${index}`}>{index ? ' · ' : ''}{dedication.href ? <Link href={dedication.href}>{dedication.name}</Link> : dedication.name}</span>
            ))}
          </p>
        ) : null}
        {entry.isPremiere || entry.isNewThisYear || entry.isDedicatedToBrotherhood || isHabitual ? (
          <p className={styles.workTags}>
            {entry.isPremiere ? <em className={styles.workTag}>Estreno</em> : entry.isNewThisYear ? <em className={styles.workTag}>Nueva</em> : null}
            {entry.isDedicatedToBrotherhood ? <em className={styles.workTag}>Dedicada a esta Hermandad</em> : null}
            {isHabitual ? <em className={styles.workTag} title={`Suena en casi todas las crucetas de ${bandName}`}>Habitual de la banda</em> : null}
          </p>
        ) : null}
      </div>
      <div className={styles.workSide}>
        {entry.count > 1 ? <strong className={styles.workCount} aria-label={`${entry.count} interpretaciones`}>×{entry.count}</strong> : null}
        {entry.listening ? (
          <a
            className={styles.workListen}
            href={entry.listening.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Escuchar ${entry.title} en ${entry.listening.provider}`}
            title={`Escuchar en ${entry.listening.provider}`}
            data-hilo-event="repertoire_listen_click"
            data-hilo-provider={entry.listening.provider.toLowerCase()}
          >
            <span aria-hidden="true">▶</span>
          </a>
        ) : null}
      </div>
    </li>
  )
}

export default function RepertoireExplorer({ entries, habitualIds = [], bandName = '' }) {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('source')
  const [query, setQuery] = useState('')
  const habitual = useMemo(() => new Set(habitualIds), [habitualIds])
  const hasListening = entries.some((entry) => entry.listening)
  const hasRepeated = entries.some((entry) => entry.isRepeated)
  const visible = useMemo(() => {
    const needle = normalize(query.trim())
    const filtered = entries.filter((entry) => {
      const matchesFilter = filter === 'all' || (filter === 'listening' && entry.listening) || (filter === 'repeated' && entry.isRepeated)
      const matchesQuery = !needle || normalize(`${entry.title} ${authorNames(entry)}`).includes(needle)
      return matchesFilter && matchesQuery
    })
    if (sort === 'most') return [...filtered].sort((first, second) => second.count - first.count || first.displayOrder - second.displayOrder)
    if (sort === 'az') return [...filtered].sort((first, second) => first.title.localeCompare(second.title, 'es'))
    return filtered
  }, [entries, filter, query, sort])

  return (
    <>
      <div className={styles.repertoireTools}>
        {hasListening || hasRepeated ? (
          <div className={styles.filterChips} role="group" aria-label="Filtrar repertorio">
            <button className={filter === 'all' ? styles.activeChip : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')} type="button">Todas</button>
            {hasListening ? <button className={filter === 'listening' ? styles.activeChip : ''} aria-pressed={filter === 'listening'} onClick={() => setFilter('listening')} type="button">Con escucha</button> : null}
            {hasRepeated ? <button className={filter === 'repeated' ? styles.activeChip : ''} aria-pressed={filter === 'repeated'} onClick={() => setFilter('repeated')} type="button">Repetidas</button> : null}
          </div>
        ) : null}
        <label className={styles.repertoireSort}><span>Ordenar</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORTS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label className={styles.repertoireSearch}><span>Buscar marcha o autor</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título o autor" type="search" /></label>
      </div>
      <p className={styles.visibleWorks} aria-live="polite">{visible.length} {visible.length === 1 ? 'obra' : 'obras'}</p>
      {visible.length ? (
        <ol className={styles.workList}>
          {visible.map((entry) => (
            <WorkRow entry={entry} isHabitual={habitual.has(entryKey(entry))} bandName={bandName} key={entry.id} />
          ))}
        </ol>
      ) : <p className={styles.empty}>Ninguna obra coincide con la búsqueda.</p>}
    </>
  )
}
