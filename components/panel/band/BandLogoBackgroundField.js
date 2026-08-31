'use client'

import { useId, useState } from 'react'
import BrotherhoodDirectoryCrestImage from '@/components/BrotherhoodDirectoryCrestImage'
import {
  isLightLogoBackgroundColor,
  isValidLogoBackgroundColor,
  normalizeLogoBackgroundColor,
} from '@/lib/bands/logo-background'
import styles from './BandLogoBackgroundField.module.css'

export default function BandLogoBackgroundField({
  initialColor = '',
  logoSrc = '',
  logoAlt = 'Logotipo de la Banda',
  initials = 'HC',
}) {
  const inputId = useId()
  const helpId = useId()
  const savedColor = normalizeLogoBackgroundColor(initialColor)
  const [value, setValue] = useState(savedColor)
  const configuredColor = normalizeLogoBackgroundColor(value)
  const isValid = !value || isValidLogoBackgroundColor(value)
  const isLight = configuredColor && isLightLogoBackgroundColor(configuredColor)

  function updateHex(nextValue) {
    setValue(String(nextValue || '').trim().toUpperCase())
  }

  return (
    <div className={styles.field}>
      <div className={styles.controls}>
        <label className={styles.hexField} htmlFor={inputId}>
          <span>Fondo de la pastilla del logotipo</span>
          <span className={styles.inputRow}>
            <input
              className={styles.colorPicker}
              type="color"
              value={configuredColor || '#FFFFFF'}
              aria-label="Seleccionar color de fondo de la pastilla"
              onChange={(event) => updateHex(event.target.value)}
            />
            <input
              id={inputId}
              name="logo_background_color"
              value={value}
              placeholder="#RRGGBB"
              pattern="#[0-9A-Fa-f]{6}"
              maxLength="7"
              autoCapitalize="characters"
              spellCheck="false"
              aria-invalid={!isValid}
              aria-describedby={helpId}
              onChange={(event) => updateHex(event.target.value)}
            />
          </span>
        </label>

        <div className={styles.actions}>
          <button type="button" onClick={() => setValue('')} disabled={!value}>Sin fondo</button>
          <button type="button" onClick={() => setValue(savedColor)} disabled={value === savedColor}>Restablecer</button>
        </div>

        <small id={helpId} className={!isValid ? styles.error : styles.help}>
          {isValid
            ? 'Sin fondo conserva exactamente la presentación pública predeterminada.'
            : 'Escribe un color HEX completo con el formato #RRGGBB.'}
        </small>
      </div>

      <div className={styles.previewWrap}>
        <span>Previsualización</span>
        <div
          className={styles.preview}
          data-custom-background={configuredColor ? 'true' : undefined}
          data-light-background={isLight ? 'true' : undefined}
          style={configuredColor ? { '--preview-logo-background': configuredColor } : undefined}
          aria-live="polite"
        >
          {logoSrc ? (
            <BrotherhoodDirectoryCrestImage
              className={styles.logo}
              src={logoSrc}
              alt={logoAlt}
              fallback={initials}
              fallbackClassName={styles.initials}
            />
          ) : (
            <span className={styles.initials} aria-hidden="true">{initials}</span>
          )}
        </div>
        <small>{configuredColor || 'Fondo predeterminado'}</small>
      </div>
    </div>
  )
}
