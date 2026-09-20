import Link from 'next/link'
import { heritageDirectoryLocalities } from '@/lib/heritage-directory'
import styles from './DirectoryLocalityFacets.module.css'

export default function DirectoryLocalityFacets({ items, section, title }) {
  const localities = heritageDirectoryLocalities(items, section)
  if (!localities.length) return null

  return (
    <nav className={styles.facets} aria-label={`Explorar ${title.toLowerCase()} por localidad`}>
      <div className={styles.heading}>
        <h2>{title} por localidad</h2>
        <span>Sevilla y provincia</span>
      </div>
      <div className={styles.links}>
        {localities.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label} <small>{item.count}</small>
          </Link>
        ))}
      </div>
    </nav>
  )
}
