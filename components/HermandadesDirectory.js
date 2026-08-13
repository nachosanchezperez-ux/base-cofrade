'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import BrotherhoodDirectoryCard from '@/components/BrotherhoodDirectoryCard'
import {
  DIRECTORY_TYPES,
  displayName,
  hasDirectoryType,
  normalizeDirectoryValue,
  sortBrotherhoods,
} from '@/lib/brotherhood-directory'
import styles from './HermandadesDirectory.module.css'

export default function HermandadesDirectory({ hermandades }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')

  const counts = useMemo(() => Object.fromEntries(
    DIRECTORY_TYPES.map((type) => [
      type.key,
      hermandades.filter((item) => hasDirectoryType(item, type.key)).length,
    ])
  ), [hermandades])

  const filtered = useMemo(() => {
    const value = normalizeDirectoryValue(query)
    return sortBrotherhoods(hermandades.filter((item) => {
      const isCapital = normalizeDirectoryValue(item.localidad) === 'sevilla'
      const matchesTerritory = territory === 'todos'
        || (territory === 'sevilla-capital' && isCapital)
        || (territory === 'provincia' && !isCapital)
      const haystack = [
        displayName(item),
        item.nombreOficial,
        item.sede,
        item.localidad,
        item.barrio,
        item.diaSalida,
        ...(item.tipos || []),
      ].filter(Boolean).join(' ')

      return matchesTerritory && (!value || normalizeDirectoryValue(haystack).includes(value))
    }))
  }, [query, territory, hermandades])

  return (
    <div className={styles.directory}>
      <div className={styles.categoryGrid}>
        {DIRECTORY_TYPES.map((type) => (
          <Link className={styles.categoryCard} href={type.href} key={type.key}>
            <span className={styles.categoryIcon} aria-hidden="true">
              <Image src={type.icon} alt="" width={78} height={78} sizes="78px" />
            </span>
            <span className={styles.categoryCopy}>
              <small>{counts[type.key]} {counts[type.key] === 1 ? 'hermandad' : 'hermandades'}</small>
              <strong>{type.label}</strong>
              <span>{type.description}</span>
            </span>
            <span className={styles.categoryArrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </div>

      <div className={styles.explorer}>
        <div className={styles.explorerHeading}>
          <span>Encuentra una hermandad</span>
          <strong>Busca por nombre, templo o localidad</strong>
        </div>

        <div className={styles.searchPanel}>
          <label className={styles.searchRow}>
            <span className="sr-only">Buscar hermandad</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. El Baratillo, Cantillana, Capilla de la Piedad…"
            />
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
          </label>

          <div className={styles.territories} aria-label="Filtrar por territorio">
            {[
              ['todos', 'Todos'],
              ['sevilla-capital', 'Sevilla capital'],
              ['provincia', 'Provincia'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={territory === value ? styles.activeTerritory : ''}
                onClick={() => setTerritory(value)}
                aria-pressed={territory === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.resultHead}>
          <div>
            <strong>{filtered.length} {filtered.length === 1 ? 'hermandad' : 'hermandades'}</strong>
            <span>Sevilla capital y provincia</span>
          </div>
          {query || territory !== 'todos' ? (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setTerritory('todos')
              }}
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {filtered.length ? (
          <div className={styles.list}>
            {filtered.map((hermandad) => (
              <BrotherhoodDirectoryCard key={hermandad.id} hermandad={hermandad} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay hermandades disponibles con estos criterios</strong>
            <span>Prueba otra búsqueda o cambia el territorio.</span>
          </div>
        )}
      </div>
    </div>
  )
}
