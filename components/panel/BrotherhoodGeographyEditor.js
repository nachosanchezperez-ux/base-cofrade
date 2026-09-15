'use client'

import { useState } from 'react'
import SearchableSelect from '@/components/panel/SearchableSelect'
import {
  createMunicipalityAction as createMunicipality,
  createPlaceAction as createPlace,
} from '@/app/panel/(protected)/hermandades/[id]/geography-actions'
import styles from '@/app/panel/panel.module.css'

function municipalityLabel(item) {
  return [item.name, item.province].filter(Boolean).join(' · ')
}

function MunicipalitySelect({
  name,
  label = 'Localidad',
  municipalities,
  value,
  onChange,
  emptyLabel = 'Sin localidad seleccionada',
  required = false,
}) {
  return (
    <label>
      <span>{label}</span>
      <select
        name={name}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        <option value="">{emptyLabel}</option>
        {municipalities.map((item) => (
          <option key={item.id} value={item.id}>{municipalityLabel(item)}</option>
        ))}
      </select>
    </label>
  )
}

function placeOptions(items) {
  return items.map((item) => ({
    value: item.id,
    label: `${item.name} · ${item.place_type || 'Lugar'} · ${item.municipality?.name || 'Sin localidad'}`,
    searchText: item.address || '',
  }))
}

