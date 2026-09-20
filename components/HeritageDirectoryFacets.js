import Link from 'next/link'
import {
  heritageDirectoryLocalities,
  heritageDirectoryTypes,
} from '@/lib/heritage-directory'
import styles from './HeritageDirectoryFacets.module.css'

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

export default function HeritageDirectoryFacets({ items, section, title }) {
  const types = heritageDirectoryTypes(items, section)
  const localities = heritageDirectoryLocalities(items, section)

  return (
    <nav className={styles.facets} aria-label={`Explorar ${title.toLowerCase()} por categoría`}>
      <FacetGroup title={`${title} por tipología`} eyebrow="Clasificación normalizada" items={types} />
      <FacetGroup title={`${title} por localidad`} eyebrow="Sevilla y provincia" items={localities} />
    </nav>
  )
}
