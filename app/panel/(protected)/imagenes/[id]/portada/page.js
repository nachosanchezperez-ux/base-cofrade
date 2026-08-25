import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMediaData } from '@/lib/panel/media'
import ImageHeroFramingForm from './ImageHeroFramingForm'
import {
  removeImageHeroAction,
  selectImageHeroAction,
  updateImageHeroFramingAction,
} from './actions'
import styles from './cover.module.css'
import panelStyles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Portada de la ficha · Imagen · Panel' }

const PUBLICATION_RIGHTS = new Set(['owned', 'authorized', 'licensed', 'public_domain'])
const SAVED_MESSAGES = {
  selected: 'La fotografía queda seleccionada como portada de la ficha.',
  framing: 'El encuadre de la portada se ha guardado correctamente.',
  removed: 'La portada específica se ha retirado. La ficha vuelve a usar el retrato principal como respaldo.',
}

function preferredCandidate(current, next) {
  if (!current) return next
  if (next.relation_type === 'hero') return next
  if (next.is_cover && !current.is_cover) return next
  if (next.relation_type === 'portrait' && current.relation_type === 'gallery') return next
  return current
}

function buildCandidates(links) {
  const byAsset = new Map()

  links
    .filter((item) => item.asset?.media_type === 'image')
    .filter((item) => PUBLICATION_RIGHTS.has(item.asset?.rights_status))
    .filter((item) => Boolean(item.publicUrl))
    .forEach((item) => {
      byAsset.set(item.media_asset_id, preferredCandidate(byAsset.get(item.media_asset_id), item))
    })

  return [...byAsset.values()].sort((a, b) => {
    if (a.relation_type === 'hero') return -1
    if (b.relation_type === 'hero') return 1
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1
    return (a.sort_order || 0) - (b.sort_order || 0)
  })
}

function roleLabel(item) {
  if (item.relation_type === 'hero') return 'Portada de la ficha'
  if (item.is_cover || item.relation_type === 'portrait') return 'Retrato principal'
  if (item.relation_type === 'gallery') return 'Galería'
  return item.relation_type || 'Recurso vinculado'
}

function StaticPreview({ item, fallback = false }) {
  if (!item) {
    return (
      <div className={styles.emptyHero}>
        <span>Portada pendiente</span>
        <strong>Selecciona una fotografía vinculada a esta Imagen.</strong>
      </div>
    )
  }

  const focusX = Number(item.focus_x ?? 50)
  const focusY = Number(item.focus_y ?? 50)
  const fit = item.fit_mode === 'contain' ? 'contain' : 'cover'

  return (
    <figure className={`${styles.currentPreview} ${fallback ? styles.fallbackPreview : ''}`}>
      <span className={styles.currentBackdrop} style={{ backgroundImage: `url("${String(item.publicUrl).replaceAll('"', '%22')}")` }} aria-hidden="true" />
      <img
        src={item.publicUrl}
        alt={item.asset.alt_text || item.asset.title || ''}
        style={{ objectFit: fit, objectPosition: `${focusX}% ${focusY}%` }}
      />
      <span className={styles.currentShade} aria-hidden="true" />
      <figcaption>
        <small>{fallback ? 'Respaldo temporal' : 'Portada publicada'}</small>
        <strong>{item.asset.title || item.entity.name}</strong>
        {item.asset.author_name ? <span>Fotografía · {item.asset.author_name}</span> : null}
      </figcaption>
    </figure>
  )
}

