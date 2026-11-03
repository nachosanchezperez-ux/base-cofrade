'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { REPERTOIRE_OUTING_KINDS } from '@/lib/contributions/repertoire-submission'
import { submitRepertoireContributionAction } from './actions'
import styles from '../page.module.css'

const INITIAL_STATE = { status: 'idle', message: '' }
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

// «Envía la cruceta»: formulario corto para bandas, Hermandades y aficionados.
// Usa el mismo envío seguro que Colabora (ticket, Turnstile, cuarentena) y llega
// al Panel para revisión; la cruceta se carga a mano, nada se publica solo.
export default function RepertoireContributionForm({ enabled, formTicket, turnstileSiteKey }) {
  const [state, formAction, pending] = useActionState(submitRepertoireContributionAction, INITIAL_STATE)
  const [hasImage, setHasImage] = useState(false)
  const [fileMessage, setFileMessage] = useState('')

  useEffect(() => {
    if (state.status === 'error') window.turnstile?.reset?.()
  }, [state])

  function checkFile(event) {
    const file = event.target.files?.[0]
    setHasImage(false)
    setFileMessage('')
    if (!file) return
    if (!ALLOWED.has(file.type)) { event.target.value = ''; setFileMessage('La lámina debe ser JPG, PNG, WebP o PDF.'); return }
    if (file.size > MAX_FILE_BYTES) { event.target.value = ''; setFileMessage('La lámina puede ocupar como máximo 8 MB.'); return }
    setHasImage(file.type.startsWith('image/'))
    setFileMessage('Lámina preparada para la revisión privada.')
  }

  if (state.status === 'success') {
    return (
      <section className={styles.successCard} aria-live="polite">
        <span className={styles.successMark} aria-hidden="true">✓</span>
        <span className={styles.eyebrow}>Cruceta recibida</span>
        <h2>Gracias: la revisamos y la sumamos a Crucetas musicales</h2>
        <p>Su referencia es <strong>{state.reference}</strong>. Si falta algún dato, te escribiremos al contacto que hayas dejado.</p>
        <button type="button" onClick={() => window.location.reload()}>Enviar otra cruceta</button>
      </section>
    )
  }

  return (
    <section className={styles.formCard} aria-labelledby="titulo-cruceta">
      {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /> : null}
      <div className={styles.formHeading}>
        <span className={styles.eyebrow}>Envía la cruceta</span>
        <h2 id="titulo-cruceta">¿Tienes el repertorio de una salida?</h2>
        <p>La lámina o la publicación de la banda con las marchas que sonaron. Con ella o con el enlace lo comprobamos antes. Los campos con * son obligatorios.</p>
      </div>

      {!enabled ? (
        <div className={styles.pendingNotice} role="status">
          <strong>Vista previa segura</strong>
          <span>Los envíos seguirán bloqueados hasta activar la protección antirobot y la política de privacidad actualizada.</span>
        </div>
      ) : null}
      {state.status === 'error' ? <div className={styles.errorNotice} role="alert">{state.message}</div> : null}

      <form action={formAction} className={styles.form} aria-busy={pending}>
        <input type="hidden" name="form_ticket" value={formTicket} />
        <label className={styles.trap} aria-hidden="true">
          No rellenar este campo
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <div className={styles.fieldGrid}>
          <label>
            <span>Hermandad *</span>
            <input name="rep_brotherhood" required minLength={3} maxLength={160} disabled={pending} placeholder="Ej. Hermandad de San Gonzalo" />
          </label>
          <label>
            <span>Banda *</span>
            <input name="rep_band" required minLength={3} maxLength={160} disabled={pending} placeholder="Ej. Santa Ana de Dos Hermanas" />
          </label>
          <label>
            <span>Fecha de la salida *</span>
            <input name="rep_date" type="date" required disabled={pending} />
          </label>
          <label>
            <span>Tipo de salida</span>
            <select name="rep_kind" disabled={pending} defaultValue="">
              <option value="">Elige…</option>
              {REPERTOIRE_OUTING_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
            </select>
          </label>
          <label>
            <span>Localidad</span>
            <input name="rep_municipality" maxLength={80} disabled={pending} placeholder="Ej. Sevilla, Utrera…" />
          </label>
          <label className={styles.fieldWide}>
            <span>Detalles</span>
            <textarea name="rep_details" rows={4} maxLength={3000} disabled={pending} placeholder="Qué paso acompañaba la banda, marchas repetidas, estrenos…" />
          </label>
          <label className={styles.fieldWide}>
            <span>Enlace a la publicación <small>(web o redes de la banda o la Hermandad; obligatorio si no adjuntas la lámina)</small></span>
            <input name="rep_source" type="url" maxLength={2048} disabled={pending} placeholder="https://…" />
          </label>
          <label className={styles.fieldWide}>
            <span>Lámina o imagen del repertorio <small>(JPG, PNG, WebP o PDF · máx. 8 MB)</small></span>
            <input name="attachments" type="file" accept="image/jpeg,image/png,image/webp,application/pdf,.pdf" onChange={checkFile} disabled={pending} />
            {fileMessage ? <em className={styles.fileMessage}>{fileMessage}</em> : null}
          </label>
          {hasImage ? (
            <label className={styles.fieldWide}>
              <span>Autor de la lámina o de la foto *</span>
              <input name="photo_credit" required maxLength={180} disabled={pending} placeholder="Banda, Hermandad o autor" />
            </label>
          ) : null}
        </div>
        {hasImage ? (
          <label className={styles.checkRow}>
            <input name="rights_confirmed" type="checkbox" required disabled={pending} />
            <span>Confirmo que soy su autor o que la Hermandad o el autor permiten publicarlo.</span>
          </label>
        ) : null}

        <fieldset className={styles.contactFieldset}>
          <legend>Contacto (opcional)</legend>
          <p>Solo para aclarar algún dato de la cruceta.</p>
          <div className={styles.fieldGrid}>
            <label><span>Nombre o entidad</span><input name="contact_name" maxLength={120} autoComplete="name" disabled={pending} /></label>
            <label><span>Correo</span><input name="contact_email" type="email" maxLength={254} autoComplete="email" disabled={pending} /></label>
          </div>
        </fieldset>

        <div className={styles.consentBox}>
          <label className={styles.checkRow}>
            <input name="privacy_consent" type="checkbox" required disabled={pending} />
            <span>He leído la <Link href="/privacidad" target="_blank">Política de privacidad</Link> y acepto el tratamiento del envío y, si los facilito, mis datos de contacto para revisarlo. *</span>
          </label>
        </div>

        {enabled && turnstileSiteKey ? (
          <div className={`cf-turnstile ${styles.turnstile}`} data-sitekey={turnstileSiteKey} data-action="public_contribution" data-theme="light" data-language="es" />
        ) : null}

        <div className={styles.submitRow}>
          <small>La revisamos y la cargamos a mano antes de publicarla.</small>
          <button type="submit" disabled={!enabled || pending}>
            {pending ? 'Verificando y enviando…' : enabled ? 'Enviar la cruceta' : 'Envíos todavía bloqueados'}
          </button>
        </div>
      </form>
    </section>
  )
}
