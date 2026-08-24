'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import { uploadBrotherhoodRelatedMediaAction } from './actions'
import panelStyles from '@/app/panel/panel.module.css'
import mediaStyles from './media.module.css'

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(bytes < 5 * 1024 * 1024 ? 1 : 0)} MB`
}

function RightsSelect() {
  return (
    <select name="rights_status" defaultValue="authorized">
      <option value="authorized">Autorizada por la Hermandad o el autor</option>
      <option value="owned">Propiedad de Hilo Cofrade</option>
    </select>
  )
}

export default function QuickMediaUploadForm({
  brotherhoodId,
  targetId,
  targetKind,
  title,
  defaultAuthor = '',
  defaultAlt = '',
  rightsHelp,
  uploadNote,
}) {
  const fileInputId = useId()
  const alertRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  function announceError(message) {
    setError(message)
    window.dispatchEvent(new CustomEvent('panel-action-error', { detail: { message } }))
    window.requestAnimationFrame(() => alertRef.current?.focus())
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    setError('')

    if (!file) {
      setSelectedFile(null)
      setPreviewUrl('')
      return
    }

    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      event.target.value = ''
      setSelectedFile(null)
      setPreviewUrl('')
      announceError('La imagen debe ser JPG, PNG, WEBP, GIF o AVIF.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      event.target.value = ''
      setSelectedFile(null)
      setPreviewUrl('')
      announceError('La imagen no puede superar 10 MB.')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (pending) return

    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    setError('')

    startTransition(async () => {
      const result = await uploadBrotherhoodRelatedMediaAction(formData)
      if (result?.error) announceError(result.error)
    })
  }

  const fileHelpId = `${fileInputId}-help`
  const fileSelectionId = `${fileInputId}-selection`

  return (
    <form
      action={uploadBrotherhoodRelatedMediaAction}
      onSubmit={handleSubmit}
      className={mediaStyles.uploadForm}
      aria-busy={pending}
      data-panel-mobile-upload
    >
      <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="target_kind" value={targetKind} />
      <input type="hidden" name="title" value={title} />

      <label className={mediaStyles.fileField} htmlFor={fileInputId}>
        <span>Fotografía</span>
        <span className={mediaStyles.filePicker}>
          <input
            className={mediaStyles.fileInput}
            id={fileInputId}
            name="file"
            type="file"
            accept="image/*"
            aria-describedby={`${fileHelpId} ${fileSelectionId}`}
            onChange={handleFileChange}
            disabled={pending}
            required
          />
          <span className={`${mediaStyles.filePreview} ${previewUrl ? mediaStyles.filePreviewReady : ''}`} aria-hidden="true">
            {previewUrl ? <img src={previewUrl} alt="" /> : '＋'}
          </span>
          <span className={mediaStyles.fileCopy} id={fileSelectionId} aria-live="polite">
            <strong>{selectedFile ? selectedFile.name : 'Elige una fotografía'}</strong>
            <small>{selectedFile ? `${formatFileSize(selectedFile.size)} · preparada para subir` : 'Fototeca, Cámara o Archivos'}</small>
          </span>
          <span className={mediaStyles.fileButton} aria-hidden="true">{selectedFile ? 'Cambiar' : 'Elegir'}</span>
        </span>
        <small id={fileHelpId}>JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB. La imagen elegida se conserva si hay que corregir algún dato.</small>
      </label>

      <div className={mediaStyles.formGrid}>
        <label>
          <span>Crédito / autor</span>
          <input
            name="author_name"
            defaultValue={defaultAuthor}
            placeholder="Fotografía · Autor / Hermandad"
          />
        </label>
        <label>
          <span>Derechos</span>
          <RightsSelect />
          <small>{rightsHelp}</small>
        </label>
      </div>

      <label>
        <span>Descripción accesible</span>
        <input name="alt_text" defaultValue={defaultAlt} required />
      </label>

      <label>
        <span>Pie opcional</span>
        <textarea name="caption" rows="2" placeholder="Información que ayude a contextualizar la imagen." />
      </label>

      {error ? (
        <div className={mediaStyles.uploadError} role="alert" ref={alertRef} tabIndex={-1}>
          <span aria-hidden="true">!</span>
          <div><strong>No se ha subido la imagen</strong><p>{error}</p></div>
          <button type="button" onClick={() => setError('')} aria-label="Cerrar aviso">×</button>
        </div>
      ) : null}

      <div className={mediaStyles.uploadActions}>
        <small>{uploadNote}</small>
        <button className={panelStyles.primaryButton} type="submit" disabled={pending || !selectedFile}>
          {pending ? <><span className={mediaStyles.pendingSpinner} aria-hidden="true" />Subiendo…</> : 'Subir y vincular'}
        </button>
      </div>
    </form>
  )
}
