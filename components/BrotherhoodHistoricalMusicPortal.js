'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './BrotherhoodHistoricalMusicPortal.module.css'

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function groupLabel(name = '') {
  const value = normalize(name)
  if (value.includes('palio') || value.includes('refugio')) return 'Paso de palio'
  if (value.includes('cristo')) return 'Paso de Cristo'
  return 'Paso procesional'
}

function groupMark(name = '') {
  const value = normalize(name)
  if (value.includes('palio') || value.includes('refugio')) return 'VR'
  if (value.includes('cristo')) return 'CS'
  return '♪'
}

function groupPriority(name = '') {
  const value = normalize(name)
  if (value.includes('cristo')) return 1
  if (value.includes('palio') || value.includes('refugio')) return 2
  return 3
}

function meaningfulNote(note = '') {
  const value = normalize(note)
  if (!value) return ''
  if (value.includes('anuario 2026') && value.includes('documentado')) return ''
  return note
}

function yearRange(items = []) {
  const years = items.flatMap((item) => [item.yearFrom, item.yearTo]).filter(Number.isFinite)
  if (!years.length) return ''
  return `${Math.min(...years)}–${Math.max(...years)}`
}

export default function BrotherhoodHistoricalMusicPortal({ items = [] }) {
  const [target, setTarget] = useState(null)

  const groups = useMemo(() => {
    const map = new Map()

    for (const item of items) {
      const key = item.stepId || item.stepName
      const current = map.get(key) || { key, name: item.stepName, items: [] }
      current.items.push(item)
      map.set(key, current)
    }

    return [...map.values()]
      .map((group) => ({
        ...group,
        items: [...group.items].sort((first, second) => (
          (second.yearTo || second.yearFrom || 0) - (first.yearTo || first.yearFrom || 0)
        )),
      }))
      .sort((first, second) => groupPriority(first.name) - groupPriority(second.name))
  }, [items])

  useEffect(() => {
    if (items.length <= 6 || groups.length < 2) return undefined

    const section = document.getElementById('acompanamientos')
    const shell = section?.querySelector('.shell')
    const legacyGrid = shell?.querySelector('.music-history-grid')
    const heading = shell?.querySelector('.section-heading')
    if (!shell || !legacyGrid) return undefined

    const host = document.createElement('div')
    host.setAttribute('data-historical-music-experience', 'true')
    host.className = styles.portalHost
    legacyGrid.hidden = true

    if (heading) heading.insertAdjacentElement('afterend', host)
    else shell.prepend(host)

    setTarget(host)

    return () => {
      legacyGrid.hidden = false
      host.remove()
    }
  }, [groups.length, items])

  if (!target) return null

  const totalItems = groups.reduce((total, group) => total + group.items.length, 0)
  const totalYears = yearRange(items)

  return createPortal(
    <div className={styles.experience}>
      <div className={styles.summary}>
        <div>
          <span>Archivo musical</span>
          <strong>{totalItems} etapas documentadas</strong>
        </div>
        {totalYears ? <p>{totalYears}<small>cronología histórica</small></p> : null}
      </div>

      <div className={styles.columns}>
        {groups.map((group, index) => (
          <article className={styles.group} key={group.key}>
            <header className={styles.groupHeader}>
              <span className={styles.groupIndex}>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <small>{groupLabel(group.name)}</small>
                <h3>{group.name}</h3>
              </div>
              <span className={styles.groupMark} aria-hidden="true">{groupMark(group.name)}</span>
            </header>

            <div className={styles.groupMeta}>
              <strong>{group.items.length} etapas</strong>
              <span>{yearRange(group.items)}</span>
            </div>

            <ol className={styles.timeline}>
              {group.items.map((item) => {
                const note = meaningfulNote(item.notes)
                const identity = item.bandSlug ? (
                  <Link href={`/bandas/${item.bandSlug}`}>{item.bandName}<span aria-hidden="true">→</span></Link>
                ) : (
                  <strong>{item.bandName}</strong>
                )

                return (
                  <li className={styles.timelineItem} key={item.id}>
                    <time>{item.period}</time>
                    <span className={styles.rail} aria-hidden="true"><i /></span>
                    <div className={styles.timelineCopy}>
                      {identity}
                      <div className={styles.timelineMeta}>
                        <span>{item.bandType}</span>
                        {item.bandArchived ? <em>Histórica</em> : null}
                      </div>
                      {note ? <p>{note}</p> : null}
                    </div>
                  </li>
                )
              })}
            </ol>
          </article>
        ))}
      </div>
    </div>,
    target
  )
}
