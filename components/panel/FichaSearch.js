'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './FichaSearch.module.css'

const statuses = { published: 'Publicado', draft: 'Borrador', review: 'En revisión', archived: 'Archivado' }

export default function FichaSearch({ brotherhoodId }) {
  const inputId = useId()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(null)
  const input = useRef(null)

  useEffect(() => () => pending.current?.abort(), [])
  useEffect(() => {
    pending.current?.abort()
    setResponse(null)
    setError('')
    setBusy(false)
  }, [pathname, brotherhoodId])

  function clear() {
    pending.current?.abort()
    setQuery('')
    setResponse(null)
    setError('')
    setBusy(false)
    input.current?.focus()
  }

  async function search(event) {
    event.preventDefault()
    pending.current?.abort()
    const controller = new AbortController()
    pending.current = controller
    setBusy(true)
    setError('')
    setResponse(null)
    try {
      const result = await fetch(`/api/panel/hermandades/${encodeURIComponent(brotherhoodId)}/buscar?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal, cache: 'no-store' })
      const payload = await result.json()
      if (!result.ok) throw new Error(payload.error || 'No se pudo completar la búsqueda.')
      if (!controller.signal.aborted) setResponse(payload)
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message || 'No se pudo completar la búsqueda.')
    } finally {
      if (!controller.signal.aborted) setBusy(false)
    }
  }

  function openResult(event) {
    // Searching never replaces the editor. Warn only when leaving edited fields.
    const changed = [...document.querySelectorAll('form')].filter((form) => form.getAttribute('role') !== 'search').some((form) =>
      [...form.elements].some((field) => {
        if (field.disabled || ['hidden', 'submit', 'button'].includes(field.type)) return false
        if (['checkbox', 'radio'].includes(field.type)) return field.checked !== field.defaultChecked
        if (field.tagName === 'SELECT') return [...field.options].some((option) => option.selected !== option.defaultSelected) && [...field.options].some((option) => option.defaultSelected)
        return 'defaultValue' in field && field.value !== field.defaultValue
      }))
    const destination = new URL(event.currentTarget.href)
    if ((destination.pathname !== window.location.pathname || destination.search !== window.location.search) && changed && !window.confirm('Hay cambios sin guardar. ¿Quieres salir de este apartado?')) event.preventDefault()
  }

  return (
    <section className={styles.shell} aria-label="Buscador de la ficha">
      <form role="search" onSubmit={search}>
        <label htmlFor={inputId}>Buscar dentro de esta ficha</label>
        <div className={styles.controls}>
          <input ref={input} id={inputId} type="search" placeholder="Ej. coronas, restauración, autor…" value={query} minLength={2} maxLength={120} required onChange={(event) => { pending.current?.abort(); setBusy(false); setResponse(null); setError(''); setQuery(event.target.value) }} />
          <button type="submit" disabled={busy}>{busy ? 'Buscando…' : 'Buscar'}</button>
          {query ? <button type="button" onClick={clear}>Limpiar</button> : null}
        </div>
        <p className={styles.help}>Busca en patrimonio, historia, cultos, salidas, titulares, pasos, hábito, jornada y canales, aunque no estén abiertos.</p>
      </form>
      <div role="status" aria-live="polite">
        {error ? <p>{error}</p> : null}
        {response ? <p>{response.total ? `${response.total} resultado${response.total === 1 ? '' : 's'}` : 'No hay coincidencias en esta ficha. Prueba con otro nombre o una palabra más corta.'}{response.total > response.results.length ? ` · Se muestran los primeros ${response.results.length}. Afina la búsqueda para ver otros.` : ''}</p> : null}
      </div>
      {response?.results.length ? <ul className={styles.results}>{response.results.map((result) => <li key={result.href}>
        <div className={styles.meta}>{result.section}{statuses[result.status] ? ` · ${statuses[result.status]}` : ''}</div>
        <strong>{result.title}</strong>
        {result.excerpt ? <p>{result.excerpt}</p> : null}
        <a href={result.href} onClick={openResult}>{response.canEdit ? 'Ir a editar' : 'Ir al registro'} <span className={styles.srOnly}>{result.title}</span> →</a>
      </li>)}</ul> : null}
    </section>
  )
}
