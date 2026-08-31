'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import contractStyles from './DirectoryCardContract.module.css'
import enhancementStyles from './RelationalEntityDirectoryEnhancements.module.css'
import styles from './RelationalEntityDirectory.module.css'

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

function compactNames(items = [], limit = 2) {
  const names = [...new Set(items.filter(Boolean))]
  if (names.length <= limit) return names.join(', ')
  return `${names.slice(0, limit).join(', ')} · +${names.length - limit}`
}

function itemTypeSlug(item) {
  return item.typeSlug || slugify(item.type)
}

const KIND_COPY = {
  image: {
    singular: 'imagen publicada',
    plural: 'imágenes publicadas',
    placeholder: 'Ej. Piedad, San José, Cantillana, Ortega Bru…',
  },
  step: {
    singular: 'paso publicado',
    plural: 'pasos publicados',
    placeholder: 'Ej. paso de palio, Baratillo, Cantillana, talla…',
  },
  band: {
    singular: 'banda publicada',
    plural: 'bandas publicadas',
    placeholder: 'Ej. Las Cigarreras, Cantillana, cornetas y tambores…',
  },
}

function bandMediaClass(item) {
  if (item.logoPresentationMode === 'integrated') return enhancementStyles.bandMediaIntegrated
  if (item.logoPresentationMode === 'wide') return enhancementStyles.bandMediaWide
  return ''
}

function RelationalCardMedia({ item, isBand, mediaPath, presentationClass }) {
  const [failed, setFailed] = useState(false)
  const hasMedia = Boolean(mediaPath) && !failed

  return (
    <span className={`${enhancementStyles.media} ${contractStyles.media} ${isBand ? enhancementStyles.bandMedia : ''} ${presentationClass}`}>
      {hasMedia ? (
        <Image
          src={mediaPath}
          alt=""
          fill
          sizes="(max-width: 620px) 58px, 72px"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={`${styles.monogram} ${enhancementStyles.monogram}`}>{initials(item.name)}</span>
      )}
    </span>
  )
}

