import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { updateBrotherhoodPublicationAction } from '@/app/panel/(protected)/hermandades/[id]/publication-actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export default async function BrotherhoodPublicationControl({ brotherhoodId }) {
  const [user, supabase] = await Promise.all([requirePanelUser(), createClient()])
  const result = await supabase
    .from('entities')
    .select('id, name, slug, status')
    .eq('id', brotherhoodId)
    .eq('entity_type', 'brotherhood')
    .maybeSingle()

  if (result.error || !result.data) return null

  const entity = result.data
  const canEdit = ['admin', 'editor'].includes(user.role)
  const isPublished = entity.status === 'published'

  return (
    <div className={styles.pageWrap}>
      <div className={styles.panelCard}>
        <div className={styles.formActions}>
          <div>
            <span className={styles.eyebrow}>Publicación</span>
            <strong style={{ display: 'block', marginTop: 4, color: '#17324e' }}>
              {isPublished ? 'Visible en la web pública' : 'Todavía no es pública'}
            </strong>
            <small style={{ display: 'block', marginTop: 4 }}>
              {isPublished
                ? 'Puedes seguir editándola. Si necesitas retirarla temporalmente, vuelve a dejarla como borrador.'
                : 'Puedes editar y completar toda la ficha con normalidad. Solo aparecerá en Hilo Cofrade cuando decidas publicarla.'}
            </small>
          </div>

          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status] || ''}`}>{STATUS_LABELS[entity.status] || entity.status}</span>
            {isPublished && entity.slug ? (
              <Link className={styles.secondaryButton} href={`/hermandades/${entity.slug}`} target="_blank" rel="noreferrer">
                Ver ficha pública ↗
              </Link>
            ) : null}
            {canEdit ? (
              <form action={updateBrotherhoodPublicationAction}>
                <input type="hidden" name="brotherhood_id" value={entity.id} />
                <input type="hidden" name="next_status" value={isPublished ? 'draft' : 'published'} />
                <button className={isPublished ? styles.secondaryButton : styles.primaryButton} type="submit">
                  {isPublished ? 'Volver a borrador' : 'Publicar Hermandad'}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
