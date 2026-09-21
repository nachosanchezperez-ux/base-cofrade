'use client'

import Link from 'next/link'
import { useState } from 'react'
import { bandDirectoryFacets } from '@/lib/band-directory'
import styles from './BandDirectoryFacets.module.css'

function featuredHrefs(items, limit) {
  return new Set(
    [...items]
      .sort((first, second) => (
        second.count - first.count
        || String(first.label).localeCompare(String(second.label), 'es', { sensitivity: 'base' })
      ))
      .slice(0, limit)
      .map((item) => item.href)
  )
}

function FacetGroup({ title, eyebrow, items, mobileLimit, expandedLabel }) {
  const [expanded, setExpanded] = useState(false)
  if (!items.length) return null

  const featured = featuredHrefs(items, mobileLimit)
  const mobileOrder = new Map(
    [...items]
      .sort((first, second) => (
        second.count - first.count
        || String(first.label).localeCompare(String(second.label), 'es', { sensitivity: 'base' })
      ))
      .map((item, index) => [item.href, index])
  )

  return (
    <section className={styles.group}>
      <div className={styles.heading}>
        <h2>{title}</h2>
        <span>{eyebrow}</span>
      </div>
      <div className={`${styles.links} ${expanded ? styles.expanded : ''}`}>
        {items.map((item) => (
          <Link
            className={featured.has(item.href) ? '' : styles.mobileExtra}
            href={item.href}
            key={item.href}
            style={{ '--mobile-order': mobileOrder.get(item.href) }}
          >
            {item.label} <small>{item.count}</small>
          </Link>
        ))}
      </div>
      {items.length > mobileLimit ? (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <span>{expanded ? 'Ver menos' : `${expandedLabel} (${items.length})`}</span>
          <b aria-hidden="true">{expanded ? '↑' : '↓'}</b>
        </button>
      ) : null}
    </section>
  )
}

export default function BandDirectoryFacets({ bands }) {
  const facets = bandDirectoryFacets(bands)

  return (
    <nav className={styles.facets} aria-label="Explorar bandas por categoría">
      <FacetGroup
        title="Bandas por formación"
        eyebrow="Tipología musical"
        items={facets.types}
        mobileLimit={4}
        expandedLabel="Ver todas las tipologías"
      />
      <FacetGroup
        title="Bandas por localidad"
        eyebrow="Sevilla y provincia"
        items={facets.municipalities}
        mobileLimit={5}
        expandedLabel="Ver todas las localidades"
      />
    </nav>
  )
}
