import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodHeroWorkspace } from '@/lib/panel/brotherhood-hero'
import QuickMediaUploadForm from '../multimedia/QuickMediaUploadForm'
import BrotherhoodHeroFramingForm from './BrotherhoodHeroFramingForm'
import {
  removeBrotherhoodHeroAction,
  selectBrotherhoodHeroAction,
  updateBrotherhoodHeroFramingAction,
} from './actions'
import styles from '@/app/panel/(protected)/imagenes/[id]/portada/cover.module.css'
import panelStyles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Portada · Hermandad · Panel' }

const SAVED_MESSAGES = {
  selected: 'La fotografía queda seleccionada como portada de la Hermandad.',
  uploaded: 'La fotografía se ha subido, queda guardada en el archivo de la Hermandad y ya gobierna su cabecera.',
  framing: 'El encuadre de la portada se ha guardado correctamente.',
  removed: 'La portada específica se ha retirado. La fotografía original permanece intacta en su ficha.',
}

function roleLabel(item) {
  if (item.relation_type === 'hero') return 'Portada actual'
  if (item.sourceType === 'Titular') return 'Titular'
  if (item.sourceType === 'Paso') return 'Paso'
  if (item.sourceType === 'Culto') return 'Culto'
  if (item.sourceType === 'Cartel') return 'Cartel'
  if (item.sourceType === 'Patrimonio') return 'Patrimonio'
  return 'Hermandad'
}

function StaticPreview({ item }) {
  if (!item) {
    return (
      <div className={styles.emptyHero}>
        <span>Portada pendiente</span>
        <strong>Elige una fotografía ya documentada en la Hermandad.</strong>
      </div>
    )
  }

  return (
    <figure className={`${styles.currentPreview} ${styles.fallbackPreview}`}>
      <span className={styles.currentBackdrop} style={{ backgroundImage: `url("${String(item.publicUrl).replaceAll('"', '%22')}")` }} aria-hidden="true" />
      <img src={item.publicUrl} alt={item.asset.alt_text || item.asset.title || ''} />
      <span className={styles.currentShade} aria-hidden="true" />
      <figcaption>
        <small>Recurso disponible</small>
        <strong>{item.asset.title || item.sourceName}</strong>
        {item.asset.author_name ? <span>Fotografía · {item.asset.author_name}</span> : null}
      </figcaption>
    </figure>
  )
}

