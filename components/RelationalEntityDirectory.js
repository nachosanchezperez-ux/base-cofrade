'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import BrotherhoodDirectoryCrestImage from './BrotherhoodDirectoryCrestImage'
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

function compareText(first = '', second = '') {
  return String(first).localeCompare(String(second), 'es', { sensitivity: 'base' })
}

function isCapitalItem(item) {
  return ['sevilla', 'sevilla capital'].includes(normalize(item.municipality))
}

function bandTypeRank(value = '') {
  const normalized = normalize(value)
  if (normalized.includes('corneta') || normalized === 'cctt') return 0
  if (normalized.includes('agrupacion') || normalized === 'am') return 1
  if (normalized.includes('musica') || normalized === 'bm') return 2
  return 3
}

function compareBandItems(first, second) {
  const typeDifference = bandTypeRank(first.type) - bandTypeRank(second.type)
  if (typeDifference) return typeDifference

  const typeLabelDifference = compareText(first.type, second.type)
  if (typeLabelDifference) return typeLabelDifference

  const territoryDifference = (isCapitalItem(first) ? 0 : 1) - (isCapitalItem(second) ? 0 : 1)
  if (territoryDifference) return territoryDifference

  const municipalityDifference = compareText(first.municipality, second.municipality)
  if (municipalityDifference) return municipalityDifference

  return compareText(first.name, second.name)
}

function groupBandItems(items = []) {
  const types = new Map()

  ;[...items].sort(compareBandItems).forEach((item) => {
    const typeLabel = item.type || 'Formación musical'
    const typeKey = itemTypeSlug(item) || 'formacion-musical'

    if (!types.has(typeKey)) {
      types.set(typeKey, {
        key: typeKey,
        label: typeLabel,
        items: [],
      })
    }

    types.get(typeKey).items.push(item)
  })

  return [...types.values()]
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
  return ''
}

function RelationalCardMedia({ item, isBand, mediaPath, presentationClass }) {
  const [failed, setFailed] = useState(false)
  const hasMedia = Boolean(mediaPath) && !failed
  const shouldNormalizeBandLogo = isBand && item.logoPresentationMode !== 'integrated'

  return (
    <span className={`${enhancementStyles.media} ${contractStyles.media} ${isBand ? enhancementStyles.bandMedia : ''} ${presentationClass}`}>
      {hasMedia ? (
        shouldNormalizeBandLogo ? (
          <BrotherhoodDirectoryCrestImage
            className={enhancementStyles.bandLogoOptical}
            src={mediaPath}
            alt=""
            width={82}
            height={82}
            sizes="(max-width: 620px) 58px, 72px"
            maxScale={2.1}
            fallback={initials(item.name)}
            fallbackClassName={`${styles.monogram} ${enhancementStyles.monogram}`}
          />
        ) : (
          <Image
            src={mediaPath}
            alt=""
            fill
            sizes="(max-width: 620px) 58px, 72px"
            onError={() => setFailed(true)}
          />
        )
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
  const copy = KIND_COPY[kind] || KIND_COPY.image
  const isImage = kind === 'image'
  const isBand = kind === 'band'

  const types = useMemo(() => {
    const options = [...new Map(
      items
        .filter((item) => item.type)
        .map((item) => [itemTypeSlug(item), { value: itemTypeSlug(item), label: item.type }])
    ).values()]

    return options.sort((first, second) => {
      if (isBand) {
        const rankDifference = bandTypeRank(first.label) - bandTypeRank(second.label)
        if (rankDifference) return rankDifference
      }
      return compareText(first.label, second.label)
    })
  }, [items, isBand])

  const municipalities = useMemo(() => {
    const options = [...new Map(
      items
        .filter((item) => item.municipality)
        .map((item) => [item.municipalitySlug || slugify(item.municipality), {
          value: item.municipalitySlug || slugify(item.municipality),
          label: item.municipality === 'Sevilla' ? 'Sevilla capital' : item.municipality,
        }])
    ).values()]

    return options.sort((first, second) => {
      if (isBand) {
        const firstCapital = normalize(first.label) === 'sevilla capital' ? 0 : 1
        const secondCapital = normalize(second.label) === 'sevilla capital' ? 0 : 1
        if (firstCapital !== secondCapital) return firstCapital - secondCapital
      }
      return compareText(first.label, second.label)
    })
  }, [items, isBand])

  const filtered = useMemo(() => {
    const needle = normalize(query)
    return items.filter((item) => {
      const isCapital = isCapitalItem(item)
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

  const bandGroups = useMemo(() => isBand ? groupBandItems(filtered) : [], [filtered, isBand])
  const hasFilters = query || territory !== 'todos' || type !== 'todos' || municipality !== 'todos'

  function renderCard(item) {
    const mediaPath = item.coverPath || (isBand ? item.logoPath : '')
    const imageNames = compactNames(item.imageNames)
    const authorNames = compactNames(item.authorNames)
    const presentationClass = isBand ? bandMediaClass(item) : ''

    return (
      <Link
        className={`${styles.card} ${contractStyles.contract} ${enhancementStyles.card} ${isBand ? enhancementStyles.bandCard : ''}`}
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
          {!isBand ? <small>{[item.type, item.date].filter(Boolean).join(' · ')}</small> : null}
          {isBand ? (
            <>
              <span className={`${styles.context} ${enhancementStyles.clamped}`}>{item.officialName}</span>
              {item.municipality || item.foundation ? (
                <span className={`${styles.details} ${enhancementStyles.clamped}`}>
                  {[item.municipality, item.foundation ? `Desde ${item.foundation}` : ''].filter(Boolean).join(' · ')}
                </span>
              ) : null}
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
  }

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
          <span>
            {isBand
              ? 'Agrupadas por tipología musical; territorio y localidad disponibles como filtros'
              : 'Relaciones documentadas en Sevilla capital y provincia'}
          </span>
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
        isBand ? (
          <div className={enhancementStyles.bandGroups}>
            {bandGroups.map((typeGroup) => (
              <section className={enhancementStyles.bandTypeGroup} key={typeGroup.key}>
                <div className={enhancementStyles.bandTypeHeading}>
                  <strong>{typeGroup.label}</strong>
                  <span>{typeGroup.items.length}</span>
                </div>
                <div className={styles.grid}>
                  {typeGroup.items.map(renderCard)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(renderCard)}
          </div>
        )
      ) : (
        <div className={styles.empty}>
          <strong>No hay resultados con estos criterios</strong>
          <span>Prueba otra búsqueda o cambia los filtros.</span>
        </div>
      )}
    </div>
  )
}
