'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import BrotherhoodPublicIndex from '@/components/BrotherhoodPublicIndex'
import { DIRECTORY_TYPES } from '@/lib/brotherhood-directory'
import { groupBrotherhoodsByLocality } from '@/lib/brotherhood-public-index'
import { localityAnchor, localityFromHash, visibleLocalityBrotherhoods } from '@/lib/brotherhood-locality-calendar'
import styles from './HermandadesDirectoryV4.module.css'

export default function HermandadesDirectoryV4({ hermandades, navigation }) {
  const [query, setQuery] = useState('')
  const [territory, setTerritory] = useState('todos')
  const [municipality, setMunicipality] = useState('todos')
  const [reset, setReset] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [hashTarget, setHashTarget] = useState(null)
  const searchRef = useRef(null)
  const allGroups = useMemo(() => groupBrotherhoodsByLocality(hermandades), [hermandades])
  const filtered = useMemo(() => visibleLocalityBrotherhoods(hermandades, navigation.indexableIds, {
    query, territory, municipality,
  }), [hermandades, navigation.indexableIds, query, territory, municipality])
  const lookup = Boolean(query.trim()) || municipality !== 'todos'
  const hasFilters = lookup || territory !== 'todos'

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    function revealLocality() {
      const group = localityFromHash(allGroups, window.location.hash)
      if (!group) return
      setQuery('')
      setMunicipality(group.key)
      setTerritory(group.key === 'sevilla' ? 'capital' : 'provincia')
      setReset((value) => value + 1)
      setHashTarget({ id: localityAnchor(group) })
    }
    revealLocality()
    window.addEventListener('hashchange', revealLocality)
    return () => window.removeEventListener('hashchange', revealLocality)
  }, [allGroups])

  useEffect(() => {
    if (!hashTarget) return
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(hashTarget.id)
      target?.querySelector('summary')?.focus({ preventScroll: true })
      target?.scrollIntoView({ block: 'start' })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [hashTarget])

  function changeQuery(next) {
    setQuery(next)
    // A new search must not inherit a locality's calendar or character filter.
    setReset((value) => value + 1)
  }

  function changeTerritory(next) {
    setTerritory(next)
    setMunicipality('todos')
    setReset((value) => value + 1)
  }

  function changeMunicipality(next) {
    setMunicipality(next)
    if (next !== 'todos') setTerritory(next === 'sevilla' ? 'capital' : 'provincia')
    setReset((value) => value + 1)
  }

  function clearFilters() {
    setQuery('')
    setTerritory('todos')
    setMunicipality('todos')
    setReset((value) => value + 1)
    searchRef.current?.focus()
  }

  return (
    <div className={styles.directory} data-hermandades-directory data-hydrated={hydrated}>
      <section className={styles.finder} aria-label="Buscar y navegar por el directorio">
        <label className={styles.searchBox} htmlFor="hermandades-v4-search">
          <span className="sr-only">Buscar hermandad o corporación</span>
          <input id="hermandades-v4-search" ref={searchRef} type="search" value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Buscar hermandad, templo o localidad…" />
          <span aria-hidden="true">⌕</span>
        </label>
        <div className={styles.finderControls}>
          <div className={styles.territoryTabs} role="group" aria-label="Elegir territorio">
            { [['todos', 'Todo'], ['capital', 'Sevilla capital'], ['provincia', 'Provincia']].map(([value, label]) => (
              <button type="button" className={territory === value ? styles.active : ''}
                aria-pressed={territory === value} onClick={() => changeTerritory(value)} key={value}>{label}</button>
            )) }
          </div>
          <select value={municipality} onChange={(event) => changeMunicipality(event.target.value)} aria-label="Elegir localidad">
            <option value="todos">Todas las localidades</option>
            {allGroups.map((group) => <option key={group.key} value={group.key}>{group.key === 'sevilla' ? 'Sevilla capital' : group.locality}</option>)}
          </select>
        </div>
      </section>

      <nav className={styles.primaryNav} aria-label="Directorios generales por carácter">
        {DIRECTORY_TYPES.map((type) => (
          <Link href={type.href} prefetch={false} key={type.key}>
            <strong>{type.label}</strong><span>{navigation.counts[type.key]}</span>
          </Link>
        ))}
      </nav>

      <section aria-labelledby="indice-hermandades">
        <header className={styles.indexHeading}>
          <div>
            <h2 id="indice-hermandades">Hermandades por localidad</h2>
            <p>Abre una localidad y recorre sus jornadas de Semana Santa o sus meses de Gloria.</p>
          </div>
          {hasFilters ? <button type="button" className={styles.clear} onClick={clearFilters}>Limpiar filtros</button> : null}
        </header>
        <p className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? 'corporación' : 'corporaciones'}{lookup ? ' encontradas' : ' en el directorio'}
        </p>
        {filtered.length ? (
          <BrotherhoodPublicIndex key={reset} brotherhoods={filtered} navigation={navigation} expand={lookup} />
        ) : (
          <div className={styles.empty}><strong>No hay resultados</strong><p>Prueba con otro nombre o cambia la localidad.</p></div>
        )}
      </section>
    </div>
  )
}
