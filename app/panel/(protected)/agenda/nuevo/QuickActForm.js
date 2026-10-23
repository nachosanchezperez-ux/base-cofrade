'use client'

import { startTransition, useMemo, useRef, useState } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { QUICK_ACT_TYPES } from '@/lib/panel/quick-act-core'
import styles from '@/app/panel/panel.module.css'

// Formulario de alta rápida (#agenda-alta-rapida). La Hermandad propone su
// localidad y la localidad filtra los lugares; el resto lo decide el editor.
export default function QuickActForm({ action, brotherhoods, municipalities, places, defaults = {} }) {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const submitting = useRef(false)
  const [typeKey, setTypeKey] = useState('')
  const [brotherhoodId, setBrotherhoodId] = useState('')
  const [municipalityId, setMunicipalityId] = useState('')
  const [hasImage, setHasImage] = useState(false)
  const type = QUICK_ACT_TYPES.find((item) => item.key === typeKey)
  const isCult = type?.group === 'cult'
  const visiblePlaces = useMemo(
    () => (municipalityId ? places.filter((place) => place.municipality_id === municipalityId) : places),
    [municipalityId, places]
  )

  function chooseBrotherhood(id) {
    setBrotherhoodId(id)
    const brotherhood = brotherhoods.find((item) => item.id === id)
    if (brotherhood?.municipalityId) setMunicipalityId(brotherhood.municipalityId)
  }

  // An event handler keeps uncontrolled fields and the file input intact on error.
  // A React form action would reset them even when it returns a validation error.
  function submit(event) {
    event.preventDefault()
    if (submitting.current) return
    const data = new FormData(event.currentTarget)
    submitting.current = true
    setPending(true)
    setError('')
    startTransition(async () => {
      try {
        const result = await action(data)
        if (result?.error) setError(result.error)
      } catch (error) {
        unstable_rethrow(error)
        setError('No se pudo confirmar el resultado. Revisa la ficha antes de volver a enviar. Los datos siguen en este formulario.')
      } finally {
        submitting.current = false
        setPending(false)
      }
    })
  }

  return (
    <form onSubmit={submit} className={styles.editorForm}>
      {error ? <div className={styles.readOnlyNotice} role="alert">{error}</div> : null}
      <div className={styles.formGrid}>
        <label>
          <span>Tipo de acto</span>
          <select name="act_type" value={typeKey} onChange={(event) => setTypeKey(event.target.value)} required>
            <option value="">Elige…</option>
            <optgroup label="Salidas">
              {QUICK_ACT_TYPES.filter((item) => item.group === 'outing').map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </optgroup>
            <optgroup label="Cultos">
              {QUICK_ACT_TYPES.filter((item) => item.group === 'cult').map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </optgroup>
          </select>
        </label>
        <label>
          <span>Hermandad</span>
          <select name="brotherhood_id" value={brotherhoodId} onChange={(event) => chooseBrotherhood(event.target.value)} required>
            <option value="">Elige…</option>
            {brotherhoods.map((item) => <option key={item.id} value={item.id}>{item.name}{item.status !== 'published' ? ' (sin publicar)' : ''}</option>)}
          </select>
        </label>
        <label className={styles.fieldWide}>
          <span>Título <small>(opcional)</small></span>
          <input name="title" maxLength={160} defaultValue={defaults.title || ''} placeholder={type ? `${type.label.replace(/ \(ordinari[ao]\)$/, '')} · Hermandad` : 'Se compone con el tipo y la Hermandad'} />
        </label>
        <label>
          <span>{isCult ? 'Primer día' : 'Fecha'}</span>
          <input type="date" name="start_date" required />
        </label>
        <label>
          <span>{isCult ? 'Último día' : 'Fecha de regreso'} <small>(si es otro día)</small></span>
          <input type="date" name="end_date" />
        </label>
        <label>
          <span>{isCult ? 'Hora (cada día)' : 'Hora de salida'}</span>
          <input type="time" name="start_time" />
        </label>
        {isCult ? (
          <label>
            <span>Horario en texto <small>(opcional)</small></span>
            <input name="time_text" maxLength={120} placeholder="Ej. 20:00, Función el domingo a las 12:00" />
          </label>
        ) : null}
        <label>
          <span>Localidad</span>
          <select name="municipality_id" value={municipalityId} onChange={(event) => setMunicipalityId(event.target.value)}>
            <option value="">Elige…</option>
            {municipalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span>Lugar</span>
          <select name="place_id" defaultValue="">
            <option value="">{visiblePlaces.length ? 'Elige…' : 'Sin lugares en esta localidad'}</option>
            {visiblePlaces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        {!isCult ? (
          <label className={styles.fieldWide}>
            <span>Lugar en texto <small>(si no está en la lista)</small></span>
            <input name="place_text" maxLength={160} placeholder="Ej. Capilla de San José" />
          </label>
        ) : null}
        <label className={styles.fieldWide}>
          <span>Información para el público <small>(opcional)</small></span>
          <textarea name="description" rows={3} maxLength={2000} defaultValue={defaults.description || ''} placeholder="Recorrido, motivo, quién preside…" />
        </label>

        <label className={styles.fieldWide}>
          <span>Cartel o fotografía <small>(opcional, máx. 10 MB)</small></span>
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => setHasImage(Boolean(event.target.files?.length))} />
        </label>
        {hasImage ? (
          <>
            <label>
              <span>¿Qué es?</span>
              <select name="image_kind" defaultValue="poster">
                <option value="poster">Cartel (se muestra entero)</option>
                <option value="photo">Fotografía</option>
              </select>
            </label>
            <label>
              <span>Derechos</span>
              <select name="image_rights" defaultValue="" required>
                <option value="">Elige…</option>
                <option value="authorized">Autorizada por la Hermandad o su autor</option>
                <option value="owned">Propia de Hilo Cofrade</option>
              </select>
            </label>
            <label>
              <span>Autor o crédito</span>
              <input name="image_credit" maxLength={180} placeholder="Autor o Hermandad" />
            </label>
            <label>
              <span>Descripción de la imagen</span>
              <input name="image_alt" maxLength={300} required placeholder="Ej. Cartel del Rosario de la Aurora 2026" />
            </label>
          </>
        ) : null}

        <label className={styles.checkField}>
          <input type="checkbox" name="publish" defaultChecked />
          <span>Publicar ya en la Agenda (si no, queda en borrador)</span>
        </label>
      </div>
      <div className={styles.formActions}>
        <small>Se comprueba que no exista ya el mismo acto de la Hermandad ese día.</small>
        <button className={styles.primaryButton} type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Crear acto'}</button>
      </div>
    </form>
  )
}
