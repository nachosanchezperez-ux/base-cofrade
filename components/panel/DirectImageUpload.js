'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client'
import styles from '@/app/panel/panel.module.css'

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_BYTES = 10 * 1024 * 1024

function errorMessage(error) {
  return error instanceof Error && error.message
    ? error.message
    : 'No se ha podido actualizar la imagen. Revisa la conexión e inténtalo de nuevo.'
}

function syncField(scope, name, value) {
  if (!name) return
  const selector = `[name="${name}"]`
  const input = scope?.querySelector(selector) || document.querySelector(selector)
  if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) input.value = value || ''
}

export default function DirectImageUpload({
  title = 'Imagen',
  description = '',
  currentSrc = '',
  currentAlt = '',
  currentCredit = '',
  prepareAction,
  saveAction,
  metadata = {},
  requireAlt = false,
  showTextFields = true,
  syncFields = null,
  successMessage = 'Imagen actualizada correctamente.',
}) {
  const rootRef = useRef(null)
  const fileRef = useRef(null)
  const [displaySrc, setDisplaySrc] = useState(currentSrc)
  const [previewUrl, setPreviewUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [alt, setAlt] = useState(currentAlt)
  const [credit, setCredit] = useState(currentCredit)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('idle')
  const [pending, startTransition] = useTransition()

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function resetFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (fileRef.current) fileRef.current.value = ''
    setPreviewUrl('')
    setSelectedFile(null)
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setError('')
    setMessage('')

    if (!file) {
      resetFile()
      return
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      event.target.value = ''
      setError('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.')
      return
    }
    if (file.size > MAX_BYTES) {
      event.target.value = ''
      setError('La imagen no puede superar 10 MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (pending) return
    if (!selectedFile) {
      setError('Selecciona una imagen para subir.')
      return
    }
    if (requireAlt && !alt.trim()) {
      setError('El texto alternativo es obligatorio.')
      return
    }

    const formData = new FormData()
    for (const [key, value] of Object.entries(metadata)) {
      if (value !== null && value !== undefined) formData.set(key, String(value))
    }
    formData.set('file_name', selectedFile.name)
    formData.set('file_type', selectedFile.type)
    formData.set('file_size', String(selectedFile.size))
    formData.set('alt_text', alt.trim())
    formData.set('credit', credit.trim())
    setError('')
    setMessage('')

    startTransition(async () => {
      try {
        setPhase('preparing')
        const prepared = await prepareAction(formData)
        if (prepared?.error) throw new Error(prepared.error)
        if (!prepared?.upload?.path || !prepared?.upload?.token) throw new Error('No se pudo preparar la subida directa.')

        setPhase('uploading')
        const supabase = createBrowserSupabaseClient()
        const uploaded = await supabase.storage
          .from('hilo-media')
          .uploadToSignedUrl(prepared.upload.path, prepared.upload.token, selectedFile, {
            cacheControl: '3600',
            contentType: selectedFile.type,
          })
        if (uploaded.error) throw new Error(`No se pudo subir la imagen: ${uploaded.error.message}`)

        formData.set('storage_path', prepared.upload.path)
        setPhase('saving')
        const result = await saveAction(formData)
        if (result?.error) throw new Error(result.error)
        if (!result?.saved || !result?.publicUrl) throw new Error('La imagen se subió, pero no se pudo confirmar su vinculación.')

        setDisplaySrc(result.publicUrl)
        setMessage(successMessage)
        resetFile()

        const scope = rootRef.current?.closest('article') || rootRef.current?.parentElement
        if (syncFields) {
          syncField(scope, syncFields.path, result.publicUrl)
          syncField(scope, syncFields.alt, alt.trim())
          syncField(scope, syncFields.credit, credit.trim())
        }
        setPhase('idle')
      } catch (nextError) {
        const nextMessage = errorMessage(nextError)
        setError(nextMessage)
        window.dispatchEvent(new CustomEvent('panel-action-error', { detail: { message: nextMessage } }))
        setPhase('idle')
      }
    })
  }

  const previewSrc = previewUrl || displaySrc
  const buttonLabel = phase === 'preparing'
    ? 'Preparando…'
    : phase === 'uploading'
      ? 'Subiendo…'
      : phase === 'saving'
        ? 'Vinculando…'
        : displaySrc
          ? 'Sustituir imagen'
          : 'Subir imagen'

  return (
    <div ref={rootRef} className={styles.editorForm} data-direct-image-upload data-panel-edit-state="ignore">
      <div className={styles.subsectionHeading}>
        <div><span className={styles.eyebrow}>Imagen</span><h4>{title}</h4></div>
        {description ? <p>{description}</p> : null}
      </div>

      {previewSrc ? (
        <div style={{ maxWidth: 560, border: '1px solid #dfe7ef', borderRadius: 14, overflow: 'hidden', background: '#f8fafc' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt={previewUrl ? 'Vista previa del archivo seleccionado' : alt || title} style={{ display: 'block', width: '100%', maxHeight: 300, objectFit: 'contain' }} />
        </div>
      ) : null}

      <form onSubmit={handleSubmit} aria-busy={pending}>
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}>
            <span>Archivo</span>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleFileChange} required disabled={pending} />
            <small>JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.</small>
          </label>
          {showTextFields ? (
            <>
              <label className={styles.fieldWide}><span>Texto alternativo</span><input value={alt} onChange={(event) => setAlt(event.target.value)} required={requireAlt} disabled={pending} /></label>
              <label className={styles.fieldWide}><span>Crédito</span><input value={credit} onChange={(event) => setCredit(event.target.value)} disabled={pending} /></label>
            </>
          ) : null}
        </div>
        {error ? <div className={styles.readOnlyNotice} role="alert">{error}</div> : null}
        {message ? <div className={styles.savedNotice} role="status">{message}</div> : null}
        <div className={styles.formActions}>
          <small>La imagen quedará vinculada automáticamente a este contenido.</small>
          <button className={styles.secondaryButton} type="submit" disabled={pending || !selectedFile}>{buttonLabel}</button>
        </div>
      </form>
    </div>
  )
}
