'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './crucetas.module.css'
import { plural } from '@/lib/plural'

function normalize(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function CrucetasDirectory({ repertoires }) {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const [municipality, setMunicipality] = useState('all')
  const years = useMemo(() => [...new Set(repertoires.map((item) => item.year).filter(Boolean))].sort((a, b) => b - a), [repertoires])
  const municipalities = useMemo(() => [...new Set(repertoires.map((item) => item.municipality?.name).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')), [repertoires])
  const visible = useMemo(() => {
    const needle = normalize(query.trim())
    return repertoires.filter((item) => {
      const haystack = normalize([item.displayTitle, item.band.name, item.brotherhood.name, item.municipality?.name].join(' '))
      return (!needle || haystack.includes(needle))
        && (year === 'all' || String(item.year) === year)
        && (municipality === 'all' || item.municipality?.name === municipality)
    })
  }, [municipality, query, repertoires, year])

  return (
    <>
      <div className={styles.directoryToolbar}>
        <label className={styles.searchField}>
          <span>Buscar Hermandad o Banda</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. San Gonzalo o Santa Ana" type="search" />
        </label>
        <label className={styles.filterField}>
          <span>Año</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="all">Todos</option>
            {years.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </label>
        <label className={styles.filterField}>
          <span>Municipio</span>
          <select value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
            <option value="all">Todos</option>
            {municipalities.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
        </label>
      </div>

      <div className={styles.resultLine} aria-live="polite">
        <strong>{visible.length}</strong> {visible.length === 1 ? 'cruceta encontrada' : 'crucetas encontradas'}
      </div>

      {visible.length ? (
        <div className={styles.directoryGrid}>
          {visible.map((item) => (
            <article className={styles.directoryCard} key={item.id} style={{ '--repertoire-primary': item.colors.primary, '--repertoire-accent': item.colors.accent }}>
              <div className={styles.cardTopline}><span>Repertorio interpretado</span><strong>{item.year}</strong></div>
              <h2><Link href={item.href}>{item.displayTitle}</Link></h2>
              <p className={styles.cardBand}>Por <strong>{item.band.name}</strong></p>
              <div className={styles.cardContext}>
                <span>{item.municipality?.name || 'Provincia de Sevilla'}</span>
                <span>{plural(item.worksCount, 'obra', 'obras')}</span>
                <span>{plural(item.performancesCount, 'interpretación', 'interpretaciones')}</span>
              </div>
              <Link className={styles.cardAction} href={item.href}>Ver cruceta <b aria-hidden="true">→</b></Link>
            </article>
          ))}
        </div>
      ) : <div className={styles.empty}>No hay crucetas que coincidan con estos filtros.</div>}
    </>
  )
}
