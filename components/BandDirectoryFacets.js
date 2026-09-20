import Link from 'next/link'
import { bandDirectoryFacets } from '@/lib/band-directory'
import styles from './BandDirectoryFacets.module.css'

function FacetGroup({ title, eyebrow, items }) {
  if (!items.length) return null

  return (
    <section className={styles.group}>
      <div className={styles.heading}>
        <h2>{title}</h2>
        <span>{eyebrow}</span>
      </div>
      <div className={styles.links}>
        {items.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label} <small>{item.count}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function BandDirectoryFacets({ bands }) {
  const facets = bandDirectoryFacets(bands)

  return (
    <nav className={styles.facets} aria-label="Explorar bandas por categoría">
      <FacetGroup title="Bandas por formación" eyebrow="Tipología musical" items={facets.types} />
      <FacetGroup title="Bandas por localidad" eyebrow="Sevilla y provincia" items={facets.municipalities} />
    </nav>
  )
}
