'use client'

import { useEffect, useState } from 'react'

// Lista de páginas guardadas en el móvil (cachés del service worker). Enlaces
// normales (no <Link>): sin red, la carga completa la sirve el service worker.
const CACHE_NAMES = ['hc-programme', 'hc-pages']

function labelFor(path) {
  if (path === '/') return 'Portada'
  const last = decodeURIComponent(path.split('/').filter(Boolean).pop() || '')
  const text = last.replace(/-/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function OfflineSavedPages() {
  const [pages, setPages] = useState(null)

  useEffect(() => {
    if (!('caches' in window)) return
    let alive = true
    ;(async () => {
      const seen = new Set()
      const list = []
      for (const name of CACHE_NAMES) {
        const cache = await caches.open(name)
        for (const request of await cache.keys()) {
          const url = new URL(request.url)
          if (url.origin !== window.location.origin || seen.has(url.pathname) || url.pathname === '/sin-conexion') continue
          seen.add(url.pathname)
          list.push(url.pathname)
        }
      }
      if (alive) setPages(list.slice(0, 40))
    })().catch(() => alive && setPages([]))
    return () => { alive = false }
  }, [])

  if (!pages?.length) return null
  return (
    <div>
      <h2>Disponibles sin conexión</h2>
      <ul>
        {pages.map((path) => <li key={path}><a href={path}>{labelFor(path)}</a></li>)}
      </ul>
    </div>
  )
}
