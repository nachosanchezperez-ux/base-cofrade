'use client'

import { useEffect, useRef, useState } from 'react'
import { PlusIcon } from './icons/LucideIcons'
import styles from './BrotherhoodChapterOuting.module.css'

function svgPath(points = []) {
  return points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ')
}

// Mapa del recorrido a pantalla completa: se abre al tocar el mapa y solo
// entonces carga sus teselas. Calles rotuladas y tramo de cada banda.
export default function RouteMapExpand({ layout, labels = [], segments = [], title = '' }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef(null)

  useEffect(() => {
    const node = dialog.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  if (!layout) return null
  const located = layout.points
  const first = located[0]
  const last = located[located.length - 1]
  const roundTrip = Math.hypot(first.x - last.x, first.y - last.y) < 12

  return <>
    <button type="button" className={styles.mapExpand} onClick={() => setOpen(true)} aria-haspopup="dialog">
      <PlusIcon size={16} strokeWidth={2.6} /> Ampliar mapa
    </button>
    <dialog ref={dialog} className={styles.mapDialog} onClose={() => setOpen(false)} aria-label={`Mapa del recorrido${title ? `: ${title}` : ''}`}>
      <div className={styles.mapDialogBar}>
        <strong>Recorrido</strong>
        <button type="button" onClick={() => setOpen(false)}>Cerrar</button>
      </div>
      {open ? <div className={styles.mapDialogBody}>
        <svg viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label="Mapa ampliado del recorrido con las calles rotuladas">
          {layout.tiles.map((tile) => <image key={tile.key} href={tile.href} x={tile.x} y={tile.y} width={tile.size || 256} height={tile.size || 256} />)}
          <rect width={layout.width} height={layout.height} className={styles.mapVeil} />
          <path d={svgPath(located)} className={styles.mapCasing} />
          {segments.map((band) => <path key={band.id} d={svgPath(located.slice(band.start, band.end + 1))} className={styles.mapBand} />)}
          <path d={svgPath(located)} className={styles.mapRoute} />
          {located.slice(1, -1).map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="4" className={styles.mapStop} />)}
          <circle cx={first.x} cy={first.y} r="11" className={styles.mapEnd} />
          {!roundTrip ? <circle cx={last.x} cy={last.y} r="11" className={styles.mapEnd} /> : null}
          {labels.map((label) => (
            <text key={label.name} x={label.x} y={label.y} transform={`rotate(${label.angle} ${label.x} ${label.y})`} className={styles.mapLabel} textAnchor="middle" dy="-9">{label.name}</text>
          ))}
        </svg>
        <p className={styles.mapDialogFoot}>Trazado aproximado, de esquina a esquina. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap</a></p>
      </div> : null}
    </dialog>
  </>
}
