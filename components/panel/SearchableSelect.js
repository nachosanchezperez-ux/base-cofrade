'use client'

import { useMemo, useState } from 'react'
import panelStyles from '@/app/panel/panel.module.css'
import styles from './SearchableSelect.module.css'

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
  const [isChanging, setIsChanging] = useState(false)
  const selected = String(value || '')
  const selectedOption = options.find((option) => String(option.value) === selected) || null
  const showSearch = !selectedOption || isChanging

  const filtered = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return []
    return options.filter((option) => normalize(`${option.label} ${option.searchText || ''}`).includes(needle))
  }, [options, query])

  const choose = (option) => {
    onChange?.(String(option.value))
    setQuery('')
    setIsChanging(false)
  }

  const clear = () => {
    onChange?.('')
    setQuery('')
    setIsChanging(true)
  }

  const create = () => {
    const candidate = query.trim()
    if (!candidate) return
    onCreate?.(candidate)
  }

  return (
    <div className={`${styles.root}${className ? ` ${className}` : ''}`}>
      <input type="hidden" name={name} value={selected} />

      {selectedOption ? (
        <div className={styles.current} aria-label={`${label}: selección actual`}>
          <div className={styles.currentCopy}>
            <span className={styles.currentLabel}>Selección actual</span>
            <strong>{selectedOption.label}</strong>
            <small>Este es el valor que se guardará si no lo cambias.</small>
          </div>
          <div className={styles.currentActions}>
            {!isChanging ? (
              <button type="button" className={panelStyles.secondaryButton} onClick={() => setIsChanging(true)}>
                Cambiar
              </button>
            ) : (
              <button type="button" className={panelStyles.secondaryButton} onClick={() => { setIsChanging(false); setQuery('') }}>
                Mantener actual
              </button>
            )}
            <button type="button" className={styles.removeButton} onClick={clear}>Quitar</button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyCurrent}>
          <span className={styles.currentLabel}>Selección actual</span>
          <strong>{emptyLabel}</strong>
        </div>
      )}

      {showSearch ? (
        <div className={styles.searchArea}>
          <label>
            <span>{selectedOption ? `Cambiar ${label}` : `Buscar ${label}`}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={selectedOption ? `Buscar otra opción…` : searchPlaceholder}
              aria-label={`${selectedOption ? 'Cambiar' : 'Buscar'} ${label.toLowerCase()}`}
              autoComplete="off"
            />
          </label>

          {query ? (
            <div className={styles.results} role="listbox" aria-label={`Resultados de ${label.toLowerCase()}`}>
              {filtered.map((option) => (
                <button key={option.value} type="button" className={panelStyles.secondaryButton} onClick={() => choose(option)}>
                  Seleccionar · {option.label}
                </button>
              ))}
              {!filtered.length && onCreate ? (
                <button type="button" className={panelStyles.primaryButton} onClick={create}>
                  + {createLabel} “{query.trim()}”
                </button>
              ) : null}
              {!filtered.length && !onCreate ? <small>No hay coincidencias.</small> : null}
            </div>
          ) : (
            <small className={styles.help}>Escribe para buscar y pulsa un resultado para seleccionarlo.</small>
          )}
        </div>
      ) : null}
    </div>
  )
}