export default async function BrotherhoodCoverPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodHeroWorkspace(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const hero = data.hero
  const candidates = data.candidates
  const suggested = candidates.find((item) => item.is_cover) || candidates[0] || null
  const brotherhoodName = data.brotherhood.popular_name || data.entity.name
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={panelStyles.pageWrap}>
      <header className={panelStyles.editorHeader}>
        <div className={panelStyles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{brotherhoodName}</Link><span>→</span>
          <strong>Portada</strong>
        </div>
        <div className={panelStyles.editorTitleRow}>
          <div>
            <span className={panelStyles.eyebrow}>Presentación pública</span>
            <h1>Portada de la Hermandad</h1>
            <p>Elige la fotografía ambiental de la cabecera y ajusta su encuadre para ordenador y móvil sin alterar el escudo ni la ficha original de la imagen.</p>
          </div>
          <div className={panelStyles.editorHeaderActions}>
            {data.entity.status === 'published' && data.entity.slug ? <Link className={panelStyles.secondaryButton} href={`/hermandades/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {savedMessage ? <div className={panelStyles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={panelStyles.readOnlyNotice}>Tu perfil puede revisar la portada, pero un editor debe modificarla.</div> : null}

      <section className={panelStyles.editorSection}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Cabecera</span><h2>{hero ? 'Portada seleccionada' : 'Portada pendiente de seleccionar'}</h2></div>
          <p>{hero ? 'Este uso gobierna únicamente la fotografía ambiental de la ficha pública.' : 'Hasta que selecciones una portada propia, el Front mantiene su sistema de respaldo actual.'}</p>
        </div>

        {hero ? (
          <BrotherhoodHeroFramingForm brotherhoodId={id} item={hero} action={updateBrotherhoodHeroFramingAction} />
        ) : (
          <div className={`${panelStyles.panelCard} ${styles.fallbackCard}`}>
            <StaticPreview item={suggested} />
            <div className={styles.fallbackCopy}>
              <span className={panelStyles.eyebrow}>Sin duplicar archivos</span>
              <h3>{suggested ? 'Puedes reutilizar una fotografía ya documentada' : 'Todavía no hay fotografías disponibles'}</h3>
              <p>{suggested
                ? 'La portada crea un uso independiente del mismo archivo. El Titular, Paso, Culto o pieza patrimonial conserva su relación, crédito y derechos originales.'
                : 'Puedes subir aquí una fotografía nueva para la cabecera o añadir más recursos desde Fotos y carteles.'}</p>
            </div>
          </div>
        )}

        {hero && canEdit ? (
          <form action={removeBrotherhoodHeroAction} className={styles.removeForm}>
            <input type="hidden" name="brotherhood_id" value={id} />
            <input type="hidden" name="hero_link_id" value={hero.id} />
            <span>Al retirarla solo se elimina el uso como portada. La fotografía original no se borra ni se desvincula de su ficha.</span>
            <button type="submit">Retirar portada específica</button>
          </form>
        ) : null}
      </section>

      {canEdit ? (
        <section className={panelStyles.editorSection}>
          <div className={panelStyles.sectionHeading}>
            <div><span className={panelStyles.eyebrow}>Nueva fotografía</span><h2>Subir fotografía para la cabecera</h2></div>
            <p>La subida se incorpora al archivo de la Hermandad y queda seleccionada como portada en la misma operación.</p>
          </div>
          <div className={panelStyles.panelCard}>
            <QuickMediaUploadForm
              brotherhoodId={id}
              targetId={id}
              targetKind="entity"
              title={`Cabecera de ${brotherhoodName}`}
              defaultAlt={`Fotografía de cabecera de ${brotherhoodName}`}
              rightsHelp="Indica que la Hermandad o el autor han autorizado su publicación, o que el archivo pertenece a Hilo Cofrade."
              uploadNote="Se guardará en el archivo de la Hermandad, se seleccionará como portada y después podrás ajustar el encuadre para ordenador y móvil."
              returnSection="portada"
              selectAsHero
            />
          </div>
        </section>
      ) : null}

      <section className={panelStyles.editorSection}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Archivo de la Hermandad</span><h2>Elegir fotografía</h2></div>
          <div className={styles.headingActions}>
            <span>{candidates.length} recurso{candidates.length === 1 ? '' : 's'} disponible{candidates.length === 1 ? '' : 's'}</span>
            <Link className={panelStyles.secondaryButton} href={`/panel/hermandades/${id}/multimedia`}>Añadir o gestionar fotografías →</Link>
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
                    <h3>{item.asset.title || item.sourceName}</h3>
                    <p>{item.sourceLabel}</p>
                    <small>{item.asset.author_name ? `Fotografía · ${item.asset.author_name}` : item.asset.rights_status === 'owned' ? 'Fotografía propia' : 'Derechos documentados'}</small>
                  </div>
                  {canEdit ? (
                    <form action={selectBrotherhoodHeroAction}>
                      <input type="hidden" name="brotherhood_id" value={id} />
                      <input type="hidden" name="media_asset_id" value={item.media_asset_id} />
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
            No hay fotografías publicables en esta Hermandad. Puedes subir una nueva directamente desde el bloque anterior.
          </div>
        )}
      </section>

      <section className={`${panelStyles.editorSection} ${styles.rolesSection}`}>
        <div className={panelStyles.sectionHeading}>
          <div><span className={panelStyles.eyebrow}>Usos independientes</span><h2>Una fotografía, varias funciones</h2></div>
          <p>La portada no sustituye ni el escudo ni las fotografías propias de cada contenido.</p>
        </div>
        <div className={styles.roleGrid}>
          <article><strong>Portada</strong><p>Fotografía ambiental de la cabecera pública, con encuadre propio para PC y móvil.</p></article>
          <article><strong>Escudo</strong><p>Identidad institucional de la Hermandad. Se gestiona desde General y no cambia al editar la portada.</p></article>
          <article><strong>Fotos y carteles</strong><p>Archivo visual de Titulares, Pasos, Cultos y Patrimonio. Sus relaciones originales permanecen intactas.</p></article>
        </div>
      </section>
    </div>
  )
}
