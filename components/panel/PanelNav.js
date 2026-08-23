'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/app/panel/login/actions'
import { PANEL_ROLES } from '@/lib/panel/roles'
import styles from './PanelNav.module.css'

const NAV_GROUPS = [
  {
    label: 'Inicio',
    items: [
      { href: '/panel', label: 'Resumen', mobileLabel: 'Inicio', mark: '⌂' },
      { href: '/panel/hoy', label: 'Hoy', mark: '24' },
    ],
  },
  {
    label: 'Contenido',
    items: [
      { href: '/panel/hermandades', label: 'Hermandades', mark: 'H' },
      { href: '/panel/imagenes', label: 'Imágenes', mark: 'I' },
      { href: '/panel/pasos', label: 'Pasos', mark: 'P' },
      { href: '/panel/bandas', label: 'Bandas', mark: 'B' },
      { href: '/panel/marchas', label: 'Marchas', mark: '♫' },
      { href: '/panel/extraordinarias', label: 'Extraordinarias', mark: '✦' },
      { href: '/panel/acontecimientos', label: 'Acontecimientos', mark: 'A' },
    ],
  },
  {
    label: 'Documentación',
    items: [
      { href: '/panel/agentes', label: 'Personas', mark: 'Pe' },
      { href: '/panel/fuentes', label: 'Fuentes', mark: 'F' },
      { href: '/panel/multimedia', label: 'Multimedia', mark: 'Mu' },
      { href: '/panel/relaciones', label: 'Relaciones', mark: '↔' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/panel/datos', label: 'Datos', mark: 'D' },
    ],
  },
]

function normalize(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function isActive(pathname, href) {
  return href === '/panel' ? pathname === '/panel' : pathname.startsWith(href)
}

function NavLink({ item, pathname, className = '', onClick, mobile = false }) {
  const active = isActive(pathname, item.href)

  return (
    <Link
      href={item.href}
      className={`${styles.navLink} ${active ? styles.navActive : ''} ${className}`.trim()}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className={styles.navMark} aria-hidden="true">{item.mark}</span>
      <span className={styles.navLabel}>{mobile ? (item.mobileLabel || item.label) : item.label}</span>
    </Link>
  )
}

function MobileCommand({ mark, label, onClick, disabled = false }) {
  return (
    <button className={styles.mobileCommandButton} type="button" onClick={onClick} disabled={disabled}>
      <span className={styles.navMark} aria-hidden="true">{mark}</span>
      <span className={styles.navLabel}>{label}</span>
    </button>
  )
}

export default function PanelNav({ user }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moduleQuery, setModuleQuery] = useState('')
  const canEdit = ['admin', 'editor'].includes(user.role)

  const groups = useMemo(() => NAV_GROUPS.map((group) => {
    if (group.label !== 'Sistema' || user.role !== 'admin') return group
    return {
      ...group,
      items: [...group.items, { href: '/panel/equipo', label: 'Equipo', mark: 'E' }],
    }
  }), [user.role])

  const normalizedQuery = normalize(moduleQuery)
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: normalizedQuery
        ? group.items.filter((item) => normalize(`${item.label} ${group.label}`).includes(normalizedQuery))
        : group.items,
    }))
    .filter((group) => group.items.length)
  const homeItem = groups[0].items[0]
  const moreActive = pathname !== '/panel'

  useEffect(() => {
    setMobileOpen(false)
    setModuleQuery('')
  }, [pathname])

  function closeMobileMenu() {
    setMobileOpen(false)
    setModuleQuery('')
  }

  function openCommand(mode) {
    closeMobileMenu()
    window.dispatchEvent(new CustomEvent('panel-command-open', { detail: { mode } }))
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/panel" className={styles.panelBrand} aria-label="Hilo Cofrade, panel">
        <span className={styles.brandRail} aria-hidden="true"><i /><b /></span>
        <span className={styles.brandCopy}><strong>Hilo</strong> Cofrade<small>Panel editorial</small></span>
      </Link>

      <button className={styles.quickSearch} type="button" onClick={() => openCommand('search')}>
        <span aria-hidden="true">⌕</span>
        <strong>Buscar en el Panel</strong>
        <kbd>⌘K</kbd>
      </button>

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
        <NavLink item={homeItem} pathname={pathname} className={styles.mobilePrimaryLink} mobile />
        <MobileCommand mark="⌕" label="Buscar" onClick={() => openCommand('search')} />
        <MobileCommand mark="↺" label="Recientes" onClick={() => openCommand('recent')} />
        <MobileCommand mark="＋" label="Nuevo" onClick={() => openCommand('new')} disabled={!canEdit} />
        <button
          className={`${styles.mobileMenuButton} ${(mobileOpen || moreActive) ? styles.mobileMenuButtonActive : ''}`}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="panel-mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className={styles.navMark} aria-hidden="true">☰</span>
          <span className={styles.navLabel}>Menú</span>
        </button>
      </nav>

      {mobileOpen ? (
        <>
          <button className={styles.mobileBackdrop} type="button" aria-label="Cerrar menú" onClick={closeMobileMenu} />
          <div className={styles.mobileMenu} id="panel-mobile-menu" role="dialog" aria-modal="true" aria-label="Todos los módulos del panel">
            <div className={styles.mobileMenuHead}>
              <div><span>Panel editorial</span><strong>Ir a un módulo</strong></div>
              <button type="button" onClick={closeMobileMenu} aria-label="Cerrar menú">×</button>
            </div>

            <label className={styles.mobileSearch}>
              <span className={styles.srOnly}>Buscar módulo</span>
              <input
                type="search"
                value={moduleQuery}
                onChange={(event) => setModuleQuery(event.target.value)}
                placeholder="Buscar módulo…"
                autoFocus
              />
            </label>

            <div className={styles.mobileGroups}>
              {visibleGroups.length ? visibleGroups.map((group) => (
                <section className={styles.mobileGroup} key={group.label}>
                  <span className={styles.mobileGroupLabel}>{group.label}</span>
                  <div className={styles.mobileGroupLinks}>
                    {group.items.map((item) => (
                      <NavLink key={item.href} item={item} pathname={pathname} onClick={closeMobileMenu} />
                    ))}
                  </div>
                </section>
              )) : <p className={styles.mobileEmpty}>No hay módulos que coincidan con la búsqueda.</p>}
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
