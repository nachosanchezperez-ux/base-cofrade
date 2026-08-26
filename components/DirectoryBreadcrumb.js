import Link from 'next/link'
import styles from './DirectoryBreadcrumb.module.css'

export default function DirectoryBreadcrumb({ items = [] }) {
  if (!items.length) return null

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.accent} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
