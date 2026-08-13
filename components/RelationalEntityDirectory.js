'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import styles from './RelationalEntityDirectory.module.css'

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function initials(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase()
}

export default function RelationalEntityDirectory({ items, kind }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [type, setType] = useState('todos')

  const types = useMemo(() => [...new Set(items.map((item) => item.type).filter(Boolean))].sort(), [items])

  const filtered = useMemo(() => {
    const needle = normalize(query)
    return items.filter((item) => {
      const isCapital = normalize(item.municipality) === 'sevilla'
      const matchesTerritory = territory === 'todos'
        || (territory === 'sevilla-capital' && isCapital)
        || (territory === 'provincia' && !isCapital)
      const matchesType = type === 'todos' || item.type === type
      const haystack = normalize([
        item.name,
        item.type,
        item.date,
        item.brotherhoodName,
        item.municipality,
        item.place,
        ...(item.authorNames || []),
        ...(item.imageNames || []),
        ...(item.disciplines || []),
      ].filter(Boolean).join(' '))
      return matchesTerritory && matchesType && (!needle || haystack.includes(needle))
    })
  }, [items, query, territory, type])

  const isImage = kind === 'image'

  return (
    <div className={styles.directory}>
      <div className={styles.searchPanel}>
        <label className={styles.searchRow}>
          <span className="sr-only">Buscar</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isImage ? 'Ej. Piedad, San José, Cantillana, Ortega Bru…' : 'Ej. paso de palio, Baratillo, Cantillana, talla…'}
          />
          <span className={styles.searchIcon} aria-hidden="true">⌕</span>
        </label>

        <div className={styles.filters}>
          <div className={styles.pills} aria-label="Filtrar por territorio">
            {[
              ['todos', 'Todos'],
              ['sevilla-capital', 'Sevilla capital'],
              ['provincia', 'Provincia'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={territory === value ? styles.activePill : ''}
                onClick={() => setTerritory(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar por tipología">
            <option value="todos">Todas las tipologías</option>
            {types.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.resultHead}>
        <div>
          <strong>{filtered.length} {isImage ? (filtered.length === 1 ? 'imagen publicada' : 'imágenes publicadas') : (filtered.length === 1 ? 'paso publicado' : 'pasos publicados')}</strong>
          <span>Relaciones documentadas en Sevilla capital y provincia</span>
        </div>
        {query || territory !== 'todos' || type !== 'todos' ? (
          <button type="button" onClick={() => { setQuery(''); setTerritory('todos'); setType('todos') }}>Limpiar filtros</button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((item) => (
            <Link className={styles.card} href={item.href} key={item.id}>
              <span className={styles.monogram}>{initials(item.name)}</span>
              <span className={styles.cardCopy}>
                <small>{item.type}{item.date ? ` · ${item.date}` : ''}</small>
                <strong>{item.name}</strong>
                <span className={styles.context}>
                  {[item.brotherhoodName, item.municipality].filter(Boolean).join(' · ') || 'Relación territorial por documentar'}
                </span>
                {isImage ? (
                  <span className={styles.details}>
                    {item.authorNames?.length ? `Autoría: ${item.authorNames.join(', ')}` : 'Autoría pendiente de documentar'}
                    {item.place ? ` · ${item.place}` : ''}
                  </span>
                ) : (
                  <span className={styles.details}>
                    {item.imageNames?.length ? `Procesionan: ${item.imageNames.join(', ')}` : 'Imágenes vinculadas por documentar'}
                    {item.authorNames?.length ? ` · Autoría/taller: ${item.authorNames.join(', ')}` : ''}
                  </span>
                )}
              </span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <strong>No hay resultados con estos criterios</strong>
          <span>Prueba otra búsqueda o cambia los filtros.</span>
        </div>
      )}
    </div>
  )
}
