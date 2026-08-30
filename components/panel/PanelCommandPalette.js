'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './PanelCommandPalette.module.css'

const RECENTS_KEY = 'hilo-panel-recents-v1'
const MAX_RECENTS = 8

const MODULES = [
  { name: 'Resumen', typeLabel: 'Inicio', href: '/panel', mark: '⌂' },
  { name: 'Hoy', typeLabel: 'Inicio', href: '/panel/hoy', mark: '24' },
  { name: 'Hermandades', typeLabel: 'Contenido', href: '/panel/hermandades', mark: 'H' },
  { name: 'Imágenes', typeLabel: 'Contenido', href: '/panel/imagenes', mark: 'I' },
  { name: 'Pasos', typeLabel: 'Contenido', href: '/panel/pasos', mark: 'P' },
  { name: 'Bandas', typeLabel: 'Contenido', href: '/panel/bandas', mark: 'B' },
  { name: 'Marchas', typeLabel: 'Contenido', href: '/panel/marchas', mark: '♫' },
  { name: 'Extraordinarias', typeLabel: 'Contenido', href: '/panel/extraordinarias', mark: '✦' },
  { name: 'Igualás y ensayos', typeLabel: 'Contenido', href: '/panel/igualas-y-ensayos', mark: 'I/E' },
  { name: 'Acontecimientos', typeLabel: 'Contenido', href: '/panel/acontecimientos', mark: 'A' },
  { name: 'Personas', typeLabel: 'Documentación', href: '/panel/agentes', mark: 'Pe' },
  { name: 'Fuentes', typeLabel: 'Documentación', href: '/panel/fuentes', mark: 'F' },
  { name: 'Multimedia', typeLabel: 'Documentación', href: '/panel/multimedia', mark: 'Mu' },
  { name: 'Relaciones', typeLabel: 'Documentación', href: '/panel/relaciones', mark: '↔' },
  { name: 'Datos', typeLabel: 'Sistema', href: '/panel/datos', mark: 'D' },
]

const CREATE_ITEMS = [
  { name: 'Nueva hermandad', typeLabel: 'Crear', href: '/panel/hermandades/nueva', mark: 'H' },
  { name: 'Nueva imagen', typeLabel: 'Crear', href: '/panel/imagenes/nueva', mark: 'I' },
  { name: 'Nuevo paso', typeLabel: 'Crear', href: '/panel/pasos/nuevo', mark: 'P' },
  { name: 'Nueva persona', typeLabel: 'Crear', href: '/panel/agentes/nuevo', mark: 'Pe' },
]

const SEGMENT_LABELS = {
  hermandades: 'Hermandad',
  imagenes: 'Imagen',
  pasos: 'Paso',
  bandas: 'Banda',
  marchas: 'Marcha',
  agentes: 'Persona',
  extraordinarias: 'Extraordinaria',
  'igualas-y-ensayos': 'Igualá / ensayo',
  acontecimientos: 'Acontecimiento',
}

function normalize(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

function readRecents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : []
  } catch {
    return []
  }
}

function writeRecent(item) {
  if (!item?.href || !item?.name) return
  try {
    const next = [item, ...readRecents().filter((candidate) => candidate.href !== item.href)].slice(0, MAX_RECENTS)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  } catch {}
}

function markForType(type = '') {
  return {
    brotherhood: 'H',
    image: 'I',
    step: 'P',
    band: 'B',
    march: '♫',
    agent: 'Pe',
    extraordinary: '✦',
    crew_event: 'I/E',
  }[type] || '→'
}

