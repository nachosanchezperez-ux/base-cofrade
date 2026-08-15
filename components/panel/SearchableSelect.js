'use client'

import { useMemo, useState } from 'react'

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
  defaultValue = '',
  emptyLabel = 'Sin seleccionar',
  searchPlaceholder = 'Buscar…',
  required = false,
  className,
}) {
  const [query, setQuery] = useState('')
  const selected = String(defaultValue || '')

  const filtered = useMemo(() => {
    const needle = normalize(query)
    if (!needle) return options

    const matches = options.filter((option) => normalize(`${option.label} ${option.searchText || ''}`).includes(needle))
    const selectedOption = options.find((option) => String(option.value) === selected)
    if (selectedOption && !matches.some((option) => String(option.value) === selected)) {
      return [selectedOption, ...matches]
    }
    return matches
  }, [options, query, selected])

  return (
    <label className={className}>
      <span>{label}</span>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={`Buscar ${label.toLowerCase()}`}
        autoComplete="off"
      />
      <select name={name} defaultValue={selected} required={required}>
        <option value="">{emptyLabel}</option>
        {filtered.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {query && !filtered.length ? <small>No hay coincidencias. Puedes crear un nuevo registro debajo.</small> : null}
    </label>
  )
}
