'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './EntityWorkspaceNav.module.css'

function isActive(pathname, item) {
  if (item.match === 'exact') return pathname === item.href
  if (item.activePath) return pathname === item.activePath || pathname.startsWith(`${item.activePath}/`)
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

export default function EntityWorkspaceNav({ eyebrow = 'Espacio de trabajo', description, items = [] }) {
  const pathname = usePathname()

  return (
    <section className={styles.shell} aria-label="Navegación de la ficha">
      <div className={styles.copy}>
        <span>{eyebrow}</span>
        {description ? <p>{description}</p> : null}
      </div>
      <nav className={styles.nav} aria-label="Secciones de la entidad">
        {items.map((item) => {
          const active = isActive(pathname, item)
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`${styles.link} ${active ? styles.active : ''} ${item.tool ? styles.tool : ''}`.trim()}
              aria-current={active ? 'page' : undefined}
            >
              {item.mark ? <span aria-hidden="true">{item.mark}</span> : null}
              <strong>{item.label}</strong>
            </Link>
          )
        })}
      </nav>
    </section>
  )
}