function currentEntity(pathname) {
  const match = pathname.match(/^\/panel\/(hermandades|imagenes|pasos|bandas|marchas|agentes|extraordinarias|igualas-y-ensayos|acontecimientos)\/([^/?#]+)/)
  if (!match || ['nueva', 'nuevo'].includes(match[2])) return null
  const [, segment, id] = match
  return {
    href: `/panel/${segment}/${id}`,
    typeLabel: SEGMENT_LABELS[segment] || 'Contenido',
    mark: segment === 'hermandades' ? 'H'
      : segment === 'imagenes' ? 'I'
        : segment === 'pasos' ? 'P'
          : segment === 'bandas' ? 'B'
            : segment === 'marchas' ? '♫'
              : segment === 'agentes' ? 'Pe'
                : segment === 'extraordinarias' ? '✦'
                  : segment === 'igualas-y-ensayos' ? 'I/E' : 'A',
  }
}

export default function PanelCommandPalette({ canEdit = false }) {
  const pathname = usePathname()
  const router = useRouter()
  const inputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recents, setRecents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const moduleMatches = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return MODULES.slice(0, 7)
    return MODULES.filter((item) => normalize(`${item.name} ${item.typeLabel}`).includes(needle)).slice(0, 6)
  }, [query])

  const visibleItems = mode === 'recent'
    ? recents
    : mode === 'new'
      ? (canEdit ? CREATE_ITEMS : [])
      : [...moduleMatches, ...results]

  function openPalette(nextMode = 'search') {
    setMode(nextMode)
    setQuery('')
    setResults([])
    setError('')
    setActiveIndex(0)
    setRecents(readRecents())
    setOpen(true)
  }

  function closePalette() {
    setOpen(false)
    setQuery('')
    setResults([])
    setError('')
  }

  function navigate(item) {
    if (!item?.href) return
    writeRecent(item)
    closePalette()
    router.push(item.href)
  }

  useEffect(() => {
    function handleKeydown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openPalette('search')
        return
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        closePalette()
      }
    }

    function handleOpen(event) {
      openPalette(event.detail?.mode || 'search')
    }

    document.addEventListener('keydown', handleKeydown)
    window.addEventListener('panel-command-open', handleOpen)
    return () => {
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('panel-command-open', handleOpen)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open, mode])

  useEffect(() => {
    const current = currentEntity(pathname)
    if (!current) return undefined

    const timer = window.setTimeout(() => {
      const matchingBreadcrumb = [...document.querySelectorAll('[data-panel-main] [class*="breadcrumb"] a[href]')]
        .find((link) => link.getAttribute('href') === current.href)
      const heading = document.querySelector('[data-panel-main] h1')
      const name = matchingBreadcrumb?.textContent?.trim() || heading?.textContent?.trim()
      if (name) writeRecent({ ...current, name })
    }, 120)

    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (!open || mode !== 'search') return undefined
    const term = query.trim()
    if (term.length < 2) {
      setResults([])
      setLoading(false)
      setError('')
      return undefined
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`/api/panel/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
          cache: 'no-store',
        })
        if (!response.ok) throw new Error('search_failed')
        const payload = await response.json()
        setResults((payload.results || []).map((item) => ({ ...item, mark: markForType(item.type) })))
      } catch (nextError) {
        if (nextError?.name !== 'AbortError') {
          setResults([])
          setError('No se ha podido completar la búsqueda.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 180)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [open, mode, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [mode, query, results.length, recents.length])

  function handleListKeydown(event) {
    if (!visibleItems.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % visibleItems.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + visibleItems.length) % visibleItems.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      navigate(visibleItems[activeIndex])
    }
  }

  if (!open) return null

  return (
    <div className={styles.layer} data-panel-command-root>
      <button className={styles.backdrop} type="button" aria-label="Cerrar búsqueda" onClick={closePalette} />
      <section className={styles.palette} role="dialog" aria-modal="true" aria-label="Navegación rápida del Panel">
        <div className={styles.topbar}>
          <div className={styles.searchBox}>
            <span aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleListKeydown}
              placeholder={mode === 'search' ? 'Hermandad, imagen, paso, banda, marcha o persona…' : mode === 'recent' ? 'Tus últimas fichas' : 'Crear contenido'}
              readOnly={mode !== 'search'}
              aria-label={mode === 'search' ? 'Buscar en el Panel' : mode === 'recent' ? 'Elementos recientes' : 'Crear contenido'}
            />
          </div>
          <button className={styles.escape} type="button" onClick={closePalette}>Esc</button>
        </div>

        <div className={styles.modes} role="tablist" aria-label="Modos de navegación rápida">
          <button type="button" role="tab" aria-selected={mode === 'search'} className={mode === 'search' ? styles.modeActive : ''} onClick={() => openPalette('search')}>Buscar</button>
          <button type="button" role="tab" aria-selected={mode === 'recent'} className={mode === 'recent' ? styles.modeActive : ''} onClick={() => openPalette('recent')}>Recientes</button>
          {canEdit ? <button type="button" role="tab" aria-selected={mode === 'new'} className={mode === 'new' ? styles.modeActive : ''} onClick={() => openPalette('new')}>Nuevo</button> : null}
        </div>

        <div className={styles.results} onKeyDown={handleListKeydown}>
          {mode === 'search' && query.trim().length < 2 ? <span className={styles.sectionLabel}>Accesos rápidos</span> : null}
          {mode === 'search' && query.trim().length >= 2 && moduleMatches.length ? <span className={styles.sectionLabel}>Módulos y resultados</span> : null}
          {mode === 'recent' ? <span className={styles.sectionLabel}>Últimas fichas abiertas</span> : null}
          {mode === 'new' ? <span className={styles.sectionLabel}>Crear un registro</span> : null}

          {visibleItems.length ? visibleItems.map((item, index) => (
            <button
              className={`${styles.result} ${index === activeIndex ? styles.resultActive : ''}`}
              type="button"
              key={`${item.href}-${item.name}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => navigate(item)}
            >
              <span className={styles.resultMark} aria-hidden="true">{item.mark || '→'}</span>
              <span className={styles.resultCopy}>
                <strong>{item.name}</strong>
                <small>{item.typeLabel || 'Panel'}{item.status ? ` · ${item.status}` : ''}</small>
              </span>
              <span className={styles.resultArrow} aria-hidden="true">→</span>
            </button>
          )) : (
            <div className={styles.empty}>
              <strong>{mode === 'recent' ? 'Todavía no hay recientes' : mode === 'new' ? 'Tu perfil es de consulta' : query.trim().length >= 2 && !loading ? 'Sin coincidencias' : 'Escribe para buscar'}</strong>
              <span>{mode === 'recent' ? 'Las fichas que abras irán apareciendo aquí.' : mode === 'new' ? 'Un editor debe crear nuevos registros.' : 'Puedes buscar por el nombre de cualquier entidad editable.'}</span>
            </div>
          )}

          {loading ? <div className={styles.loading} role="status">Buscando…</div> : null}
          {error ? <div className={styles.error} role="status">{error}</div> : null}
        </div>

        <footer className={styles.footer}>
          <span><kbd>↑</kbd><kbd>↓</kbd> mover</span>
          <span><kbd>↵</kbd> abrir</span>
          <span><kbd>⌘K</kbd> buscar</span>
        </footer>
      </section>
    </div>
  )
}
