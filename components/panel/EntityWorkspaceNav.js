'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const navRef = useRef(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false })
  const dense = items.length > 7

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
      const target = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
      nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
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

  return (
    <section className={`${styles.shell} ${dense ? styles.dense : ''}`.trim()} aria-label="Navegación de la ficha">
      <div className={styles.copy}>
        <span>{eyebrow}</span>
        {description ? <p>{description}</p> : null}
      </div>
      <div className={styles.navFrame}>
        {scrollState.left ? (
          <button className={`${styles.scrollButton} ${styles.scrollLeft}`} type="button" onClick={() => moveNav(-1)} aria-label="Ver secciones anteriores">
            <span aria-hidden="true">‹</span>
          </button>
        ) : null}
        <nav ref={navRef} className={styles.nav} aria-label="Secciones de la entidad">
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
        {scrollState.right ? (
          <button className={`${styles.scrollButton} ${styles.scrollRight}`} type="button" onClick={() => moveNav(1)} aria-label="Ver más secciones">
            <span aria-hidden="true">›</span>
          </button>
        ) : null}
      </div>
    </section>
  )
}
