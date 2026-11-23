'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { activeTab, showTabBar, TAB_ITEMS } from '@/lib/tab-bar'
import styles from './HiloTabBar.module.css'

// Barra inferior fija en móvil, como la de una aplicación. En las páginas que ya
// tienen su propia barra inferior (capítulos de la ficha de Hermandad) se aparta.
// «Buscar» abre el buscador global (components/GlobalHiloSearch.js).

const ICONS = {
  inicio: <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />,
  agenda: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  programa: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  hermandades: <path d="M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />,
  buscar: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </>
  ),
}

function TabIcon({ name }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  )
}

export default function HiloTabBar() {
  const pathname = usePathname()
  if (!showTabBar(pathname)) return null
  const current = activeTab(pathname)

  return (
    <nav className={styles.bar} aria-label="Accesos rápidos" data-hilo-tabbar>
      <ul className={styles.list}>
        {TAB_ITEMS.map((item) => (
          <li key={item.key}>
            {item.action === 'search' ? (
              <button
                type="button"
                className={styles.tab}
                onClick={() => window.dispatchEvent(new CustomEvent('hilo:request-search'))}
              >
                <TabIcon name={item.key} />
                <span>{item.label}</span>
              </button>
            ) : (
              <Link
                className={`${styles.tab} ${current === item.key ? styles.active : ''}`}
                href={item.href}
                aria-current={current === item.key ? 'page' : undefined}
                aria-label={item.key === 'programa' ? 'Programa de mano 2027' : undefined}
              >
                <TabIcon name={item.key} />
                <span>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
