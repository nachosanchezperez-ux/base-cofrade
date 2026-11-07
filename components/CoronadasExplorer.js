'use client'

import { useMemo, useState } from 'react'
import CoronadaCard from '@/components/CoronadaCard'
import styles from './CoronadasExplorer.module.css'

const ALL = ''

function matchesKind(item, kind) {
  if (!kind) return true
  if (kind === 'canonica') return item.kind === 'canonica' || item.kind === 'reconocimiento'
  return item.kind === kind
}

export default function CoronadasExplorer({ items = [], filters = {} }) {
  const [kind, setKind] = useState(ALL)
  const [municipality, setMunicipality] = useState(ALL)
  const [officiant, setOfficiant] = useState(ALL)

  const visible = useMemo(() => items.filter((item) => (
    matchesKind(item, kind)
    && (!municipality || item.municipality === municipality)
    && (!officiant || item.acts.some((act) => act.officiants.some((entry) => entry.id === officiant)))
  )), [items, kind, municipality, officiant])

  const filtered = kind || municipality || officiant

  return (
    <div className={styles.explorer}>
      <div className={styles.filters} role="group" aria-label="Filtrar Vírgenes Coronadas">
        {filters.kinds?.length > 1 ? (
          <div className={styles.chips}>
            <button type="button" aria-pressed={!kind} onClick={() => setKind(ALL)}>Todas</button>
            {filters.kinds.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={kind === option.value}
                onClick={() => setKind(kind === option.value ? ALL : option.value)}
              >
                {option.label} <span>{option.count}</span>
              </button>
            ))}
          </div>
        ) : null}
        <div className={styles.selects}>
          <label>
            <span>Localidad</span>
            <select value={municipality} onChange={(event) => setMunicipality(event.target.value)}>
              <option value={ALL}>Toda la provincia</option>
              {(filters.municipalities || []).map((option) => (
                <option key={option.value} value={option.value}>{option.label} ({option.count})</option>
              ))}
            </select>
          </label>
          {filters.officiants?.length ? (
            <label>
              <span>Coronada por</span>
              <select value={officiant} onChange={(event) => setOfficiant(event.target.value)}>
                <option value={ALL}>Cualquier prelado</option>
                {filters.officiants.map((option) => (
                  <option key={option.id} value={option.id}>{option.name} ({option.count})</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        <p className={styles.count} aria-live="polite">
          {visible.length} {visible.length === 1 ? 'Virgen coronada' : 'Vírgenes coronadas'}
          {filtered ? (
            <button
              type="button"
              className={styles.reset}
              onClick={() => { setKind(ALL); setMunicipality(ALL); setOfficiant(ALL) }}
            >
              Quitar filtros
            </button>
          ) : null}
        </p>
      </div>

      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((item, index) => (
            <CoronadaCard key={item.id} item={item} priority={index < 2} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No hay coronaciones con esos filtros.</p>
      )}
    </div>
  )
}
