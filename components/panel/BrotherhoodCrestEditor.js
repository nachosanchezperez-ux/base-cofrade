'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState, useTransition } from 'react'
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client'
import {
  prepareBrotherhoodCrestUploadAction,
  removeBrotherhoodCrestAction,
  saveBrotherhoodCrestUploadAction,
} from '@/app/panel/(protected)/hermandades/[id]/crest-actions'
import panelStyles from '@/app/panel/panel.module.css'
import styles from './BrotherhoodCrestEditor.module.css'

const ACCEPTED_TYPES = new Set(['image/svg+xml', 'image/png', 'image/webp'])
const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 5 * 1024 * 1024 ? 1 : 0)} MB`
}

function pendingCopy(phase) {
  if (phase === 'uploading') return 'Subiendo…'
  if (phase === 'saving') return 'Aplicando…'
  if (phase === 'removing') return 'Retirando…'
  return 'Preparando…'
}

function errorMessage(error) {
  if (error instanceof Error && error.message) return error.message
  return 'No se ha podido actualizar el escudo. Revisa la conexión e inténtalo de nuevo.'
}

function dimensionAdvice(width, height) {
  if (!width || !height) return null
  if (width < 1000 || height < 1000) {
    return {
      tone: 'warning',
      text: `${width} × ${height} px · válido, pero recomendamos al menos 1000 × 1000 px.`,
    }
  }
  const ratio = width / height
  if (ratio < 0.9 || ratio > 1.1) {
    return {
      tone: 'neutral',
      text: `${width} × ${height} px · válido. Para homogeneidad, recomendamos lienzo cuadrado de 1600 × 1600 px.`,
    }
  }
  if (width < 1600 || height < 1600) {
    return {
      tone: 'neutral',
      text: `${width} × ${height} px · resolución correcta. Para máxima nitidez, 1600 × 1600 px.`,
    }
  }
  return {
    tone: 'success',
    text: `${width} × ${height} px · resolución adecuada para el Panel y la ficha pública.`,
  }
}

export default function BrotherhoodCrestEditor({
  brotherhoodId,
  brotherhoodName,
  currentPath = '',
  canEdit = true,
}) {
  const inputId = useId()
  const alertRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [fileAdvice, setFileAdvice] = useState(null)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('idle')
  const [pending, startTransition] = useTransition()

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function announceError(message) {
    setError(message)
    window.dispatchEvent(new CustomEvent('panel-action-error', { detail: { message } }))
    window.requestAnimationFrame(() => alertRef.current?.focus())
  }

  function clearSelection() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl('')
    setFileAdvice(null)
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setError('')
    setFileAdvice(null)

    if (!file) {
      clearSelection()
      return
    }

    if (!ACCEPTED_TYPES.has(file.type)) {
      event.target.value = ''
      clearSelection()
      announceError('El escudo debe ser SVG, PNG o WEBP.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      event.target.value = ''
      clearSelection()
      announceError('El escudo no puede superar 10 MB.')
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const nextPreviewUrl = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(nextPreviewUrl)

    if (file.type === 'image/svg+xml') {
      setFileAdvice({ tone: 'success', text: 'SVG vectorial · escalable y recomendado para el escudo maestro.' })
      return
    }

    const probe = new window.Image()
    probe.onload = () => setFileAdvice(dimensionAdvice(probe.naturalWidth, probe.naturalHeight))
    probe.onerror = () => setFileAdvice({ tone: 'warning', text: 'No hemos podido leer las dimensiones. El archivo podrá validarse al subirlo.' })
    probe.src = nextPreviewUrl
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (pending) return
    if (!selectedFile) {
      announceError('Selecciona un escudo para subir.')
      return
    }

    const metadata = new FormData()
    metadata.set('brotherhood_id', brotherhoodId)
    metadata.set('file_name', selectedFile.name)
    metadata.set('file_type', selectedFile.type)
    metadata.set('file_size', String(selectedFile.size))
    setError('')

    startTransition(async () => {
      try {
        setPhase('preparing')
        const prepared = await prepareBrotherhoodCrestUploadAction(metadata)
        if (prepared?.error) {
          announceError(prepared.error)
          setPhase('idle')
          return
        }
        if (!prepared?.upload?.path || !prepared?.upload?.token) {
          announceError('No se pudo preparar la subida directa del escudo.')
          setPhase('idle')
          return
        }

        setPhase('uploading')
        const supabase = createBrowserSupabaseClient()
        const uploaded = await supabase.storage
          .from('hilo-media')
          .uploadToSignedUrl(
            prepared.upload.path,
            prepared.upload.token,
            selectedFile,
            {
              cacheControl: '3600',
              contentType: selectedFile.type,
            }
          )

        if (uploaded.error) {
          announceError(`No se pudo subir el escudo: ${uploaded.error.message}`)
          setPhase('idle')
          return
        }

        metadata.set('storage_path', prepared.upload.path)
        setPhase('saving')
        const result = await saveBrotherhoodCrestUploadAction(metadata)
        if (result?.error) {
          announceError(result.error)
          setPhase('idle')
        }
      } catch (uploadError) {
        announceError(errorMessage(uploadError))
        setPhase('idle')
      }
    })
  }

  function handleRemove() {
    if (pending || !currentPath) return
    if (!window.confirm('¿Retirar el escudo de la ficha? El archivo histórico solo se borrará si fue subido desde este editor.')) return

    const metadata = new FormData()
    metadata.set('brotherhood_id', brotherhoodId)
    setError('')

    startTransition(async () => {
      try {
        setPhase('removing')
        await removeBrotherhoodCrestAction(metadata)
      } catch (removeError) {
        announceError(errorMessage(removeError))
        setPhase('idle')
      }
    })
  }

  const previewSource = previewUrl || currentPath

  return (
    <section className={`${panelStyles.panelCard} ${styles.card}`} id="escudo" data-panel-crest-editor>
      <div className={styles.heading}>
        <div>
          <span className={panelStyles.eyebrow}>Identidad visual</span>
          <h3>Escudo de la hermandad</h3>
        </div>
        <p>Sube, sustituye o retira el escudo desde aquí. La ficha pública se actualizará al guardar.</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.previewColumn}>
          <div className={styles.previewFrame} data-empty={!previewSource}>
            {previewSource ? (
              <Image
                src={previewSource}
                alt={previewUrl ? 'Vista previa del nuevo escudo' : `Escudo actual de ${brotherhoodName}`}
                fill
                sizes="(max-width: 860px) 220px, 240px"
                className={styles.previewImage}
                unoptimized
              />
            ) : (
              <div className={styles.emptyPreview}><strong>Sin escudo</strong><span>Sube el archivo maestro</span></div>
            )}
          </div>
          <div className={styles.previewStatus}>
            <strong>{previewUrl ? 'Nuevo escudo preparado' : currentPath ? 'Escudo publicado' : 'Escudo pendiente'}</strong>
            <small>{selectedFile ? `${selectedFile.name} · ${formatFileSize(selectedFile.size)}` : currentPath ? 'Este es el recurso que usa ahora la ficha.' : 'Todavía no hay un recurso visual vinculado.'}</small>
          </div>
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.specGrid} aria-label="Requisitos del escudo">
            <div><span>Formato</span><strong>SVG recomendado</strong><small>También PNG o WEBP</small></div>
            <div><span>Dimensiones</span><strong>1600 × 1600 px</strong><small>Mínimo 1000 × 1000 en raster</small></div>
            <div><span>Fondo</span><strong>Transparente</strong><small>Escudo centrado y con margen</small></div>
            <div><span>Peso</span><strong>Máximo 10 MB</strong><small>Sin compresión destructiva</small></div>
          </div>

          <form className={styles.uploadForm} onSubmit={handleSubmit} aria-busy={pending} data-panel-edit-state="ignore">
            <label className={styles.fileField} htmlFor={inputId}>
              <span>Archivo del escudo</span>
              <span className={styles.filePicker}>
                <input
                  id={inputId}
                  name="crest_file"
                  type="file"
                  accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp"
                  onChange={handleFileChange}
                  disabled={pending || !canEdit}
                />
                <span>
                  <strong>{selectedFile ? selectedFile.name : currentPath ? 'Sustituir escudo' : 'Elegir escudo'}</strong>
                  <small>{selectedFile ? 'Archivo preparado para subir' : 'Archivos, Fototeca o almacenamiento del dispositivo'}</small>
                </span>
                <b aria-hidden="true">{selectedFile ? 'Cambiar' : 'Elegir'}</b>
              </span>
            </label>

            {fileAdvice ? <div className={styles.fileAdvice} data-tone={fileAdvice.tone}>{fileAdvice.text}</div> : null}

            {error ? (
              <div className={styles.error} role="alert" ref={alertRef} tabIndex={-1}>
                <span aria-hidden="true">!</span>
                <div><strong>No se ha actualizado el escudo</strong><p>{error}</p></div>
                <button type="button" onClick={() => setError('')} aria-label="Cerrar aviso">×</button>
              </div>
            ) : null}

            <div className={styles.actions}>
              <small>SVG debe ser limpio y autocontenido. El Panel comprueba el archivo antes de publicarlo.</small>
              <div>
                {currentPath ? <button className={panelStyles.secondaryButton} type="button" onClick={handleRemove} disabled={pending || !canEdit}>Retirar escudo</button> : null}
                <button className={panelStyles.primaryButton} type="submit" disabled={pending || !selectedFile || !canEdit}>
                  {pending ? pendingCopy(phase) : currentPath ? 'Sustituir escudo' : 'Subir escudo'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
