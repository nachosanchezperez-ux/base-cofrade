'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from '../crucetas.module.css'

function normalize(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function authorNames(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  return (composers.length ? composers : entry.authors).map((author) => author.name).join(' · ') || entry.credit || ''
}

function secondaryAuthors(entry) {
  const composers = entry.authors.filter((author) => author.role === 'composer')
  if (!composers.length) return []
  return entry.authors.filter((author) => author.role !== 'composer')
}

function AuthorList({ authors, fallback }) {
  const composers = authors.filter((author) => author.role === 'composer')
  const items = composers.length ? composers : authors
  if (!items.length) return fallback || 'No documentada'

  return items.map((author, index) => (
    <span key={author.id}>{index ? ' · ' : ''}{author.href ? <Link href={author.href}>{author.name}</Link> : author.name}</span>
  ))
}

export default function RepertoireExplorer({ entries }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const visible = useMemo(() => {
    const needle = normalize(query.trim())
    return entries.filter((entry) => {
      const matchesFilter = filter === 'all' || (filter === 'listening' && entry.listening) || (filter === 'repeated' && entry.isRepeated)
      const matchesQuery = !needle || normalize(`${entry.title} ${authorNames(entry)}`).includes(needle)
      return matchesFilter && matchesQuery
    })
  }, [entries, filter, query])

  return (
    <>
      <div className={styles.repertoireTools}>
        <div className={styles.filterChips} aria-label="Filtrar repertorio">
          <button className={filter === 'all' ? styles.activeChip : ''} onClick={() => setFilter('all')} type="button">Todas</button>
          <button className={filter === 'listening' ? styles.activeChip : ''} onClick={() => setFilter('listening')} type="button">Con escucha</button>
          <button className={filter === 'repeated' ? styles.activeChip : ''} onClick={() => setFilter('repeated')} type="button">Repetidas</button>
        </div>
        <label className={styles.repertoireSearch}><span>Buscar marcha o autor</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título o autor" type="search" /></label>
      </div>
      <p className={styles.visibleWorks} aria-live="polite">{visible.length} {visible.length === 1 ? 'entrada visible' : 'entradas visibles'}</p>
      <div className={styles.worksGrid}>
        {visible.map((entry) => (
          <article className={styles.workCard} key={entry.id}>
            <div className={styles.note} aria-hidden="true">♪</div>
            <div className={styles.workCopy}>
              <div className={styles.workTitle}><span>{entry.workType || 'Marcha vinculada'}{entry.compositionYear ? ` · ${entry.compositionYear}` : ''}</span><h3>{entry.marchHref ? <Link href={entry.marchHref}>{entry.title} <b aria-hidden="true">→</b></Link> : entry.title}</h3></div>
              <dl className={styles.workRelations}>
                <div><dt>Autoría</dt><dd><AuthorList authors={entry.authors} fallback={entry.credit} /></dd>{secondaryAuthors(entry).map((author) => <small key={`${entry.id}-${author.id}`}>{author.role === 'adapter' ? 'Adaptación' : author.role === 'lyricist' ? 'Letra' : 'Autoría'}: {author.name}</small>)}</div>
                {entry.dedications.length ? <div><dt>Dedicatoria</dt><dd>{entry.dedications.map((dedication, index) => <span key={`${dedication.id}-${index}`}>{index ? ' · ' : ''}{dedication.href ? <Link href={dedication.href}>{dedication.name}</Link> : dedication.name}</span>)}</dd></div> : null}
              </dl>
            </div>
            <div className={styles.workActions}>
              {entry.count > 1 ? <strong className={styles.count} aria-label={`${entry.count} interpretaciones`}>×{entry.count}</strong> : null}
              {entry.marchHref ? <Link className={styles.profileAction} href={entry.marchHref}>Ver ficha</Link> : null}
              {entry.listening ? <a className={styles.listen} href={entry.listening.url} target="_blank" rel="noopener noreferrer" aria-label={`Escuchar ${entry.title} en ${entry.listening.provider}`} data-hilo-event="repertoire_listen_click" data-hilo-provider={entry.listening.provider.toLowerCase()}><span aria-hidden="true">▶</span><span>Escuchar <small>{entry.listening.provider}</small></span></a> : null}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
