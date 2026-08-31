import Link from 'next/link'
import { notFound } from 'next/navigation'
import QuickMediaUploadForm from './QuickMediaUploadForm'
import MediaAssetManager from './MediaAssetManager'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodMediaWorkspaceData } from '@/lib/panel/brotherhood-media'
import styles from '@/app/panel/panel.module.css'
import mediaStyles from './media.module.css'

const SAVED_MESSAGES = {
  uploaded: 'La imagen se ha subido y ya queda vinculada a su ficha.',
  updated: 'La información del archivo se ha actualizado correctamente.',
  cover: 'La fotografía principal se ha actualizado correctamente.',
  deleted: 'El archivo se ha eliminado de este contenido y ya no tenía otros usos.',
  unlinked: 'El archivo se ha retirado de este contenido y se conserva porque está utilizado en otro lugar.',
}

function targetAlt(target, kind) {
  if (kind === 'step') return `Fotografía de ${target.name}`
  if (kind === 'image') return `Fotografía de ${target.name}`
  if (kind === 'cult') return `Fotografía del culto ${target.name}`
  return target.public_image_alt || target.name
}

function targetLabel(kind, { hasCanonicalImage, hasLegacyImage }) {
  if (hasLegacyImage) return 'Migrar esta imagen al Panel'
  if (kind === 'step') return hasCanonicalImage ? 'Subir otra como principal' : 'Subir fotografía del Paso'
  if (kind === 'image') return hasCanonicalImage ? 'Subir otra como principal' : 'Subir fotografía del Titular'
  if (kind === 'cult') return hasCanonicalImage ? 'Cambiar la foto de portada' : 'Subir foto de portada del Culto'
  return hasCanonicalImage ? 'Subir otra imagen principal' : 'Subir imagen del cartel o pieza'
}

function kindLabel(kind, target) {
  if (kind === 'step') return 'Paso'
  if (kind === 'image') return 'Titular'
  if (kind === 'cult') return target.asset_type || 'Culto'
  return target.asset_type || 'Patrimonio'
}

function MediaTargetCard({ target, kind, brotherhoodId }) {
  const currentPath = target.cover?.publicUrl || target.public_image_path || ''
  const currentAlt = target.cover?.asset?.alt_text || target.public_image_alt || target.name
  const hasCanonicalImage = Boolean(target.cover?.publicUrl)
  const hasLegacyImage = kind !== 'cult' && !hasCanonicalImage && Boolean(target.public_image_path)
  const anchor = `contenido-${target.id}`
  const targetKind = kind === 'cult' ? 'cult' : 'entity'
  const rightsHelp = 'Para Wikimedia, licencias abiertas o dominio público utiliza la Biblioteca multimedia, que exige Fuente, licencia y atribución completas.'
  const uploadNote = kind === 'cult'
    ? 'Se mostrará como portada de este culto en la ficha pública.'
    : 'Se guardará como imagen principal de esta ficha. La fotografía anterior seguirá disponible justo aquí para editarla, recuperarla o eliminarla.'

  return (
    <article className={mediaStyles.targetCard} id={anchor}>
      <div className={mediaStyles.targetSummary}>
        <div className={mediaStyles.preview}>
          {currentPath ? <img src={currentPath} alt={currentAlt} /> : <span aria-hidden="true">＋</span>}
        </div>
        <div className={mediaStyles.targetCopy}>
          <div className={mediaStyles.targetMeta}>
            <span>{kindLabel(kind, target)}</span>
            {target.year ? <b>{target.year}</b> : target.dateLabel ? <b>{target.dateLabel}</b> : null}
          </div>
          <h3>{target.name}</h3>
          <p>
            {hasCanonicalImage
              ? `${target.media.length} imagen${target.media.length === 1 ? '' : 'es'} vinculada${target.media.length === 1 ? '' : 's'} · principal definida`
              : hasLegacyImage
                ? 'Hay una imagen antigua. Súbela aquí para gestionarla ya desde el Panel.'
                : kind === 'cult'
                  ? 'Todavía no tiene una fotografía de portada para su tarjeta pública.'
                  : 'Todavía no tiene una fotografía vinculada.'}
          </p>
        </div>
      </div>

      <MediaAssetManager
        media={target.media}
        brotherhoodId={brotherhoodId}
        targetId={target.id}
        targetKind={targetKind}
      />

      <details className={mediaStyles.uploadDetails} open={!hasCanonicalImage}>
        <summary>{targetLabel(kind, { hasCanonicalImage, hasLegacyImage })}<span aria-hidden="true">⌄</span></summary>
        <QuickMediaUploadForm
          brotherhoodId={brotherhoodId}
          targetId={target.id}
          targetKind={targetKind}
          title={target.name}
          defaultAuthor={target.cover?.asset?.author_name || target.public_image_credit || ''}
          defaultAlt={targetAlt(target, kind)}
          rightsHelp={rightsHelp}
          uploadNote={uploadNote}
        />
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
            <span className={styles.eyebrow}>Archivo visual de la Hermandad</span>
            <h1>Fotos y carteles</h1>
            <p>Sube, revisa y gestiona las imágenes desde el mismo contenido al que pertenecen.</p>
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
              <span className={styles.eyebrow}>¿Qué quieres gestionar?</span>
              <h2>Ve directamente al contenido</h2>
              <p>Cada elemento muestra ahora las fotografías que ya tiene vinculadas y sus opciones de edición.</p>
            </div>
            <nav>
              {data.cults.length ? <a href="#cultos-visuales"><strong>Fotos de Cultos</strong><span>{data.cults.length} documentado{data.cults.length === 1 ? '' : 's'} →</span></a> : null}
              <a href="#pasos"><strong>Fotografías de Pasos</strong><span>{data.steps.length} relacionado{data.steps.length === 1 ? '' : 's'} →</span></a>
              <a href="#carteles"><strong>Carteles</strong><span>{posters.length} documentado{posters.length === 1 ? '' : 's'} →</span></a>
              {data.images.length ? <a href="#titulares"><strong>Fotografías de Titulares</strong><span>{data.images.length} relacionado{data.images.length === 1 ? '' : 's'} →</span></a> : null}
              {otherHeritage.length ? <a href="#patrimonio-visual"><strong>Otra pieza patrimonial</strong><span>{otherHeritage.length} documentada{otherHeritage.length === 1 ? '' : 's'} →</span></a> : null}
            </nav>
          </section>

          <TargetSection
            id="cultos-visuales"
            eyebrow="Cultos principales"
            title="Fotos de portada para los Cultos"
            description="Cada Culto muestra sus fotografías vinculadas para poder editar sus datos, cambiar la principal o retirar un archivo."
            items={data.cults}
            kind="cult"
            brotherhoodId={id}
            empty="Esta Hermandad no tiene todavía cultos documentados."
          />

          <TargetSection
            id="pasos"
            eyebrow="Cortejo"
            title="Fotografías de los Pasos"
            description="Cada fotografía queda vinculada directamente al Paso y puede gestionarse desde esta misma pantalla."
            items={data.steps}
            kind="step"
            brotherhoodId={id}
            empty="Esta Hermandad no tiene todavía ningún Paso relacionado."
          />

          <TargetSection
            id="carteles"
            eyebrow="Archivo gráfico"
            title="Carteles"
            description="Selecciona el año o la pieza concreta. El marco público respeta la proporción real de cada cartel."
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
              description="La fotografía se incorpora a la ficha propia de cada Imagen y permanece gestionable desde la Hermandad."
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
