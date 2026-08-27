import Link from 'next/link'
import { notFound } from 'next/navigation'
import BandDirectImageUpload from '@/components/panel/band/BandDirectImageUpload'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Multimedia de banda · Panel' }

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
          <div><span className={styles.eyebrow}>Gestión de imágenes</span><h1>Multimedia</h1><p>Las imágenes se suben directamente desde tu dispositivo a Supabase Storage y después quedan vinculadas a la ficha.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Imagen subida y vinculada correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta sección como colaborador. Un editor debe realizar las subidas.</div> : null}

      <div className={styles.editorStack}>
        <article className={styles.panelCard}>
          {canEdit ? (
            <BandDirectImageUpload
              bandId={id}
              kind="logo"
              title="Logotipo"
              description="Identidad gráfica de la Banda para directorios y cabeceras."
              currentSrc={data.band?.logo_path || ''}
              currentAlt={`Logotipo de ${displayName}`}
            />
          ) : <p className={styles.emptyText}>Logotipo: {data.band?.logo_path ? 'documentado' : 'pendiente'}.</p>}
        </article>

        <article className={styles.panelCard}>
          {canEdit ? (
            <BandDirectImageUpload
              bandId={id}
              kind="hero"
              title="Fotografía principal"
              description="Imagen principal de la formación para la cabecera y las vistas públicas."
              currentSrc={data.band?.hero_image_path || ''}
              currentAlt={data.band?.hero_image_alt || ''}
              currentCredit={data.band?.hero_image_credit || ''}
            />
          ) : <p className={styles.emptyText}>Fotografía principal: {data.band?.hero_image_path ? 'documentada' : 'pendiente'}.</p>}
        </article>

        {banderin ? (
          <article className={styles.panelCard}>
            {canEdit ? (
              <BandDirectImageUpload
                bandId={id}
                assetId={banderin.entity.id}
                kind="banderin"
                title="Banderín"
                description={`Fotografía de la pieza patrimonial «${banderin.entity.name}».`}
                currentSrc={banderin.public_image_path || ''}
                currentAlt={banderin.public_image_alt || ''}
                currentCredit={banderin.public_image_credit || ''}
              />
            ) : <p className={styles.emptyText}>Banderín: {banderin.public_image_path ? 'documentado' : 'sin fotografía'}.</p>}
          </article>
        ) : (
          <article className={styles.panelCard}>
            <div className={styles.sectionHeading} style={{ margin: 0 }}>
              <div><span className={styles.eyebrow}>Banderín</span><h2>Primero crea la pieza patrimonial</h2></div>
              <p>Cuando el banderín esté creado en la ficha de la Banda, aparecerá aquí el formulario para subir su fotografía.</p>
            </div>
            <div className={styles.formActions}><small>La pieza se crea desde Patrimonio.</small><Link className={styles.secondaryButton} href={`/panel/bandas/${id}/patrimonio`}>Ir a Patrimonio</Link></div>
          </article>
        )}
      </div>
    </div>
  )
}
