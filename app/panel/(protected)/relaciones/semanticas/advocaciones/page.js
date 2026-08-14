import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getSemanticRelationsData } from '@/lib/panel/semantic-relations'
import { setAdvocationStatusAction } from '../advocation-actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Identidades devocionales · Panel' }

export default async function AdvocationStatusPage() {
  const [user, data] = await Promise.all([requirePanelUser(), getSemanticRelationsData()])
  const canPublish = user.role === 'admin'

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Identidad devocional</span>
          <h1>Estado editorial de advocaciones</h1>
          <p>Publica una identidad devocional antes de publicar relaciones institucionales que la utilicen.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/relaciones/semanticas">Volver</Link>
      </header>

      {!canPublish ? <div className={styles.readOnlyNotice}>Solo un administrador puede cambiar el estado editorial.</div> : null}

      <div style={{ display: 'grid', gap: 12 }}>
        {data.advocations.map((item) => (
          <article className={styles.panelCard} key={item.entity_id}>
            <strong>{item.entity.name}</strong>
            <small style={{ display: 'block' }}>{[item.advocation_type, item.entity.status].filter(Boolean).join(' · ')}</small>
            {canPublish ? (
              <form action={setAdvocationStatusAction} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input type="hidden" name="advocation_id" value={item.entity_id} />
                {item.entity.status !== 'published' ? <button type="submit" name="status" value="published">Publicar</button> : <button type="submit" name="status" value="draft">Pasar a borrador</button>}
                <button type="submit" name="status" value="archived">Archivar</button>
              </form>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
