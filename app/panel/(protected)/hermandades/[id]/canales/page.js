import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import { SaveBar } from '@/components/panel/brotherhood/BrotherhoodEditorPrimitives'
import { saveSocialLinkAction } from '../actions'
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

export const metadata = { title: 'Canales oficiales · Hermandad · Panel' }

function SocialLinkForm({ item, entityId, canEdit, excludedPlatforms = [] }) {
  const isNew = !item?.id
  const platforms = isNew
    ? SOCIAL_PLATFORMS.filter(([value]) => !excludedPlatforms.includes(value))
    : SOCIAL_PLATFORMS

  return (
    <form action={saveSocialLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}>
      <input type="hidden" name="brotherhood_id" value={entityId} />
      <input type="hidden" name="link_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label>
          <span>Plataforma</span>
          <select name="platform" defaultValue={item?.platform || ''} disabled={!isNew} required>
            <option value="">Selecciona una plataforma</option>
            {platforms.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          {!isNew ? <input type="hidden" name="platform" value={item.platform} /> : null}
        </label>
        <label><span>Nombre visible</span><input name="label" defaultValue={item?.label || ''} placeholder="Ej. Instagram oficial" /></label>
        <label className={styles.fieldWide}><span>URL oficial</span><input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://…" required /></label>
        <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
        <label className={styles.checkField}><input name="is_public" type="checkbox" defaultChecked={item?.is_public ?? true} /><span>Mostrar públicamente</span></label>
      </div>
      <SaveBar
        label={isNew ? 'Añadir enlace' : 'Guardar enlace'}
        canEdit={canEdit}
        note={isNew ? 'Las plataformas ya vinculadas no vuelven a ofrecerse.' : `Editando ${PLATFORM_LABELS[item.platform] || item.platform}.`}
      />
    </form>
  )
}

export default async function BrotherhoodChannelsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const usedPlatforms = data.socialLinks.map((item) => item.platform)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><Link href={`/panel/hermandades/${id}`}>{data.brotherhood?.popular_name || data.entity.name}</Link><span>→</span><strong>Canales</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Presencia oficial</span><h1>Web y redes sociales</h1><p>Canales oficiales, orden de aparición y visibilidad pública.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Canales actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Canales oficiales</span><h2>Enlaces publicados</h2></div><p>{data.socialLinks.length} canal{data.socialLinks.length === 1 ? '' : 'es'} registrado{data.socialLinks.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.socialLinks.map((item) => <SocialLinkForm key={item.id} item={item} entityId={data.entity.id} canEdit={canEdit} />)}
          {canEdit && usedPlatforms.length < SOCIAL_PLATFORMS.length ? <SocialLinkForm entityId={data.entity.id} canEdit excludedPlatforms={usedPlatforms} /> : null}
        </div>
      </section>
    </div>
  )
}
