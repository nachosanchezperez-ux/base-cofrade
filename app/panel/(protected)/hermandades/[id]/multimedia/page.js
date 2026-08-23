import Link from 'next/link'
import { notFound } from 'next/navigation'
import { uploadBrotherhoodRelatedMediaAction } from './actions'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodMediaWorkspaceData } from '@/lib/panel/brotherhood-media'
import styles from '@/app/panel/panel.module.css'
import mediaStyles from './media.module.css'

const SAVED_MESSAGES = {
  uploaded: 'La imagen se ha subido y ya queda vinculada a su ficha.',
}

function RightsSelect() {
  return (
    <select name="rights_status" defaultValue="authorized">
      <option value="authorized">Autorizada por la Hermandad o el autor</option>
      <option value="owned">Propiedad de Hilo Cofrade</option>
      <option value="licensed">Publicación con licencia</option>
      <option value="public_domain">Dominio público</option>
    </select>
  )
}

function targetAlt(target, kind) {
  if (kind === 'step') return `Fotografía de ${target.name}`
  if (kind === 'image') return `Fotografía de ${target.name}`
  return target.public_image_alt || target.name
}

function targetLabel(kind, hasImage) {
  if (kind === 'step') return hasImage ? 'Subir otra como principal' : 'Subir fotografía del Paso'
  if (kind === 'image') return hasImage ? 'Subir otra como principal' : 'Subir fotografía del Titular'
  return hasImage ? 'Subir otra imagen principal' : 'Subir imagen del cartel o pieza'
}

function MediaTargetCard({ target, kind, brotherhoodId }) {
  const currentPath = target.cover?.publicUrl || target.public_image_path || ''
  const currentAlt = target.cover?.asset?.alt_text || target.public_image_alt || target.name
  const hasCanonicalImage = Boolean(target.cover?.publicUrl)
  const hasLegacyImage = !hasCanonicalImage && Boolean(target.public_image_path)
  const anchor = `contenido-${target.id}`

  return (
    <article className={mediaStyles.targetCard} id={anchor}>
      <div className={mediaStyles.targetSummary}>
        <div className={mediaStyles.preview}>
          {currentPath ? <img src={currentPath} alt={currentAlt} /> : <span aria-hidden="true">＋</span>}
        </div>
        <div className={mediaStyles.targetCopy}>
          <div className={mediaStyles.targetMeta}>
            <span>{kind === 'step' ? 'Paso' : kind === 'image' ? 'Titular' : target.asset_type || 'Patrimonio'}</span>
            {target.year ? <b>{target.year}</b> : null}
          </div>
          <h3>{target.name}</h3>
          <p>
            {hasCanonicalImage
              ? `${target.media.length} imagen${target.media.length === 1 ? '' : 'es'} vinculada${target.media.length === 1 ? '' : 's'} · principal definida`
              : hasLegacyImage
                ? 'Hay una imagen antigua. Súbela aquí para gestionarla ya desde el Panel.'
                : 'Todavía no tiene una fotografía vinculada.'}
          </p>
        </div>
      </div>

      <details className={mediaStyles.uploadDetails} open={!currentPath}>
        <summary>{targetLabel(kind, Boolean(currentPath))}<span aria-hidden="true">⌄</span></summary>
        <form action={uploadBrotherhoodRelatedMediaAction} className={mediaStyles.uploadForm}>
          <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
          <input type="hidden" name="entity_id" value={target.id} />
          <input type="hidden" name="title" value={target.name} />

          <label className={mediaStyles.fileField}>
            <span>Fotografía</span>
            <input name="file" type="file" accept="image/*" required />
            <small>En el móvil podrás elegir Fototeca, Cámara o Archivos. JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.</small>
          </label>

          <div className={mediaStyles.formGrid}>
            <label>
              <span>Crédito / autor</span>
              <input
                name="author_name"
                defaultValue={target.cover?.asset?.author_name || target.public_image_credit || ''}
                placeholder="Fotografía · Autor / Hermandad"
              />
            </label>
            <label>
              <span>Derechos</span>
              <RightsSelect />
            </label>
          </div>

          <label>
            <span>Descripción accesible</span>
            <input name="alt_text" defaultValue={targetAlt(target, kind)} required />
          </label>

          <label>
            <span>Pie opcional</span>
            <textarea name="caption" rows="2" placeholder="Información que ayude a contextualizar la imagen." />
          </label>

          <div className={mediaStyles.uploadActions}>
            <small>Se guardará como imagen principal de esta ficha. La fotografía anterior seguirá disponible en el archivo.</small>
            <button className={styles.primaryButton} type="submit">Subir y vincular</button>
          </div>
        </form>
      </details>
    </article>
  )
}