export default function RelationalEntityDirectory({
  items,
  kind,
  initialTypeSlug = '',
  initialMunicipalitySlug = '',
}) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [type, setType] = useState(initialTypeSlug || 'todos')
  const [municipality, setMunicipality] = useState(initialMunicipalitySlug || 'todos')

  const types = useMemo(() => [...new Map(
    items
      .filter((item) => item.type)
      .map((item) => [itemTypeSlug(item), { value: itemTypeSlug(item), label: item.type }])
  ).values()].sort((first, second) => first.label.localeCompare(second.label, 'es', { sensitivity: 'base' })), [items])

  const municipalities = useMemo(() => [...new Map(
    items
      .filter((item) => item.municipality)
      .map((item) => [item.municipalitySlug || slugify(item.municipality), {
        value: item.municipalitySlug || slugify(item.municipality),
        label: item.municipality === 'Sevilla' ? 'Sevilla capital' : item.municipality,
      }])
  ).values()].sort((first, second) => first.label.localeCompare(second.label, 'es', { sensitivity: 'base' })), [items])

  const filtered = useMemo(() => {
    const needle = normalize(query)
    return items.filter((item) => {
      const isCapital = ['sevilla', 'sevilla capital'].includes(normalize(item.municipality))
      const matchesTerritory = territory === 'todos'
        || (territory === 'sevilla-capital' && isCapital)
        || (territory === 'provincia' && !isCapital)
      const matchesType = type === 'todos' || itemTypeSlug(item) === type
      const matchesMunicipality = municipality === 'todos'
        || (item.municipalitySlug || slugify(item.municipality)) === municipality
      const haystack = normalize([
        item.name,
        item.officialName,
        item.type,
        item.date,
        item.foundation,
        item.brotherhoodName,
        item.linkedBrotherhood,
        item.municipality,
        item.place,
        ...(item.authorNames || []),
        ...(item.imageNames || []),
        ...(item.disciplines || []),
        ...(item.keywords || []),
      ].filter(Boolean).join(' '))
      return matchesTerritory && matchesType && matchesMunicipality && (!needle || haystack.includes(needle))
    })
  }, [items, query, territory, type, municipality])

  const copy = KIND_COPY[kind] || KIND_COPY.image
  const isImage = kind === 'image'
  const isBand = kind === 'band'
  const hasFilters = query || territory !== 'todos' || type !== 'todos' || municipality !== 'todos'

  return (
    <div className={styles.directory}>
      <div className={styles.searchPanel}>
        <label className={styles.searchRow} htmlFor={`directory-search-${kind}`}>
          <span className="sr-only">Buscar en el directorio de {copy.plural}</span>
          <input
            id={`directory-search-${kind}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={`Buscar en el directorio de ${copy.plural}`}
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
                aria-pressed={territory === value}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={enhancementStyles.selects}>
            <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filtrar por tipología">
              <option value="todos">Todas las tipologías</option>
              {types.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
            <select value={municipality} onChange={(event) => setMunicipality(event.target.value)} aria-label="Filtrar por localidad">
              <option value="todos">Todas las localidades</option>
              {municipalities.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.resultHead} aria-live="polite" aria-atomic="true">
        <div>
          <strong>{filtered.length} {filtered.length === 1 ? copy.singular : copy.plural}</strong>
          <span>Relaciones documentadas en Sevilla capital y provincia</span>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setTerritory('todos')
              setType('todos')
              setMunicipality('todos')
            }}
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {filtered.length ? (
        <div className={styles.grid}>
          {filtered.map((item) => {
            const mediaPath = item.coverPath || (isBand ? item.logoPath : '')
            const imageNames = compactNames(item.imageNames)
            const authorNames = compactNames(item.authorNames)
            const presentationClass = isBand ? bandMediaClass(item) : ''

            return (
              <Link
                className={`${styles.card} ${contractStyles.contract} ${enhancementStyles.card} ${isBand ? enhancementStyles.bandCard : ''}`}
                data-logo-presentation={isBand ? item.logoPresentationMode : undefined}
                href={item.href}
                key={item.id}
                aria-label={`Abrir ficha de ${item.name}`}
                style={isBand ? {
                  '--entity-accent': item.primaryColor || '#63358B',
                  '--entity-secondary': item.secondaryColor || '#29272C',
                  '--logo-background': item.logoBackgroundColor || undefined,
                } : undefined}
              >
                <RelationalCardMedia
                  item={item}
                  isBand={isBand}
                  mediaPath={mediaPath}
                  presentationClass={presentationClass}
                />
                <span className={`${styles.cardCopy} ${contractStyles.copy} ${enhancementStyles.cardCopy}`}>
                  <strong>{item.name}</strong>
                  <small>{[item.type, item.date].filter(Boolean).join(' · ')}</small>
                  {isBand ? (
                    <>
                      <span className={`${styles.context} ${enhancementStyles.clamped}`}>{item.officialName}</span>
                      <span className={`${styles.details} ${enhancementStyles.clamped}`}>
                        {item.municipality}{item.foundation ? ` · Desde ${item.foundation}` : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      {[item.brotherhoodName, item.municipality].filter(Boolean).length ? (
                        <span className={`${styles.context} ${enhancementStyles.clamped}`}>
                          {[item.brotherhoodName, item.municipality].filter(Boolean).join(' · ')}
                        </span>
                      ) : null}
                      {isImage ? (
                        authorNames || item.place ? (
                          <span className={`${styles.details} ${enhancementStyles.clamped}`}>
                            {authorNames ? `Autoría: ${authorNames}` : ''}
                            {item.place ? `${authorNames ? ' · ' : ''}${item.place}` : ''}
                          </span>
                        ) : null
                      ) : (
                        imageNames || authorNames ? (
                          <span className={`${styles.details} ${enhancementStyles.clamped}`}>
                            {imageNames ? `Procesionan: ${imageNames}` : ''}
                            {authorNames ? `${imageNames ? ' · ' : ''}Autoría/taller: ${authorNames}` : ''}
                          </span>
                        ) : null
                      )}
                    </>
                  )}
                </span>
                <span className={`${styles.arrow} ${contractStyles.action}`} aria-hidden="true">→</span>
              </Link>
            )
          })}
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
