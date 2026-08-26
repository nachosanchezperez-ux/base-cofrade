'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './EntityWorkspaceNav.module.css'

function isActive(pathname, item) {
  if (item.match === 'exact') return pathname === item.href
  if (item.activePath) return pathname === item.activePath || pathname.startsWith(`${item.activePath}/`)
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function groupItems(items) {
  const groups = []
  items.forEach((item) => {
    const label = item.group || (item.tool ? 'Herramientas' : 'Ficha')
    let group = groups.find((candidate) => candidate.label === label)
    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  })
  return groups
}

export default function EntityWorkspaceNav({ eyebrow = 'Espacio de trabajo', description, items = [] }) {
  const pathname = usePathname()
  const router = useRouter()
  const navRef = useRef(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false })
  const groups = groupItems(items)
  const activeItem = items.find((item) => isActive(pathname, item)) || items[0]
  const rootItem = items[0]

  const updateScrollState = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth)
    setScrollState({
      left: nav.scrollLeft > 8,
      right: nav.scrollLeft < maxScroll - 8,
    })
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return undefined

    const active = nav.querySelector('[aria-current="page"]')
    if (active) {
      const navRect = nav.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth)
      const target = nav.scrollLeft
        + (activeRect.left - navRect.left)
        - (nav.clientWidth - activeRect.width) / 2
      nav.scrollTo({ left: Math.max(0, Math.min(maxScroll, target)), behavior: 'smooth' })
    }

    updateScrollState()
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(nav)
    nav.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      resizeObserver.disconnect()
      nav.removeEventListener('scroll', updateScrollState)
    }
  }, [pathname, items.length, updateScrollState])

  function moveNav(direction) {
    const nav = navRef.current
    if (!nav) return
    nav.scrollBy({
      left: direction * Math.max(260, nav.clientWidth * 0.68),
      behavior: 'smooth',
    })
  }

  const navClassName = [
    styles.nav,
    scrollState.left ? styles.hasLeft : '',
    scrollState.right ? styles.hasRight : '',
  ].filter(Boolean).join(' ')

  return (
    <section className={styles.shell} aria-label="Navegación de la ficha" data-panel-workspace-nav>
      <div className={styles.copy}>
        <div className={styles.copyTopline}>
          <span>{eyebrow}</span>
          {activeItem?.tool && rootItem ? <Link href={rootItem.href}>← Volver a ficha</Link> : null}
        </div>
        {description ? <p>{description}</p> : null}
      </div>

      <div className={styles.mobilePicker}>
        <label>
          <span>Sección</span>
          <select
            value={activeItem?.href || rootItem?.href || ''}
            onChange={(event) => router.push(event.target.value)}
            aria-label="Cambiar de sección de la ficha"
          >
            {groups.map((group) => (
              <optgroup label={group.label} key={group.label}>
                {group.items.map((item) => <option value={item.href} key={`${item.href}-${item.label}`}>{item.label}</option>)}
              </optgroup>
            ))}
          </select>
        </label>
        {activeItem?.tool && rootItem ? <Link href={rootItem.href}>← Volver a la ficha</Link> : null}
      </div>

      <div className={styles.navFrame}>
        {scrollState.left ? (
          <button className={`${styles.scrollButton} ${styles.scrollLeft}`} type="button" onClick={() => moveNav(-1)} aria-label="Ver secciones anteriores">
            <span aria-hidden="true">‹</span>
          </button>
        ) : null}
        <nav ref={navRef} className={navClassName} aria-label="Secciones de la entidad">
          {groups.map((group) => (
            <div className={styles.navGroup} key={group.label}>
              <span className={styles.groupLabel}>{group.label}</span>
              <div className={styles.groupLinks}>
                {group.items.map((item) => {
                  const active = isActive(pathname, item)
                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className={`${styles.link} ${active ? styles.active : ''} ${item.tool ? styles.tool : ''}`.trim()}
                      aria-current={active ? 'page' : undefined}
                    >
                      <strong>{item.label}</strong>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
        {scrollState.right ? (
          <button className={`${styles.scrollButton} ${styles.scrollRight}`} type="button" onClick={() => moveNav(1)} aria-label="Ver más secciones">
            <span aria-hidden="true">›</span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