export function BrotherhoodGeographyFields({
  municipalities,
  places,
  selectedMunicipalityId,
  selectedPlaceId,
  canEdit = true,
  createMunicipalityAction = createMunicipality,
  createPlaceAction = createPlace,
}) {
  const [municipalityId, setMunicipalityId] = useState(selectedMunicipalityId || '')
  const [placeId, setPlaceId] = useState(selectedPlaceId || '')
  const [creatingMunicipality, setCreatingMunicipality] = useState(false)
  const [newPlaceName, setNewPlaceName] = useState('')
  const [newPlaceMunicipalityId, setNewPlaceMunicipalityId] = useState(selectedMunicipalityId || '')

  const visiblePlaces = municipalityId
    ? places.filter((place) => place.municipality_id === municipalityId)
    : places
  const placeChoices = placeOptions(visiblePlaces)

  const chooseMunicipality = (nextId) => {
    setMunicipalityId(nextId)
    setNewPlaceMunicipalityId(nextId)
    const currentPlace = places.find((place) => place.id === placeId)
    if (currentPlace && nextId && currentPlace.municipality_id !== nextId) setPlaceId('')
  }

  const choosePlace = (nextId) => {
    setPlaceId(nextId)
    const place = places.find((item) => item.id === nextId)
    if (place?.municipality_id) {
      setMunicipalityId(place.municipality_id)
      setNewPlaceMunicipalityId(place.municipality_id)
    }
  }

  return (
    <>
      <div className={styles.fieldWide}>
        <MunicipalitySelect
          name="municipality_id"
          municipalities={municipalities}
          value={municipalityId}
          onChange={chooseMunicipality}
        />
        {canEdit ? (
          <div className={styles.formActions} style={{ marginTop: 8 }}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => setCreatingMunicipality((current) => !current)}
              aria-expanded={creatingMunicipality}
            >
              {creatingMunicipality ? 'Cancelar nueva localidad' : 'Crear nueva localidad'}
            </button>
          </div>
        ) : null}
        {creatingMunicipality && canEdit ? (
          <div className={styles.editorItem} style={{ marginTop: 12 }}>
            <strong>Crear Localidad</strong>
            <p className={styles.emptyText}>Completa el alta y se usará directamente en esta Hermandad.</p>
            <div className={styles.formGrid}>
              <label><span>Nombre</span><input name="new_municipality_name" required /></label>
              <label><span>Provincia</span><input name="new_municipality_province" defaultValue="Sevilla" required /></label>
              <label><span>Comunidad autónoma</span><input name="new_municipality_autonomous_community" defaultValue="Andalucía" required /></label>
              <label><span>País</span><input name="new_municipality_country" defaultValue="España" required /></label>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setCreatingMunicipality(false)}>Cancelar</button>
              <button type="submit" formAction={createMunicipalityAction} formNoValidate className={styles.primaryButton}>Crear y usar Localidad</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.fieldWide}>
        <SearchableSelect
          name="canonical_see_place_id"
          label="Sede canónica"
          options={placeChoices}
          value={placeId}
          onChange={choosePlace}
          emptyLabel="Sin Sede canónica seleccionada"
          searchPlaceholder="Buscar Sede por nombre…"
          onCreate={canEdit ? (name) => {
            setNewPlaceName(name)
            setNewPlaceMunicipalityId(municipalityId || selectedMunicipalityId || '')
          } : undefined}
          createLabel="Crear"
        />
        {newPlaceName && canEdit ? (
          <div className={styles.editorItem} style={{ marginTop: 12 }}>
            <strong>Crear “{newPlaceName}”</strong>
            <p className={styles.emptyText}>La nueva Sede se creará o reutilizará y quedará asignada automáticamente.</p>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Nombre</span><input name="new_place_name" defaultValue={newPlaceName} required /></label>
              <div className={styles.fieldWide}>
                <MunicipalitySelect
                  name="new_place_municipality_id"
                  municipalities={municipalities}
                  value={newPlaceMunicipalityId}
                  onChange={setNewPlaceMunicipalityId}
                  emptyLabel="Selecciona una localidad"
                  required
                />
              </div>
              <label><span>Tipo de lugar</span><input name="new_place_type" placeholder="Parroquia" /></label>
              <label><span>Dirección</span><input name="new_place_address" placeholder="Calle y número" /></label>
              <label><span>Latitud</span><input name="new_place_latitude" inputMode="decimal" placeholder="37.388" /></label>
              <label><span>Longitud</span><input name="new_place_longitude" inputMode="decimal" placeholder="-5.99" /></label>
              <label className={styles.fieldWide}>
                <span>Horario de apertura / visita</span>
                <textarea name="new_place_opening_hours_text" rows="3" placeholder="Texto documentado del horario habitual de apertura" />
                <small>Misas, cultos y celebraciones se gestionan por separado en Cultos.</small>
              </label>
              <label><span>Fecha de comprobación del horario</span><input name="new_place_opening_hours_verified_at" type="date" /></label>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setNewPlaceName('')}>Cancelar</button>
              <button type="submit" formAction={createPlaceAction} formNoValidate className={styles.primaryButton}>Crear y usar como Sede canónica</button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export function BrotherhoodGeographyInlineTools({
  brotherhoodId,
  canEdit,
  municipalities,
  places,
  selectedPlaceId,
  updatePlaceAction,
}) {
  if (!canEdit) return null
  const selectedPlace = places.find((item) => item.id === selectedPlaceId) || null
  if (!selectedPlace) return null

  return (
    <div className={styles.editorStack} style={{ marginTop: 16 }}>
      <details className={styles.addDetails}>
        <summary>Editar datos de la Sede seleccionada <span>＋</span></summary>
        <form action={updatePlaceAction} className={`${styles.editorItem} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
          <input type="hidden" name="place_id" value={selectedPlace.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre</span><input name="place_name" defaultValue={selectedPlace.name} required /></label>
            <label><span>Localidad</span><select name="place_municipality_id" defaultValue={selectedPlace.municipality_id || ''} required><option value="">Selecciona una localidad</option>{municipalities.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.province}</option>)}</select></label>
            <label><span>Tipo de lugar</span><input name="place_type" defaultValue={selectedPlace.place_type || ''} /></label>
            <label><span>Dirección</span><input name="place_address" defaultValue={selectedPlace.address || ''} /></label>
            <label><span>Latitud</span><input name="place_latitude" inputMode="decimal" defaultValue={selectedPlace.latitude ?? ''} placeholder="37.388" /></label>
            <label><span>Longitud</span><input name="place_longitude" inputMode="decimal" defaultValue={selectedPlace.longitude ?? ''} placeholder="-5.99" /></label>
            <label className={styles.fieldWide}>
              <span>Horario de apertura / visita</span>
              <textarea name="place_opening_hours_text" rows="3" defaultValue={selectedPlace.opening_hours_text || ''} />
              <small>Misas, cultos y celebraciones se gestionan por separado en el módulo Cultos.</small>
            </label>
            <label><span>Fecha de comprobación del horario</span><input name="place_opening_hours_verified_at" type="date" defaultValue={selectedPlace.opening_hours_verified_at || ''} /></label>
          </div>
          <div className={styles.formActions}>
            <small>El Lugar es compartido: dirección, coordenadas y horario se reutilizan automáticamente desde otras entidades que usen esta misma Sede.</small>
            <button className={styles.secondaryButton} type="submit">Guardar Lugar</button>
          </div>
        </form>
      </details>
    </div>
  )
}
