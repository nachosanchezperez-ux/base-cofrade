'use client'

import { useEffect, useId, useRef, useState, useTransition } from 'react'
import {
  prepareBrotherhoodRelatedMediaUploadAction,
  uploadBrotherhoodRelatedMediaAction,
} from './actions'
import panelStyles from '@/app/panel/panel.module.css'
import mediaStyles from './media.module.css'
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client'

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_BATCH_FILES = 10

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

function pendingCopy(phase, progress, total) {
  const counter = total > 1 ? ` ${progress + 1} de ${total}` : ''
  if (phase === 'uploading') return `Subiendo${counter}…`
  if (phase === 'saving') return `Vinculando${counter}…`
  return 'Preparando…'
}

function errorMessage(error) {
  if (error instanceof Error && error.message) return error.message
  return 'No se ha podido subir la imagen. Revisa la conexión e inténtalo de nuevo.'
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
  returnSection = 'multimedia',
  selectAsHero = false,
}) {
  const fileInputId = useId()
  const alertRef = useRef(null)
  const previewUrlsRef = useRef([])
  const [selectedItems, setSelectedItems] = useState([])
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [pending, startTransition] = useTransition()

  useEffect(() => () => previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)), [])

  function announceError(message) {
    setError(message)
    window.dispatchEvent(new CustomEvent('panel-action-error', { detail: { message } }))
    window.requestAnimationFrame(() => alertRef.current?.focus())
  }

  function handleFileChange(event) {
    const files = Array.from(event.target.files || [])
    setError('')

    if (!files.length) {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current = []
      setSelectedItems([])
      return
    }

    if (files.length > MAX_BATCH_FILES) {
      event.target.value = ''
      announceError(`Puedes subir un máximo de ${MAX_BATCH_FILES} imágenes cada vez.`)
      return
    }

    const invalidType = files.find((file) => !ACCEPTED_IMAGE_TYPES.has(file.type))
    if (invalidType) {
      event.target.value = ''
      announceError(`«${invalidType.name}» no es JPG, PNG, WEBP, GIF ni AVIF.`)
      return
    }

    const oversized = files.find((file) => file.size > MAX_FILE_SIZE)
    if (oversized) {
      event.target.value = ''
      announceError(`«${oversized.name}» supera el máximo de 10 MB.`)
      return
    }

    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    const items = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      altText: defaultAlt,
      caption: '',
    }))
    previewUrlsRef.current = items.map((item) => item.previewUrl)
    setSelectedItems(items)
    setProgress(0)
  }

  function updateItem(index, field, value) {
    setSelectedItems((items) => items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (pending) return

    const form = event.currentTarget
    if (!form.reportValidity()) return
    if (!selectedItems.length) {
      announceError('Selecciona al menos una imagen para subir.')
      return
    }
    if (selectedItems.some((item) => !item.altText.trim())) {
      announceError('Cada imagen necesita su propia descripción accesible.')
      return
    }

    setError('')
    setProgress(0)

    startTransition(async () => {
      const supabase = createBrowserSupabaseClient()
      let destination = ''

      for (let index = 0; index < selectedItems.length; index += 1) {
        const item = selectedItems[index]
        const metadata = new FormData(form)
        metadata.delete('file')
        metadata.set('file_name', item.file.name)
        metadata.set('file_type', item.file.type)
        metadata.set('file_size', String(item.file.size))
        metadata.set('alt_text', item.altText.trim())
        metadata.set('caption', item.caption.trim())
        metadata.set('batch_mode', '1')
        setProgress(index)

        try {
          setPhase('preparing')
          const prepared = await prepareBrotherhoodRelatedMediaUploadAction(metadata)
          if (prepared?.error) throw new Error(prepared.error)
          if (!prepared?.upload?.path || !prepared?.upload?.token) {
            throw new Error('No se pudo preparar la subida directa de la imagen.')
          }

          setPhase('uploading')
          const uploaded = await supabase.storage
            .from('hilo-media')
            .uploadToSignedUrl(prepared.upload.path, prepared.upload.token, item.file, {
              cacheControl: '3600',
              contentType: item.file.type,
            })
          if (uploaded.error) throw new Error(`No se pudo subir «${item.file.name}»: ${uploaded.error.message}`)

          metadata.set('storage_path', prepared.upload.path)
          setPhase('saving')
          const result = await uploadBrotherhoodRelatedMediaAction(metadata)
          if (result?.error) throw new Error(result.error)
          destination = result?.destination || destination
        } catch (uploadError) {
          const completed = index
          const prefix = completed ? `${completed} de ${selectedItems.length} imágenes quedaron subidas. ` : ''
          previewUrlsRef.current.slice(0, completed).forEach((url) => URL.revokeObjectURL(url))
          previewUrlsRef.current = previewUrlsRef.current.slice(completed)
          setSelectedItems((items) => items.slice(completed))
          announceError(`${prefix}${errorMessage(uploadError)}`)
          setProgress(0)
          setPhase('idle')
          return
        }
      }

      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrlsRef.current = []
      window.location.assign(destination || window.location.href)
    })
  }

  const fileHelpId = `${fileInputId}-help`
  const fileSelectionId = `${fileInputId}-selection`

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      className={mediaStyles.uploadForm}
      aria-busy={pending}
      data-panel-mobile-upload
    >
      <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="target_kind" value={targetKind} />
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="return_section" value={returnSection} />
      <input type="hidden" name="select_as_hero" value={selectAsHero ? '1' : '0'} />

      <label className={mediaStyles.fileField} htmlFor={fileInputId}>
        <span>Fotografía</span>
        <span className={mediaStyles.filePicker}>
          <input
            className={mediaStyles.fileInput}
            id={fileInputId}
            name="file"
            type="file"
            accept="image/*"
            multiple={!selectAsHero}
            aria-describedby={`${fileHelpId} ${fileSelectionId}`}
            onChange={handleFileChange}
            disabled={pending}
            required
          />
          <span className={`${mediaStyles.filePreview} ${selectedItems.length ? mediaStyles.filePreviewReady : ''}`} aria-hidden="true">
            {selectedItems[0]?.previewUrl ? <img src={selectedItems[0].previewUrl} alt="" /> : '＋'}
          </span>
          <span className={mediaStyles.fileCopy} id={fileSelectionId} aria-live="polite">
            <strong>{selectedItems.length ? `${selectedItems.length} ${selectedItems.length === 1 ? 'fotografía seleccionada' : 'fotografías seleccionadas'}` : selectAsHero ? 'Elige una fotografía' : 'Elige una o varias fotografías'}</strong>
            <small>{selectedItems.length === 1 ? `${formatFileSize(selectedItems[0].file.size)} · preparada para subir` : selectedItems.length > 1 ? 'Se subirán una a una con progreso visible' : 'Fototeca, Cámara o Archivos'}</small>
          </span>
          <span className={mediaStyles.fileButton} aria-hidden="true">{selectedItems.length ? 'Cambiar' : 'Elegir'}</span>
        </span>
        <small id={fileHelpId}>{selectAsHero ? 'JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.' : 'JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB por imagen y 10 imágenes por lote.'} Cada imagen se envía directamente al archivo multimedia.</small>
      </label>

      <div className={mediaStyles.formGrid}>
        <label>
          <span>Crédito / autor</span>
          <input
            name="author_name"
            defaultValue={defaultAuthor}
            placeholder="Autor o Hermandad"
          />
          <small>Escribe solo el nombre. Hilo Cofrade añade «Fotografía ·» al mostrar el crédito.</small>
        </label>
        <label>
          <span>Derechos</span>
          <RightsSelect />
          <small>{rightsHelp}</small>
        </label>
      </div>

      {selectedItems.length ? (
        <div className={mediaStyles.batchList} aria-label="Datos de las imágenes seleccionadas">
          {selectedItems.map((item, index) => (
            <article className={mediaStyles.batchItem} key={`${item.file.name}-${item.file.size}-${item.file.lastModified}-${index}`}>
              <img src={item.previewUrl} alt="" />
              <div>
                <strong>{index + 1}. {item.file.name}</strong>
                <small>{formatFileSize(item.file.size)}</small>
                <label>
                  <span>Descripción accesible</span>
                  <input name="alt_text" value={item.altText} onChange={(event) => updateItem(index, 'altText', event.target.value)} required />
                </label>
                <label>
                  <span>Pie opcional</span>
                  <textarea name="caption" rows="2" value={item.caption} onChange={(event) => updateItem(index, 'caption', event.target.value)} placeholder="Información que ayude a contextualizar la imagen." />
                </label>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className={mediaStyles.uploadError} role="alert" ref={alertRef} tabIndex={-1}>
          <span aria-hidden="true">!</span>
          <div><strong>No se ha subido la imagen</strong><p>{error}</p></div>
          <button type="button" onClick={() => setError('')} aria-label="Cerrar aviso">×</button>
        </div>
      ) : null}

      <div className={mediaStyles.uploadActions}>
        <small>{uploadNote}</small>
        <button className={panelStyles.primaryButton} type="submit" disabled={pending || !selectedItems.length}>
          {pending ? <><span className={mediaStyles.pendingSpinner} aria-hidden="true" />{pendingCopy(phase, progress, selectedItems.length)}</> : selectAsHero ? 'Subir y usar como portada' : selectedItems.length > 1 ? `Subir ${selectedItems.length} imágenes` : 'Subir y vincular'}
        </button>
      </div>
    </form>
  )
}
