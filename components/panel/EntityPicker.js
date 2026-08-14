'use client'

import { useMemo, useState } from 'react'

export default function EntityPicker({
  name,
  items,
  label,
  placeholder = 'Buscar…',
  emptyLabel = 'Selecciona una opción',
  required = true,
  defaultValue = '',
  className = '',
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(defaultValue)

  const filtered = useMemo(() => {
    const normalized = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

    const matches = normalized
      ? items.filter((item) => (
          `${item.name || ''} ${item.meta || ''} ${item.slug || ''}`
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalized)
        ))
      : items

    const selectedItem = selected
      ? items.find((item) => item.id === selected)
      : null

    return selectedItem && !matches.some((item) => item.id === selectedItem.id)
      ? [selectedItem, ...matches]
      : matches
  }, [items, query, selected])

  return (
    <div className={className} style={{ display: 'grid', gap: 7 }}>
      <label>
        <span>{label}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
      <select
        name={name}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
        required={required}
        aria-label={label}
      >
        <option value="">{emptyLabel}</option>
        {filtered.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}{item.meta ? ` · ${item.meta}` : ''}
          </option>
        ))}
      </select>
      <small style={{ color: '#68788a' }}>
        {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
      </small>
    </div>
  )
}
