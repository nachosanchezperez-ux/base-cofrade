import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { SaveBar, SOCIAL_PLATFORMS } from '@/components/panel/band/BandEditorPrimitives'
import { saveBandSocialLinkAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Canales · Banda · Panel' }

function SocialLinkForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return (
    <form action={saveBandSocialLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}>
      <input type="hidden" name="band_id" value={bandId} />
      <input type="hidden" name="link_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label><span>Plataforma</span><select name="platform" defaultValue={item?.platform || 'website'} disabled={!isNew}>{SOCIAL_PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{!isNew ? <input type="hidden" name="platform" value={item.platform} /> : null}</label>
        <label><span>Nombre visible</span><input name="label" defaultValue={item?.label || ''} placeholder="Spotify oficial" /></label>
        <label className={styles.fieldWide}><span>URL oficial</span><input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://…" required /></label>
        <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
        <label className={styles.checkField}><input name="is_public" type="checkbox" defaultChecked={item?.is_public ?? true} /><span>Mostrar públicamente</span></label>
      </div>
      <SaveBar label={isNew ? 'Añadir enlace' : 'Guardar enlace'} canEdit={canEdit} />
    </form>
  )
}

export default async function BandChannelsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Canales</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Presencia oficial</span><h1>Web, redes y plataformas</h1><p>Canales oficiales, Spotify y orden de aparición pública.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Canales actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Canales oficiales</span><h2>Enlaces de interés</h2></div><p>{data.socialLinks.length} canal{data.socialLinks.length === 1 ? '' : 'es'} registrado{data.socialLinks.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{data.socialLinks.map((item) => <SocialLinkForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <SocialLinkForm bandId={data.entity.id} canEdit /> : null}</div>
      </section>
    </div>
  )
}
