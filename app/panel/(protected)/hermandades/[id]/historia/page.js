import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodHistoryEditorData } from '@/lib/panel/brotherhood-history'
import { saveBrotherhoodHistoryAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Historia de la Hermandad · Panel' }

export default async function BrotherhoodHistoryPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodHistoryEditorData(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const publicName = data.brotherhood.popular_name || data.entity.name
  const panelOwnsHistory = Boolean(data.authority)
  const editorValue = data.brotherhood.history_text ?? data.localFallback ?? data.brotherhood.notes ?? ''

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link>
          <span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{publicName}</Link>
          <span>→</span>
          <strong>Historia</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Memoria histórica</span>
            <h1>Historia</h1>
            <p>{data.brotherhood.official_name}</p>
          </div>
          {data.entity.status === 'published' && data.entity.slug ? (
            <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#resumen`} target="_blank" rel="noreferrer">
              Ver ficha pública ↗
            </Link>
          ) : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Historia guardada. El Panel es ya la fuente de verdad de esta sección.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la Historia como colaborador.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>{panelOwnsHistory ? 'Fuente de verdad · Panel' : 'Transición controlada'}</span>
            <h2>Relato histórico de la ficha</h2>
          </div>
          <p>
            {panelOwnsHistory
              ? 'Lo que guardes aquí se muestra en el Front, incluso si dejas el campo vacío.'
              : 'Hasta el primer guardado se conserva el texto local existente como fallback.'}
          </p>
        </div>

        <form action={saveBrotherhoodHistoryAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <label className={styles.fieldWide}>
            <span>Historia pública</span>
            <textarea name="history_text" defaultValue={editorValue} rows="14" placeholder="Historia, evolución y contexto de la Hermandad…" />
          </label>
          <div className={styles.formActions}>
            <small>
              {panelOwnsHistory
                ? 'El fallback local ya no interviene en esta sección.'
                : 'El primer guardado transferirá la autoridad editorial de Historia al Panel.'}
            </small>
            {canEdit ? <button className={styles.primaryButton} type="submit">Guardar Historia</button> : null}
          </div>
        </form>
      </section>

      {!panelOwnsHistory && data.localFallback ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Fallback actual</span><h2>Texto heredado del código</h2></div>
            <p>Se muestra solo como referencia para facilitar la migración al Panel.</p>
          </div>
          <div className={styles.panelCard}>
            <p className={styles.emptyText} style={{ whiteSpace: 'pre-wrap', marginTop: 0 }}>{data.localFallback}</p>
          </div>
        </section>
      ) : null}
    </div>
  )
}
