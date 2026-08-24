'use client'

import { useMemo, useState } from 'react'
import styles from './cover.module.css'
import panelStyles from '@/app/panel/panel.module.css'

function initialNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function FramingField({ label, name, value, onChange, optional = false }) {
  return (
    <label>
      <span>{label}</span>
      <input
        name={name}
        type="number"
        min="0"
        max="100"
        step="1"
        value={optional && value === null ? '' : value}
        placeholder={optional ? 'Usar foco general' : undefined}
        onChange={(event) => {
          if (optional && event.target.value === '') {
            onChange(null)
            return
          }
          const next = Number(event.target.value)
          onChange(Number.isFinite(next) ? Math.min(100, Math.max(0, next)) : 50)
        }}
      />
    </label>
  )
}

function Preview({ item, fitMode, focusX, focusY, mobileFocusX, mobileFocusY, mobile = false }) {
  const x = mobile ? (mobileFocusX ?? focusX) : focusX
  const y = mobile ? (mobileFocusY ?? focusY) : focusY
  const objectFit = fitMode === 'contain' ? 'contain' : 'cover'
  const frameClass = mobile ? styles.mobilePreview : styles.desktopPreview
  const frameStyle = useMemo(() => ({
    '--image-cover-url': `url("${String(item.publicUrl || '').replaceAll('"', '%22')}")`,
  }), [item.publicUrl])

  return (
    <figure className={`${styles.preview} ${frameClass}`} style={frameStyle}>
      <span className={styles.previewBackdrop} aria-hidden="true" />
      <img
        src={item.publicUrl}
        alt={item.asset.alt_text || item.asset.title || ''}
        style={{ objectFit, objectPosition: `${x}% ${y}%` }}
      />
      <span className={styles.previewShade} aria-hidden="true" />
      <figcaption>
        <small>{mobile ? 'Móvil' : 'Escritorio'}</small>
        <strong>Portada de la ficha</strong>
      </figcaption>
    </figure>
  )
}

export default function ImageHeroFramingForm({ imageId, item, action }) {
  const [focusX, setFocusX] = useState(initialNumber(item.focus_x, 50))
  const [focusY, setFocusY] = useState(initialNumber(item.focus_y, 50))
  const [mobileFocusX, setMobileFocusX] = useState(item.mobile_focus_x === null || item.mobile_focus_x === undefined ? null : initialNumber(item.mobile_focus_x, 50))
  const [mobileFocusY, setMobileFocusY] = useState(item.mobile_focus_y === null || item.mobile_focus_y === undefined ? null : initialNumber(item.mobile_focus_y, 50))
  const [fitMode, setFitMode] = useState(item.fit_mode || 'cover')

  return (
    <form action={action} className={`${panelStyles.panelCard} ${panelStyles.editorForm} ${styles.framingCard}`}>
      <input type="hidden" name="image_id" value={imageId} />
      <input type="hidden" name="hero_link_id" value={item.id} />

      <div className={styles.previewGrid}>
        <Preview
          item={item}
          fitMode={fitMode}
          focusX={focusX}
          focusY={focusY}
          mobileFocusX={mobileFocusX}
          mobileFocusY={mobileFocusY}
        />
        <Preview
          item={item}
          fitMode={fitMode}
          focusX={focusX}
          focusY={focusY}
          mobileFocusX={mobileFocusX}
          mobileFocusY={mobileFocusY}
          mobile
        />
      </div>

      <div className={`${panelStyles.formGrid} ${styles.framingFields}`}>
        <label>
          <span>Ajuste de la fotografía</span>
          <select name="fit_mode" value={fitMode} onChange={(event) => setFitMode(event.target.value)}>
            <option value="cover">Cubrir la cabecera</option>
            <option value="contain">Mostrar la fotografía completa</option>
            <option value="auto">Automático</option>
          </select>
        </label>
        <FramingField label="Foco general · horizontal" name="focus_x" value={focusX} onChange={setFocusX} />
        <FramingField label="Foco general · vertical" name="focus_y" value={focusY} onChange={setFocusY} />
        <FramingField label="Foco móvil · horizontal" name="mobile_focus_x" value={mobileFocusX} onChange={setMobileFocusX} optional />
        <FramingField label="Foco móvil · vertical" name="mobile_focus_y" value={mobileFocusY} onChange={setMobileFocusY} optional />
      </div>

      <div className={panelStyles.formActions}>
        <small>El encuadre se guarda únicamente para la portada. El retrato del directorio y la galería conservan sus propios ajustes.</small>
        <button className={panelStyles.primaryButton} type="submit">Guardar encuadre</button>
      </div>
    </form>
  )
}
