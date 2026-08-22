'use client'

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState, useTransition } from 'react'
import styles from '@/app/panel/panel.module.css'
import coverStyles from './EntityCoverEditor.module.css'
import { createClient } from '@/lib/supabase/client'

const ENTITY_LABELS = {
  brotherhood: 'hermandad',
  image: 'imagen',
  step: 'paso',
}

export default function EntityCoverEditor({ entity, cover, canEdit, action }) {
  const asset = cover?.asset || {}
  const [previewUrl, setPreviewUrl] = useState(cover?.publicUrl || '')
  const [focusX, setFocusX] = useState(cover?.focusX ?? 50)
  const [focusY, setFocusY] = useState(cover?.focusY ?? 50)
  const [mobileFocusX, setMobileFocusX] = useState(cover?.mobileFocusX ?? 50)
  const [mobileFocusY, setMobileFocusY] = useState(cover?.mobileFocusY ?? 50)
  const [fitMode, setFitMode] = useState(cover?.fitMode || 'auto')
  const [errorMessage, setErrorMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const [dimensions, setDimensions] = useState({ width: asset.width_px || 0, height: asset.height_px || 0 })

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const resolvedFit = useMemo(() => {
    if (fitMode !== 'auto') return fitMode
    return entity.type === 'step' && dimensions.height > dimensions.width * 1.12 ? 'contain' : 'cover'
  }, [dimensions, entity.type, fitMode])

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setDimensions({ width: 0, height: 0 })
    const image = new window.Image()
    image.onload = () => setDimensions({ width: image.naturalWidth, height: image.naturalHeight })
    image.src = objectUrl
  }

  function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    const formData = new FormData(event.currentTarget)
    const file = formData.get('cover_file')
    const hasFile = file instanceof File && file.size > 0

    startTransition(async () => {
      let uploadedPath = ''
      try {
        if (hasFile) {
          const extensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }
          const extension = extensions[file.type]
          if (!extension) throw new Error('La portada debe ser JPG, PNG, WEBP o AVIF.')
          if (file.size > 6 * 1024 * 1024) throw new Error('La portada no puede superar 6 MB.')

          uploadedPath = `${entity.id}/${crypto.randomUUID()}.${extension}`
          const supabase = createClient()
          const { error } = await supabase.storage.from('hilo-media').upload(uploadedPath, file, { contentType: file.type, upsert: false })
          if (error) throw new Error(`No se pudo subir la fotografía: ${error.message}`)
          formData.set('storage_path', uploadedPath)
          formData.set('original_file_name', file.name)
        }

        formData.delete('cover_file')
        await action(formData)
      } catch (error) {
        if (uploadedPath) {
          const supabase = createClient()
          await supabase.storage.from('hilo-media').remove([uploadedPath])
        }
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar la portada.')
      }
    })
  }

  const desktopStyle = { objectFit: resolvedFit, objectPosition: `${focusX}% ${focusY}%` }
  const mobileStyle = { objectFit: resolvedFit, objectPosition: `${mobileFocusX}% ${mobileFocusY}%` }

  return (
    <form onSubmit={handleSubmit} className={`${styles.panelCard} ${styles.editorForm} ${coverStyles.coverEditor}`}>
      <input type="hidden" name="entity_id" value={entity.id} />
      <input type="hidden" name="cover_relation_id" value={cover?.id || ''} />
      <input type="hidden" name="width_px" value={dimensions.width || ''} />
      <input type="hidden" name="height_px" value={dimensions.height || ''} />

      <div className={coverStyles.coverWorkspace}>
        <div className={coverStyles.coverPreviews}>
          <div>
            <span>Escritorio · encuadre editorial</span>
            <div className={`${coverStyles.coverPreview} ${coverStyles[`coverPreview_${entity.type}`] || ''}`}>
              {previewUrl ? <img src={previewUrl} alt="Previsualización de portada" style={desktopStyle} /> : <b>Selecciona una fotografía</b>}
            </div>
          </div>
          <div>
            <span>Móvil · encuadre independiente</span>
            <div className={`${coverStyles.coverPreview} ${coverStyles.coverPreviewMobile}`}>
              {previewUrl ? <img src={previewUrl} alt="Previsualización móvil" style={mobileStyle} /> : <b>Sin portada</b>}
            </div>
          </div>
        </div>

        <div className={`${styles.editorForm} ${coverStyles.coverControls}`}>
          <label className={styles.fieldWide}>
            <span>{cover ? 'Sustituir fotografía (opcional)' : 'Fotografía de portada'}</span>
            <input name="cover_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFile} required={!cover} disabled={!canEdit || isPending} />
            <small>JPG, PNG, WEBP o AVIF · máximo 6 MB.</small>
          </label>

          <div className={coverStyles.coverRangeGrid}>
            <label><span>Foco horizontal · escritorio</span><input name="focus_x" type="range" min="0" max="100" value={focusX} onChange={(event) => setFocusX(event.target.value)} disabled={!canEdit} /><output>{focusX}%</output></label>
            <label><span>Foco vertical · escritorio</span><input name="focus_y" type="range" min="0" max="100" value={focusY} onChange={(event) => setFocusY(event.target.value)} disabled={!canEdit} /><output>{focusY}%</output></label>
            <label><span>Foco horizontal · móvil</span><input name="mobile_focus_x" type="range" min="0" max="100" value={mobileFocusX} onChange={(event) => setMobileFocusX(event.target.value)} disabled={!canEdit} /><output>{mobileFocusX}%</output></label>
            <label><span>Foco vertical · móvil</span><input name="mobile_focus_y" type="range" min="0" max="100" value={mobileFocusY} onChange={(event) => setMobileFocusY(event.target.value)} disabled={!canEdit} /><output>{mobileFocusY}%</output></label>
          </div>

          <label>
            <span>Comportamiento de la fotografía</span>
            <select name="fit_mode" value={fitMode} onChange={(event) => setFitMode(event.target.value)} disabled={!canEdit}>
              <option value="auto">Automático recomendado</option>
              <option value="cover">Llenar el encuadre</option>
              <option value="contain">Mostrar la fotografía completa</option>
            </select>
          </label>
          <p className={coverStyles.coverHint}>La portada se adapta al lenguaje visual de la {ENTITY_LABELS[entity.type] || 'entidad'} y mantiene un encuadre independiente en móvil.</p>
        </div>
      </div>

      <div className={`${styles.formGrid} ${coverStyles.coverMetadata}`}>
        <label><span>Título interno</span><input name="title" defaultValue={asset.title || ''} disabled={!canEdit} /></label>
        <label><span>Texto alternativo</span><input name="alt_text" defaultValue={asset.alt_text || ''} required disabled={!canEdit} /></label>
        <label className={styles.fieldWide}><span>Pie de foto</span><textarea name="caption" defaultValue={asset.caption || ''} rows="2" disabled={!canEdit} /></label>
        <label><span>Autoría fotográfica</span><input name="author_name" defaultValue={asset.author_name || ''} disabled={!canEdit} /></label>
        <label><span>Titular de derechos</span><input name="rights_holder" defaultValue={asset.rights_holder || ''} disabled={!canEdit} /></label>
        <label>
          <span>Estado de derechos</span>
          <select name="rights_status" defaultValue={asset.rights_status || ''} required disabled={!canEdit}>
            <option value="" disabled>Selecciona estado</option>
            <option value="owned">Propia</option>
            <option value="authorized">Autorizada</option>
            <option value="licensed">Con licencia</option>
            <option value="public_domain">Dominio público</option>
          </select>
        </label>
        <label><span>Licencia</span><input name="license" defaultValue={asset.license || ''} disabled={!canEdit} /></label>
        <label><span>Fuente</span><input name="source_name" defaultValue={asset.source_name || ''} disabled={!canEdit} /></label>
        <label><span>URL de fuente</span><input name="source_url" type="url" defaultValue={asset.source_url || ''} disabled={!canEdit} /></label>
        <label className={styles.fieldWide}><span>Notas de permiso</span><textarea name="permission_notes" defaultValue={asset.permission_notes || ''} rows="2" disabled={!canEdit} /></label>
      </div>

      <div className={styles.formActions}>
        <small>{dimensions.width && dimensions.height ? `${dimensions.width} × ${dimensions.height} px` : 'Las dimensiones se detectan al seleccionar el archivo.'}</small>
        {errorMessage ? <span className={coverStyles.formError} role="alert">{errorMessage}</span> : null}
        {canEdit ? <button className={styles.primaryButton} type="submit" disabled={isPending}>{isPending ? 'Guardando…' : cover ? 'Guardar portada' : 'Crear portada'}</button> : null}
      </div>
    </form>
  )
}
