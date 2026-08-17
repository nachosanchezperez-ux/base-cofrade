'use client'

import { useMemo, useState } from 'react'
import styles from '@/app/panel/panel.module.css'

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export default function SearchableSelect({
  name,
  label,
  options = [],
  value = '',
  onChange,
  emptyLabel = 'Sin seleccionar',
  searchPlaceholder = 'Buscar…',
  onCreate,
  createLabel = 'Crear',
  className,
}) {
  const [query, setQuery] = useState('')
  const selected = String(value || '')
  const selectedOption = options.find((option) => String(option.value) === selected) || null

  const filtered = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return []
    return options.filter((option) => normalize(`${option.label} ${option.searchText || ''}`).includes(needle))
  }, [options, query])

  const choose = (option) => {
    onChange?.(String(option.value))
    setQuery('')
  }

  const create = () => {
    const candidate = query.trim()
    if (!candidate) return
    onCreate?.(candidate)
  }

  return (
    <div className={className}>
      <label>
        <span>Buscar {label}</span>
        <input type="hidden" name={name} value={selected} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={`Buscar ${label.toLowerCase()}`}
          autoComplete="off"
        />
      </label>

      <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
        <small><strong>{selectedOption ? 'Seleccionado:' : 'Valor actual:'}</strong> {selectedOption ? selectedOption.label : emptyLabel}</small>
        {selectedOption ? <button type="button" className={styles.secondaryButton} onClick={() => onChange?.('')}>Quitar selección</button> : null}
      </div>

      {query ? (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }} role="listbox" aria-label={`Resultados de ${label.toLowerCase()}`}>
          {filtered.map((option) => (
            <button key={option.value} type="button" className={styles.secondaryButton} onClick={() => choose(option)}>
              Seleccionar · {option.label}
            </button>
          ))}
          {!filtered.length && onCreate ? (
            <button type="button" className={styles.primaryButton} onClick={create}>
              + {createLabel} “{query.trim()}”
            </button>
          ) : null}
          {!filtered.length && !onCreate ? <small>No hay coincidencias.</small> : null}
        </div>
      ) : <small style={{ display: 'block', marginTop: 8 }}>El texto de búsqueda no se guarda: pulsa un resultado para seleccionarlo.</small>}
    </div>
  )
}
