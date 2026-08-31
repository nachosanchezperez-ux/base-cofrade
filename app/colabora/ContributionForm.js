'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { submitContributionAction } from './actions'
import styles from './page.module.css'

const INITIAL_STATE = { status: 'idle', message: '' }
const MAX_FILE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_FILE_BYTES = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const TYPES = [
  ['correction', 'Corregir una ficha', 'Un dato que ya aparece en la web no es correcto o está incompleto.'],
  ['new_record', 'Proponer información', 'Quieres documentar una ficha, un hecho o un contenido nuevo.'],
  ['media', 'Fotografías o documentos', 'Adjuntas imágenes propias/autorizadas, PDF o enlaces a otras fuentes.'],
  ['suggestion', 'Sugerencia general', 'Has encontrado una incidencia o propones mejorar la web.'],
]

export default function ContributionForm({ enabled, formTicket, turnstileSiteKey }) {
  const [state, formAction, pending] = useActionState(submitContributionAction, INITIAL_STATE)
  const [type, setType] = useState('correction')
  const [fileMessage, setFileMessage] = useState('')
  const [hasPhotos, setHasPhotos] = useState(false)

  useEffect(() => {
    if (state.status === 'error') window.turnstile?.reset?.()
  }, [state])

  function validateFiles(event) {
    const files = [...(event.target.files || [])]
    setHasPhotos(false)
    if (files.length > 3) {
      event.target.value = ''
      setFileMessage('Selecciona como máximo tres archivos.')
      return
    }
    if (files.some((file) => !ALLOWED_FILE_TYPES.has(file.type))) {
      event.target.value = ''
      setFileMessage('Solo se admiten archivos JPG, PNG, WebP o PDF.')
      return
    }
    if (files.some((file) => file.size > MAX_FILE_BYTES)) {
      event.target.value = ''
      setFileMessage('Cada archivo puede ocupar como máximo 8 MB.')
      return
    }
    if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_FILE_BYTES) {
      event.target.value = ''
      setFileMessage('Los archivos pueden ocupar como máximo 10 MB en total.')
      return
    }
    setHasPhotos(files.some((file) => file.type.startsWith('image/')))
    setFileMessage(files.length ? `${files.length} archivo${files.length === 1 ? '' : 's'} preparado${files.length === 1 ? '' : 's'} para la cuarentena privada.` : '')
  }

  if (state.status === 'success') {
    return (
      <section className={styles.successCard} aria-live="polite">
        <span className={styles.successMark} aria-hidden="true">✓</span>
        <span className={styles.eyebrow}>Aportación recibida</span>
        <h2>Gracias por ayudar a documentar Hilo Cofrade</h2>
        <p>La aportación ha quedado en revisión privada. Su referencia es <strong>{state.reference}</strong>.</p>
        <button type="button" onClick={() => window.location.reload()}>Enviar otra aportación</button>
      </section>
    )
  }

  return (
    <section className={styles.formCard} aria-labelledby="titulo-formulario">
      {turnstileSiteKey ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      ) : null}
      <div className={styles.formHeading}>
        <span className={styles.eyebrow}>Formulario público</span>
        <h2 id="titulo-formulario">Cuéntanos qué debemos revisar</h2>
        <p>Los campos marcados con * son obligatorios.</p>
      </div>

      {!enabled ? (
        <div className={styles.pendingNotice} role="status">
          <strong>Vista previa segura</strong>
          <span>El formulario está diseñado, pero los envíos seguirán bloqueados hasta activar la protección antirobot y la política de privacidad actualizada.</span>
        </div>
      ) : null}
      {state.status === 'error' ? <div className={styles.errorNotice} role="alert">{state.message}</div> : null}

      <form action={formAction} className={styles.form} aria-busy={pending}>
        <input type="hidden" name="form_ticket" value={formTicket} />
        <label className={styles.trap} aria-hidden="true">
          No rellenar este campo
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <fieldset className={styles.typeFieldset}>
          <legend>¿Qué quieres enviar? *</legend>
          <div className={styles.typeGrid}>
            {TYPES.map(([value, label, copy]) => (
              <label key={value} className={type === value ? styles.typeActive : ''}>
                <input
                  type="radio"
                  name="contribution_type"
                  value={value}
                  checked={type === value}
                  onChange={() => setType(value)}
                  disabled={pending}
                />
                <span><strong>{label}</strong><small>{copy}</small></span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.fieldGrid}>
          <label className={styles.fieldWide}>
            <span>Título breve *</span>
            <input name="title" required minLength={5} maxLength={140} disabled={pending} placeholder="Ej. Corrección de la fecha fundacional" />
          </label>
          <label className={styles.fieldWide}>
            <span>URL de la ficha o página relacionada {type === 'correction' ? '*' : '(opcional)'}</span>
            <input name="page_url" type="url" required={type === 'correction'} maxLength={2048} disabled={pending} placeholder="https://hilocofrade.com/…" />
          </label>
          <label className={styles.fieldWide}>
            <span>Explicación detallada *</span>
            <textarea name="description" required minLength={30} maxLength={6000} rows={8} disabled={pending} placeholder="Indica qué dato debemos revisar, cuál sería la información correcta y por qué…" />
            <small>Texto plano · entre 30 y 6.000 caracteres · no incluyas datos sensibles.</small>
          </label>
          <label className={styles.fieldWide}>
            <span>Fuentes y documentos enlazados</span>
            <textarea name="sources" rows={4} disabled={pending} placeholder={'https://web-oficial.es/…\nhttps://archivo-publico.es/documento.pdf'} />
            <small>Una URL pública HTTP/HTTPS por línea · máximo 8. No abrimos previsualizaciones automáticas.</small>
          </label>
        </div>

        <fieldset className={styles.photoFieldset}>
            <legend>Archivos adjuntos (opcional)</legend>
            <div className={styles.fieldGrid}>
              <label className={styles.fieldWide}>
                <span>Seleccionar archivos</span>
                <input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.pdf" multiple onChange={validateFiles} disabled={pending} />
                <small>Hasta 3 archivos · JPG, PNG, WebP o PDF · 8 MB por archivo y 10 MB en total. Office, SVG, GIF y ZIP no se admiten.</small>
                {fileMessage ? <em className={styles.fileMessage}>{fileMessage}</em> : null}
              </label>
              {hasPhotos ? (
                <>
                  <label>
                    <span>Autoría o crédito de las fotografías *</span>
                    <input name="photo_credit" required maxLength={180} disabled={pending} placeholder="Nombre de la persona autora" />
                  </label>
                  <label>
                    <span>Texto alternativo</span>
                    <input name="photo_alt_text" maxLength={300} disabled={pending} placeholder="Qué aparece en la imagen" />
                  </label>
                </>
              ) : null}
            </div>
            {hasPhotos ? (
              <label className={styles.checkRow}>
                <input name="rights_confirmed" type="checkbox" required disabled={pending} />
                <span>Confirmo que soy titular de las fotografías o tengo permiso suficiente para aportarlas para revisión y posible publicación.</span>
              </label>
            ) : null}
            <p className={styles.quarantineNote}>Los PDF se guardan sin previsualización y solo pueden descargarse desde el panel privado durante la revisión editorial.</p>
          </fieldset>

        <fieldset className={styles.contactFieldset}>
          <legend>Contacto (opcional)</legend>
          <p>Solo lo usaremos si necesitamos aclarar la aportación. No habrá comunicaciones comerciales.</p>
          <div className={styles.fieldGrid}>
            <label>
              <span>Nombre o entidad</span>
              <input name="contact_name" maxLength={120} autoComplete="name" disabled={pending} />
            </label>
            <label>
              <span>Correo</span>
              <input name="contact_email" type="email" maxLength={254} autoComplete="email" disabled={pending} />
            </label>
          </div>
        </fieldset>

        <div className={styles.consentBox}>
          <label className={styles.checkRow}>
            <input name="privacy_consent" type="checkbox" required disabled={pending} />
            <span>
              He leído la <Link href="/privacidad" target="_blank">Política de privacidad</Link> y acepto el tratamiento de la aportación y, si los facilito, mis datos de contacto para revisarla. *
            </span>
          </label>
          <p>La conservación se revisa inicialmente a los 12 meses y puede ser menor según el resultado editorial. Puedes solicitar la supresión de tus datos.</p>
        </div>

        {enabled && turnstileSiteKey ? (
          <div
            className={`cf-turnstile ${styles.turnstile}`}
            data-sitekey={turnstileSiteKey}
            data-action="public_contribution"
            data-theme="light"
            data-language="es"
          />
        ) : null}

        <div className={styles.submitRow}>
          <small>Nunca aplicaremos la aportación directamente a una ficha.</small>
          <button type="submit" disabled={!enabled || pending}>
            {pending ? 'Verificando y enviando…' : enabled ? 'Enviar para revisión' : 'Envíos todavía bloqueados'}
          </button>
        </div>
      </form>
    </section>
  )
}
