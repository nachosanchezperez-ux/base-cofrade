import SearchableSelect from '@/components/panel/SearchableSelect'
import styles from '@/app/panel/panel.module.css'

function municipalityOptions(items) {
  return items.map((item) => ({
    value: item.id,
    label: `${item.name} · ${item.province}`,
    searchText: `${item.autonomous_community} ${item.country}`,
  }))
}

function placeOptions(items) {
  return items.map((item) => ({
    value: item.id,
    label: `${item.name}${item.municipality?.name ? ` · ${item.municipality.name}` : ''}`,
    searchText: `${item.place_type || ''} ${item.address || ''}`,
  }))
}

export function BrotherhoodGeographyFields({ municipalities, places, selectedMunicipalityId, selectedPlaceId }) {
  return (
    <>
      <SearchableSelect
        name="municipality_id"
        label="Localidad"
        options={municipalityOptions(municipalities)}
        defaultValue={selectedMunicipalityId}
        emptyLabel="Sin localidad"
        searchPlaceholder="Buscar localidad existente…"
      />
      <SearchableSelect
        name="canonical_see_place_id"
        label="Sede canónica"
        options={placeOptions(places)}
        defaultValue={selectedPlaceId}
        emptyLabel="Sin Sede canónica"
        searchPlaceholder="Buscar Lugar por nombre, localidad o dirección…"
      />
    </>
  )
}

export function BrotherhoodGeographyInlineTools({
  brotherhoodId,
  canEdit,
  municipalities,
  places,
  selectedMunicipalityId,
  selectedPlaceId,
  createMunicipalityAction,
  createPlaceAction,
  updatePlaceAction,
}) {
  if (!canEdit) return null
  const municipalitiesForSelect = municipalityOptions(municipalities)
  const selectedPlace = places.find((item) => item.id === selectedPlaceId) || null

  return (
    <div className={styles.editorStack} style={{ marginTop: 16 }}>
      <details className={styles.addDetails}>
        <summary>Crear Localidad si no existe <span>＋</span></summary>
        <form action={createMunicipalityAction} className={`${styles.editorItem} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
          <div className={styles.formGrid}>
            <label><span>Nombre</span><input name="name" placeholder="Sevilla" required /></label>
            <label><span>Provincia</span><input name="province" defaultValue="Sevilla" required /></label>
            <label><span>Comunidad autónoma</span><input name="autonomous_community" defaultValue="Andalucía" required /></label>
            <label><span>País</span><input name="country" defaultValue="España" required /></label>
          </div>
          <div className={styles.formActions}>
            <small>Se busca antes de crear y el registro resultante vuelve seleccionado en Información general.</small>
            <button className={styles.secondaryButton} type="submit">Buscar o crear Localidad</button>
          </div>
        </form>
      </details>

      <details className={styles.addDetails}>
        <summary>Crear Lugar / Sede si no existe <span>＋</span></summary>
        <form action={createPlaceAction} className={`${styles.editorItem} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
          <div className={styles.formGrid}>
            <SearchableSelect
              className={styles.fieldWide}
              name="municipality_id"
              label="Localidad del Lugar"
              options={municipalitiesForSelect}
              defaultValue={selectedMunicipalityId}
              emptyLabel="Selecciona una localidad"
              searchPlaceholder="Buscar localidad…"
              required
            />
            <label className={styles.fieldWide}><span>Nombre del Lugar</span><input name="name" placeholder="Parroquia de San Benito Abad" required /></label>
            <label><span>Tipo de lugar</span><input name="place_type" placeholder="Parroquia" /></label>
            <label><span>Dirección</span><input name="address" placeholder="Opcional" /></label>
            <label className={styles.fieldWide}><span>Horario habitual</span><textarea name="opening_hours_text" rows="3" placeholder="Texto documentado del horario habitual" /></label>
            <label><span>Horario comprobado</span><input name="opening_hours_verified_at" type="date" /></label>
          </div>
          <div className={styles.formActions}>
            <small>Se evita duplicar por nombre + localidad. El horario pertenece al Lugar.</small>
            <button className={styles.secondaryButton} type="submit">Buscar o crear Lugar</button>
          </div>
        </form>
      </details>

      {selectedPlace ? (
        <details className={styles.addDetails}>
          <summary>Editar datos de la Sede seleccionada <span>＋</span></summary>
          <form action={updatePlaceAction} className={`${styles.editorItem} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
            <input type="hidden" name="place_id" value={selectedPlace.id} />
            <div className={styles.formGrid}>
              <SearchableSelect name="municipality_id" label="Localidad" options={municipalitiesForSelect} defaultValue={selectedPlace.municipality_id || ''} required emptyLabel="Selecciona una localidad" />
              <label className={styles.fieldWide}><span>Nombre</span><input name="name" defaultValue={selectedPlace.name} required /></label>
              <label><span>Tipo de lugar</span><input name="place_type" defaultValue={selectedPlace.place_type || ''} /></label>
              <label><span>Dirección</span><input name="address" defaultValue={selectedPlace.address || ''} /></label>
              <label className={styles.fieldWide}><span>Horario habitual</span><textarea name="opening_hours_text" rows="3" defaultValue={selectedPlace.opening_hours_text || ''} /></label>
              <label><span>Horario comprobado</span><input name="opening_hours_verified_at" type="date" defaultValue={selectedPlace.opening_hours_verified_at || ''} /></label>
            </div>
            <div className={styles.formActions}>
              <small>El Lugar es compartido: estos datos podrán reutilizarse desde otras entidades.</small>
              <button className={styles.secondaryButton} type="submit">Guardar Lugar</button>
            </div>
          </form>
        </details>
      ) : null}
    </div>
  )
}
