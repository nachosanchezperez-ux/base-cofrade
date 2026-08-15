import Link from 'next/link'
import { notFound } from 'next/navigation'
import SearchableSelect from '@/components/panel/SearchableSelect'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodPresenceData } from '@/lib/panel/brotherhood-presence'
import {
  createMunicipalityAction,
  createPlaceAction,
  savePresenceSocialLinkAction,
  updateBrotherhoodPresenceAction,
  updatePlaceAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const SOCIAL_PLATFORMS = [
  ['website', 'Web oficial'],
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['x', 'X / Twitter'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['whatsapp', 'WhatsApp'],
]
const PLATFORM_LABELS = Object.fromEntries(SOCIAL_PLATFORMS)

export const metadata = { title: 'Identidad y presencia · Panel' }

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

function SocialLinkForm({ item, brotherhoodId, canEdit }) {
  const isNew = !item?.id
  return (
    <form action={savePresenceSocialLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}>
      <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
      <input type="hidden" name="link_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label>
          <span>Plataforma</span>
          <select name="platform" defaultValue={item?.platform || ''} disabled={!isNew} required>
            <option value="">Selecciona una plataforma</option>
            {SOCIAL_PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {!isNew ? <input type="hidden" name="platform" value={item.platform} /> : null}
        </label>
        <label><span>Nombre visible</span><input name="label" defaultValue={item?.label || ''} placeholder="Ej. Instagram oficial" /></label>
        <label className={styles.fieldWide}><span>URL oficial</span><input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://…" required /></label>
        <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
        <label className={styles.checkField}><input name="is_public" type="checkbox" defaultChecked={item?.is_public ?? true} /><span>Mostrar públicamente</span></label>
      </div>
      {canEdit ? (
        <div className={styles.formActions}>
          <small>{isNew ? 'Elige primero la plataforma; Web no está preseleccionada.' : `Editando ${PLATFORM_LABELS[item.platform] || item.platform}.`}</small>
          <button className={isNew ? styles.primaryButton : styles.secondaryButton} type="submit">{isNew ? 'Añadir enlace' : 'Guardar enlace'}</button>
        </div>
      ) : null}
    </form>
  )
}

export default async function BrotherhoodIdentityPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodPresenceData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  const requestedMunicipality = data.municipalities.some((item) => item.id === query?.municipality)
    ? query.municipality
    : null
  const requestedPlace = data.places.some((item) => item.id === query?.place)
    ? query.place
    : null
  const selectedPlaceId = requestedPlace || data.brotherhood.canonical_see_place_id || ''
  const selectedPlace = data.places.find((item) => item.id === selectedPlaceId) || null
  const selectedMunicipalityId = requestedMunicipality
    || selectedPlace?.municipality_id
    || data.brotherhood.municipality_id
    || ''
  const municipalities = municipalityOptions(data.municipalities)
  const places = placeOptions(data.places)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${data.entity.id}`}>{data.entity.name}</Link><span>→</span>
          <strong>Identidad y presencia</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Identidad, geografía y presencia oficial</span>
            <h1>{data.brotherhood.popular_name || data.entity.name}</h1>
            <p>Localidad, Sede canónica y canales oficiales, reutilizando los registros comunes de Hilo Cofrade.</p>
          </div>
          <div className={styles.editorHeaderActions}>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${data.entity.id}`}>Volver a ficha general</Link>
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {query?.reused === 'municipality' ? <div className={styles.savedNotice} role="status">La Localidad ya existía: se ha reutilizado y queda seleccionada.</div> : null}
      {query?.reused === 'place' ? <div className={styles.savedNotice} role="status">El Lugar ya existía en esa localidad: se ha reutilizado y queda seleccionado.</div> : null}
      {query?.duplicate ? <div className={styles.readOnlyNotice} role="status">Ya existe un enlace de {PLATFORM_LABELS[query.duplicate] || query.duplicate}. Edita el existente en lugar de crear un duplicado.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection} id="geografia">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Buscar → reutilizar</span><h2>Localidad y Sede canónica</h2></div>
          <p>Selecciona registros existentes. Si no existen, créalos en los bloques siguientes y volverán seleccionados.</p>
        </div>
        <form action={updateBrotherhoodPresenceAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <SearchableSelect
              name="municipality_id"
              label="Localidad"
              options={municipalities}
              defaultValue={selectedMunicipalityId}
              emptyLabel="Sin localidad"
              searchPlaceholder="Buscar localidad existente…"
            />
            <SearchableSelect
              name="canonical_see_place_id"
              label="Sede canónica / Lugar"
              options={places}
              defaultValue={selectedPlaceId}
              emptyLabel="Sin Sede canónica"
              searchPlaceholder="Buscar Lugar por nombre, localidad o dirección…"
            />
          </div>
          {canEdit ? <div className={styles.formActions}><small>La Sede canónica debe pertenecer a la misma localidad.</small><button className={styles.primaryButton} type="submit">Guardar localidad y sede</button></div> : null}
        </form>
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Crear solo si falta</span><h2>Nueva Localidad</h2></div>
            <p>Antes de insertar se comprueba nombre, provincia, comunidad autónoma y país para evitar duplicados evidentes.</p>
          </div>
          <form action={createMunicipalityAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <label><span>Nombre</span><input name="name" placeholder="Sevilla" required /></label>
              <label><span>Provincia</span><input name="province" defaultValue="Sevilla" required /></label>
              <label><span>Comunidad autónoma</span><input name="autonomous_community" defaultValue="Andalucía" required /></label>
              <label><span>País</span><input name="country" defaultValue="España" required /></label>
            </div>
            <div className={styles.formActions}><small>El slug se genera siguiendo el patrón actual y se comprueba que sea único.</small><button className={styles.primaryButton} type="submit">Buscar o crear Localidad</button></div>
          </form>
        </section>
      ) : null}

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Crear solo si falta</span><h2>Nuevo Lugar</h2></div>
            <p>Se comprueba nombre + localidad antes de crear. El horario se almacena en el Lugar, no en la Hermandad.</p>
          </div>
          <form action={createPlaceAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <SearchableSelect
                className={styles.fieldWide}
                name="municipality_id"
                label="Localidad del Lugar"
                options={municipalities}
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
            <div className={styles.formActions}><small>Sin geocodificación ni horarios estructurados en esta fase.</small><button className={styles.primaryButton} type="submit">Buscar o crear Lugar</button></div>
          </form>
        </section>
      ) : null}

      {selectedPlace ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Dato compartido</span><h2>Editar Lugar seleccionado</h2></div>
            <p>Los cambios afectan al Lugar común y pueden beneficiar a otras entidades que lo reutilicen.</p>
          </div>
          <form action={updatePlaceAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <input type="hidden" name="place_id" value={selectedPlace.id} />
            <div className={styles.formGrid}>
              <SearchableSelect name="municipality_id" label="Localidad" options={municipalities} defaultValue={selectedPlace.municipality_id || ''} required emptyLabel="Selecciona una localidad" />
              <label className={styles.fieldWide}><span>Nombre</span><input name="name" defaultValue={selectedPlace.name} required /></label>
              <label><span>Tipo de lugar</span><input name="place_type" defaultValue={selectedPlace.place_type || ''} /></label>
              <label><span>Dirección</span><input name="address" defaultValue={selectedPlace.address || ''} /></label>
              <label className={styles.fieldWide}><span>Horario habitual</span><textarea name="opening_hours_text" rows="3" defaultValue={selectedPlace.opening_hours_text || ''} /></label>
              <label><span>Horario comprobado</span><input name="opening_hours_verified_at" type="date" defaultValue={selectedPlace.opening_hours_verified_at || ''} /></label>
            </div>
            {canEdit ? <div className={styles.formActions}><small>El horario sigue siendo texto libre con fecha de verificación.</small><button className={styles.primaryButton} type="submit">Guardar Lugar</button></div> : null}
          </form>
        </section>
      ) : null}

      <section className={styles.editorSection} id="redes">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Canales oficiales</span><h2>Web y redes sociales</h2></div>
          <p>Selecciona plataforma → añade URL → define nombre visible → controla su visibilidad pública.</p>
        </div>
        <div className={styles.editorStack}>
          {data.socialLinks.map((item) => <SocialLinkForm key={item.id} item={item} brotherhoodId={data.entity.id} canEdit={canEdit} />)}
          {canEdit ? <SocialLinkForm brotherhoodId={data.entity.id} canEdit /> : null}
        </div>
      </section>
    </div>
  )
}