function TargetSection({ id, eyebrow, title, description, items, kind, brotherhoodId, empty }) {
  return (
    <section className={styles.editorSection} id={id}>
      <div className={styles.sectionHeading}>
        <div><span className={styles.eyebrow}>{eyebrow}</span><h2>{title}</h2></div>
        <p>{description}</p>
      </div>
      {items.length ? (
        <div className={mediaStyles.targetList}>
          {items.map((item) => <MediaTargetCard key={item.id} target={item} kind={kind} brotherhoodId={brotherhoodId} />)}
        </div>
      ) : <div className={mediaStyles.emptyState}>{empty}</div>}
    </section>
  )
}

export const metadata = { title: 'Fotos y carteles · Hermandad · Panel' }

export default async function BrotherhoodMultimediaPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodMediaWorkspaceData(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const brotherhoodName = data.brotherhood.popular_name || data.entity.name
  const posters = data.heritage.filter((item) => item.isPoster)
  const otherHeritage = data.heritage.filter((item) => !item.isPoster)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{brotherhoodName}</Link><span>→</span>
          <strong>Fotos y carteles</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Subida rápida</span>
            <h1>Fotos y carteles</h1>
            <p>Elige primero qué elemento quieres ilustrar. El Panel se encarga de vincular la imagen a la ficha correcta.</p>
          </div>
          <Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Abrir biblioteca completa</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta. Un editor debe subir las fotografías.</div> : null}

      {canEdit ? (
        <>
          <section className={mediaStyles.quickStart} aria-label="Elegir tipo de contenido">
            <div>
              <span className={styles.eyebrow}>¿Qué quieres subir?</span>
              <h2>Ve directamente al contenido</h2>
              <p>No necesitas buscar la entidad ni escribir el tipo de relación.</p>
            </div>
            <nav>
              <a href="#pasos"><strong>Fotografía de un Paso</strong><span>{data.steps.length} relacionado{data.steps.length === 1 ? '' : 's'} →</span></a>
              <a href="#carteles"><strong>Cartel</strong><span>{posters.length} documentado{posters.length === 1 ? '' : 's'} →</span></a>
              {data.images.length ? <a href="#titulares"><strong>Fotografía de un Titular</strong><span>{data.images.length} relacionado{data.images.length === 1 ? '' : 's'} →</span></a> : null}
              {otherHeritage.length ? <a href="#patrimonio-visual"><strong>Otra pieza patrimonial</strong><span>{otherHeritage.length} documentada{otherHeritage.length === 1 ? '' : 's'} →</span></a> : null}
            </nav>
          </section>

          <TargetSection
            id="pasos"
            eyebrow="Cortejo"
            title="Fotografías de los Pasos"
            description="Cada fotografía queda vinculada directamente al Paso, no a la Hermandad de forma genérica."
            items={data.steps}
            kind="step"
            brotherhoodId={id}
            empty="Esta Hermandad no tiene todavía ningún Paso relacionado."
          />

          <TargetSection
            id="carteles"
            eyebrow="Archivo gráfico"
            title="Carteles"
            description="Selecciona el año o la pieza concreta. El cartel se mostrará completo dentro de su ficha patrimonial."
            items={posters}
            kind="heritage"
            brotherhoodId={id}
            empty="No hay carteles documentados como piezas patrimoniales."
          />

          {data.images.length ? (
            <TargetSection
              id="titulares"
              eyebrow="Imágenes"
              title="Fotografías de los Titulares"
              description="La fotografía se incorpora a la ficha propia de cada Imagen."
              items={data.images}
              kind="image"
              brotherhoodId={id}
              empty=""
            />
          ) : null}

          {otherHeritage.length ? (
            <TargetSection
              id="patrimonio-visual"
              eyebrow="Patrimonio"
              title="Otras piezas patrimoniales"
              description="Simpecados, carretas, insignias, retablos y otras piezas con ficha propia."
              items={otherHeritage}
              kind="heritage"
              brotherhoodId={id}
              empty=""
            />
          ) : null}
        </>
      ) : null}
    </div>
  )
}
