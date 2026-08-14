'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/panel/login/actions'
import { PANEL_ROLES } from '@/lib/panel/roles'
import styles from '@/app/panel/panel.module.css'

const baseItems = [
  { href: '/panel', label: 'Resumen', mark: 'R' },
  { href: '/panel/hermandades', label: 'Hermandades', mark: 'H' },
  { href: '/panel/imagenes', label: 'Imágenes', mark: 'I' },
  { href: '/panel/pasos', label: 'Pasos', mark: 'P' },
  { href: '/panel/agentes', label: 'Agentes', mark: 'A' },
  { href: '/panel/bandas', label: 'Bandas', mark: 'B' },
  { href: '/panel/relaciones', label: 'Relaciones', mark: '↔' },
]

export default function PanelNav({ user }) {
  const pathname = usePathname()
  const items = user.role === 'admin'
    ? [...baseItems, { href: '/panel/equipo', label: 'Equipo', mark: 'E' }]
    : baseItems

  return (
    <aside className={styles.sidebar}>
      <Link href="/panel" className={styles.panelBrand} aria-label="Hilo Cofrade, panel">
        <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
        <span><strong>Hilo</strong> Cofrade<small>Panel editorial</small></span>
      </Link>

      <nav className={styles.panelNav} aria-label="Navegación del panel">
        {items.map((item) => {
          const active = item.href === '/panel'
            ? pathname === '/panel'
            : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className={active ? styles.navActive : ''}>
              <span>{item.mark}</span>{item.label}
            </Link>
          )
        })}
      </nav>

      <div className={styles.sidebarFoot}>
        <div className={styles.userCard}>
          <span className={styles.avatar}>{user.name.slice(0, 2).toUpperCase()}</span>
          <span><strong>{user.name}</strong><small>{PANEL_ROLES[user.role]}</small></span>
        </div>
        <form action={signOutAction}>
          <button className={styles.signOut} type="submit">Cerrar sesión</button>
        </form>
      </div>
    </aside>
  )
}
