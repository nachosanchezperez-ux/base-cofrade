import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import styles from '@/app/panel/panel.module.css'
import {
  uploadBandBanderinAction,
  uploadBandHeroAction,
  uploadBandLogoAction,
} from './actions'

export const metadata = { title: 'Multimedia de banda · Panel' }

function MediaPreview({ src, alt }) {
  if (!src) return <div style={{ minHeight: 160, display: 'grid', placeItems: 'center', border: '1px dashed #cbd5e1', borderRadius: 18, color: '#64748b', background: '#f8fafc' }}>Sin imagen subida</div>
  return (
    <div style={{ minHeight: 180, display: 'grid', placeItems: 'center', overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 18, background: '#fff' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} style={{ display: 'block', maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }} />
    </div>
  )
}

function UploadForm({ action, bandId, assetId, title, description, currentSrc, alt, credit, canEdit, accept = 'image/jpeg,image/png,image/webp,image/gif,image/avif' }) {
  return (
    <article className={styles.panelCard} style={{ display: 'grid', gap: 18 }}>
      <div className={styles.sectionHeading} style={{ margin: 0 }}>
        <div><span className={styles.eyebrow}>Archivo visual</span><h2>{title}</h2></div>
        <p>{description}</p>
      </div>
      <MediaPreview src={currentSrc} alt={alt || title} />
      <form action={action} className={styles.editorForm} encType="multipart/form-data">
        <input type="hidden" name="band_id" value={bandId} />
        {assetId ? <input type="hidden" name="asset_entity_id" value={assetId} /> : null}
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}>
            <span>Seleccionar imagen</span>
            <input name="file" type="file" accept={accept} required disabled={!canEdit} />
            <small>JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.</small>
          </label>
          {title !== 'Logotipo' ? (
            <>
              <label className={styles.fieldWide}><span>Texto alternativo</span><input name="alt_text" defaultValue={alt || ''} placeholder="Describe brevemente lo que aparece en la imagen" disabled={!canEdit} /></label>
              <label className={styles.fieldWide}><span>Crédito</span><input name="credit" defaultValue={credit || ''} placeholder="Fotografía · Hermandad / Autor" disabled={!canEdit} /></label>
            </>
          ) : null}
        </div>
        <div className={styles.formActions}>
          <small>{canEdit ? 'La imagen se subirá al archivo público de Hilo Cofrade y quedará vinculada automáticamente.' : 'Tu perfil tiene acceso de consulta.'}</small>
          {canEdit ? <button className={styles.primaryButton} type="submit">Subir y vincular</button> : null}
        </div>
      </form>
    </article>
  )
}

export default async function BandMultimediaPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name
  const banderin = data.assets.find((item) => item.entity?.id === data.band?.banderin_entity_id) || data.assets[0] || null

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Multimedia</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Gestión de imágenes</span><h1>Multimedia</h1><p>Sube y vincula las imágenes principales de la ficha sin tener que copiar rutas manualmente.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Imagen subida y vinculada correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta sección como colaborador. Un editor debe realizar las subidas.</div> : null}

      <div className={styles.editorStack}>
        <UploadForm
          action={uploadBandLogoAction}
          bandId={id}
          title="Logotipo"
          description="Identidad gráfica de la banda. Se mostrará en directorios y cabeceras cuando corresponda."
          currentSrc={data.band?.logo_path}
          alt={`Logotipo de ${displayName}`}
          canEdit={canEdit}
        />

        <UploadForm
          action={uploadBandHeroAction}
          bandId={id}
          title="Fotografía principal"
          description="Imagen principal de la formación para la cabecera y las vistas públicas."
          currentSrc={data.band?.hero_image_path}
          alt={data.band?.hero_image_alt}
          credit={data.band?.hero_image_credit}
          canEdit={canEdit}
        />

        {banderin ? (
          <UploadForm
            action={uploadBandBanderinAction}
            bandId={id}
            assetId={banderin.entity.id}
            title="Banderín"
            description={`Fotografía de la pieza patrimonial «${banderin.entity.name}».`}
            currentSrc={banderin.public_image_path}
            alt={banderin.public_image_alt}
            credit={banderin.public_image_credit}
            canEdit={canEdit}
          />
        ) : (
          <article className={styles.panelCard}>
            <div className={styles.sectionHeading} style={{ margin: 0 }}>
              <div><span className={styles.eyebrow}>Banderín</span><h2>Primero crea la pieza patrimonial</h2></div>
              <p>Cuando el banderín esté creado en la ficha de la banda, aparecerá aquí el formulario para subir su fotografía.</p>
            </div>
            <div className={styles.formActions}><small>La pieza se crea desde la sección Banderín de la ficha.</small><Link className={styles.secondaryButton} href={`/panel/bandas/${id}#banderin`}>Ir a Banderín</Link></div>
          </article>
        )}
      </div>
    </div>
  )
}