export default async function ImageCoverPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getPanelMediaData({ entityId: id })
  const entity = data.entities.find((item) => item.id === id && item.entity_type === 'image')
  if (!entity) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const links = data.links.filter((item) => item.entity_id === id)
  const hero = links.find((item) => item.relation_type === 'hero') || null
  const portrait = links.find((item) => item.is_cover) || links.find((item) => item.relation_type === 'portrait') || null
  const currentDisplay = hero || portrait
  const candidates = buildCandidates(links)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={panelStyles.pageWrap}>
      <header className={panelStyles.editorHeader}>
        <div className={panelStyles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link><span>→</span><Link href={`/panel/imagenes/${id}`}>{entity.name}</Link><span>→</span><strong>Portada</strong>
        </div>
        <div className={panelStyles.editorTitleRow}>
          <div>
            <span className={panelStyles.eyebrow}>Presentación pública</span>
            <h1>Portada de la ficha</h1>
            <p>Fotografía ambiental de la cabecera, independiente del retrato del directorio y de la galería.</p>
          </div>
          <div className={panelStyles.editorHeaderActions}>
            {entity.status === 'published' && entity.slug ? <Link className={panelStyles.secondaryButton} href={`/imagenes/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {savedMessage ? <div className={panelStyles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={panelStyles.readOnlyNotice}>Tu perfil puede revisar la portada, pero un editor debe modificarla.</div> : null}

      <section className={panelStyles.editorSection}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Cabecera</span><h2>{hero ? 'Portada seleccionada' : 'Portada pendiente de seleccionar'}</h2></div>
          <p>{hero ? 'Esta relación solo gobierna la cabecera de la ficha.' : portrait ? 'La ficha usa provisionalmente el retrato principal hasta que elijas una portada propia.' : 'Todavía no hay ninguna fotografía publicable vinculada.'}</p>
        </div>

        {hero ? (
          <ImageHeroFramingForm imageId={id} item={hero} action={updateImageHeroFramingAction} />
        ) : (
          <div className={`${panelStyles.panelCard} ${styles.fallbackCard}`}>
            <StaticPreview item={currentDisplay} fallback={Boolean(portrait)} />
            <div className={styles.fallbackCopy}>
              <span className={panelStyles.eyebrow}>Comportamiento de respaldo</span>
              <h3>{portrait ? 'El retrato evita una cabecera vacía' : 'La ficha necesita una fotografía'}</h3>
              <p>{portrait
                ? 'Este recurso seguirá sirviendo al directorio y a las tarjetas. Seleccionarlo como portada creará un uso independiente, con encuadre propio y sin duplicar el archivo.'
                : 'Añade una fotografía desde Multimedia y después vuelve aquí para convertirla en portada de la ficha.'}</p>
            </div>
          </div>
        )}

        {hero && canEdit ? (
          <form action={removeImageHeroAction} className={styles.removeForm}>
            <input type="hidden" name="image_id" value={id} />
            <input type="hidden" name="hero_link_id" value={hero.id} />
            <span>Al retirarla, el recurso no se borra: vuelve a la galería y la ficha recupera el retrato principal como respaldo.</span>
            <button type="submit">Retirar portada específica</button>
          </form>
        ) : null}
      </section>

      <section className={panelStyles.editorSection}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Archivo de la Imagen</span><h2>Elegir fotografía</h2></div>
          <div className={styles.headingActions}>
            <span>{candidates.length} recurso{candidates.length === 1 ? '' : 's'} disponible{candidates.length === 1 ? '' : 's'}</span>
            <Link className={panelStyles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Añadir o gestionar fotografías →</Link>
          </div>
        </div>

        {candidates.length ? (
          <div className={styles.candidateGrid}>
            {candidates.map((item) => {
              const selected = hero?.media_asset_id === item.media_asset_id
              return (
                <article className={`${styles.candidateCard} ${selected ? styles.selectedCandidate : ''}`} key={item.media_asset_id}>
                  <div className={styles.candidateImage}>
                    <img src={item.publicUrl} alt={item.asset.alt_text || item.asset.title || ''} />
                    <span>{roleLabel(item)}</span>
                  </div>
                  <div className={styles.candidateCopy}>
                    <h3>{item.asset.title || entity.name}</h3>
                    <p>{item.asset.author_name ? `Fotografía · ${item.asset.author_name}` : 'Autor pendiente de documentar'}</p>
                    <small>{item.asset.rights_status === 'owned' ? 'Fotografía propia' : item.asset.rights_status === 'authorized' ? 'Publicación autorizada' : item.asset.license || 'Derechos documentados'}</small>
                  </div>
                  {canEdit ? (
                    <form action={selectImageHeroAction}>
                      <input type="hidden" name="image_id" value={id} />
                      <input type="hidden" name="source_link_id" value={item.id} />
                      <button className={selected ? styles.currentButton : panelStyles.primaryButton} type="submit" disabled={selected}>
                        {selected ? 'Portada actual' : 'Usar como portada'}
                      </button>
                    </form>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : (
          <div className={panelStyles.emptyPanel}>
            No hay fotografías publicables vinculadas. Añade una desde Multimedia y vuelve a este apartado.
          </div>
        )}
      </section>

      <section className={`${panelStyles.editorSection} ${styles.rolesSection}`}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Usos independientes</span><h2>Una fotografía, distintos encuadres</h2></div>
          <p>El archivo se almacena una sola vez; cada relación conserva su propia presentación.</p>
        </div>
        <div className={styles.roleGrid}>
          <article><strong>Portada de la ficha</strong><p>Cabecera amplia y ambiental. Puede tener un foco específico para ordenador y móvil.</p></article>
          <article><strong>Retrato principal</strong><p>Directorio, buscador, tarjetas y nodos relacionales. Prioriza el reconocimiento inmediato.</p></article>
          <article><strong>Galería</strong><p>Detalles, cultos, vestimentas, salidas y fotografías históricas complementarias.</p></article>
        </div>
      </section>
    </div>
  )
}
