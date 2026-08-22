'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/panel/login/actions'
import { PANEL_ROLES } from '@/lib/panel/roles'
import styles from './PanelNav.module.css'

const NAV_GROUPS = [
  {
    label: 'Inicio',
    items: [
      { href: '/panel', label: 'Resumen', mark: 'R' },
      { href: '/panel/hoy', label: 'Hoy', mark: 'Ho' },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/panel/hermandades', label: 'Hermandades', mark: 'H' },
      { href: '/panel/imagenes', label: 'Imágenes', mark: 'I' },
      { href: '/panel/pasos', label: 'Pasos', mark: 'P' },
      { href: '/panel/bandas', label: 'Bandas', mark: 'B' },
      { href: '/panel/marchas', label: 'Marchas', mark: 'Ma' },
      { href: '/panel/acontecimientos', label: 'Acontecimientos', mark: 'A' },
    ],
  },
  {
    label: 'Conocimiento',
    items: [
      { href: '/panel/agentes', label: 'Personas', mark: 'Pe' },
      { href: '/panel/multimedia', label: 'Multimedia', mark: 'Mu' },
      { href: '/panel/fuentes', label: 'Fuentes', mark: 'F' },
      { href: '/panel/relaciones', label: 'Relaciones', mark: '↔' },
    ],
  },
]

const MOBILE_PRIMARY = new Set([
  '/panel',
  '/panel/hermandades',
  '/panel/imagenes',
  '/panel/pasos',
])

function isActive(pathname, href) {
  return href === '/panel' ? pathname === '/panel' : pathname.startsWith(href)
}

function NavLink({ item, pathname, className = '', onClick }) {
  const active = isActive(pathname, item.href)
  return (
    <Link
      href={item.href}
      className={`${styles.navLink} ${active ? styles.navActive : ''} ${className}`.trim()}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className={styles.navMark} aria-hidden="true">{item.mark}</span>
      <span className={styles.navLabel}>{item.label}</span>
    </Link>
  )
}

export default function PanelNav({ user }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const groups = user.role === 'admin'
    ? [...NAV_GROUPS, { label: 'Administración', items: [{ href: '/panel/equipo', label: 'Equipo', mark: 'E' }] }]
    : NAV_GROUPS
  const items = groups.flatMap((group) => group.items)
  const primaryItems = items.filter((item) => MOBILE_PRIMARY.has(item.href))
  const moreActive = items.some((item) => !MOBILE_PRIMARY.has(item.href) && isActive(pathname, item.href))

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <aside className={styles.sidebar}>
      <Link href="/panel" className={styles.panelBrand} aria-label="Hilo Cofrade, panel">
        <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
        <span className={styles.brandCopy}><strong>Hilo</strong> Cofrade<small>Panel editorial</small></span>
      </Link>

      <nav className={styles.desktopNav} aria-label="Navegación del panel">
        {groups.map((group) => (
          <section className={styles.navGroup} key={group.label}>
            <span className={styles.groupLabel}>{group.label}</span>
            <div className={styles.groupLinks}>
              {group.items.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
            </div>
          </section>
        ))}
      </nav>

      <div className={styles.sidebarFoot}>
        <div className={styles.userCard}>
          <span className={styles.avatar}>{user.name.slice(0, 2).toUpperCase()}</span>
          <span className={styles.userCopy}><strong>{user.name}</strong><small>{PANEL_ROLES[user.role]}</small></span>
        </div>
        <form action={signOutAction}>
          <button className={styles.signOut} type="submit">Cerrar sesión</button>
        </form>
      </div>

      <nav className={styles.mobileBar} aria-label="Navegación rápida del panel">
        {primaryItems.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} className={styles.mobilePrimaryLink} />
        ))}
        <button
          className={`${styles.mobileMenuButton} ${(mobileOpen || moreActive) ? styles.mobileMenuButtonActive : ''}`}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="panel-mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className={styles.navMark} aria-hidden="true">•••</span>
          <span className={styles.navLabel}>Menú</span>
        </button>
      </nav>

      {mobileOpen ? (
        <>
          <button className={styles.mobileBackdrop} type="button" aria-label="Cerrar menú" onClick={() => setMobileOpen(false)} />
          <div className={styles.mobileMenu} id="panel-mobile-menu" role="dialog" aria-label="Todos los módulos del panel">
            <div className={styles.mobileMenuHead}>
              <div><span>Panel editorial</span><strong>Todos los módulos</strong></div>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">×</button>
            </div>

            <div className={styles.mobileGroups}>
              {groups.map((group) => {
                const groupItems = group.items.filter((item) => !MOBILE_PRIMARY.has(item.href))
                if (!groupItems.length) return null
                return (
                  <section className={styles.mobileGroup} key={group.label}>
                    <span className={styles.mobileGroupLabel}>{group.label}</span>
                    <div className={styles.mobileGroupLinks}>
                      {groupItems.map((item) => (
                        <NavLink key={item.href} item={item} pathname={pathname} onClick={() => setMobileOpen(false)} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>

            <div className={styles.mobileUserRow}>
              <div className={styles.userCard}>
                <span className={styles.avatar}>{user.name.slice(0, 2).toUpperCase()}</span>
                <span className={styles.userCopy}><strong>{user.name}</strong><small>{PANEL_ROLES[user.role]}</small></span>
              </div>
              <form action={signOutAction}>
                <button className={styles.mobileSignOut} type="submit">Cerrar sesión</button>
              </form>
            </div>
          </div>
        </>
      ) : null}
    </aside>
  )
}
