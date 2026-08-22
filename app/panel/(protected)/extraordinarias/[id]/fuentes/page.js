import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getExtraordinarySourceEditorData } from '@/lib/panel/extraordinary-outings'
import {
  addExtraordinarySourceAction,
  unlinkExtraordinarySourceAction,
  updateExtraordinarySourceLinkAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'
import editorStyles from '../editor.module.css'

const SAVED = {
  linked: 'Fuente vinculada correctamente.',
  updated: 'Alcance documental actualizado.',
  unlinked: 'Fuente retirada de esta extraordinaria sin borrar el documento global.',
}

export const metadata = { title: 'Fuentes · Extraordinaria · Panel' }

export default async function ExtraordinarySourcesPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getExtraordinarySourceEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const isAdmin = user.role === 'admin'
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())

  return (
    <div className={`${styles.pageWrap} ${editorStyles.stack}`}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/extraordinarias">Extraordinarias</Link><span>→</span><strong>Fuentes</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>{data.outing.municipality || 'Sevilla y provincia'}</span><h1>{data.outing.title || 'Extraordinaria'}</h1><p>Documentación que respalda fechas, horarios, música, recorrido y contexto.</p></div>
          {data.outing.slug ? <Link className={styles.secondaryButton} href={`/extraordinarias/${data.outing.slug}#fuentes`} target="_blank" rel="noreferrer">Ver fuentes públicas ↗</Link> : null}
        </div>
      </header>

      {SAVED[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED[query.saved]}</div> : null}
      <div className={editorStyles.helpBox}><strong>Fuente global, vínculo local:</strong> el documento (nombre, URL, fecha…) puede reutilizarse en todo Hilo Cofrade. Aquí editamos principalmente <strong>qué documenta en esta extraordinaria</strong>, para no cambiar otras fichas accidentalmente.</div>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación vinculada</span><h2>{data.links.length} fuentes</h2></div><p>Las fuentes con URL se muestran también en la guía pública.</p></div>
        {data.links.length ? <div className={editorStyles.itemList}>{data.links.map((link) => (
          <article className={editorStyles.itemCard} key={link.id}>
            <div className={editorStyles.itemHead}>
              <div><span>{link.source?.source_type || 'Fuente'}</span><strong>{link.source?.name || 'Fuente sin nombre'}</strong><small>{link.source?.author_or_publisher || link.source?.url || 'Referencia interna'}</small></div>
              <div className={editorStyles.inlineActions}>
                {link.source?.url ? <a className={editorStyles.tinyButton} href={link.source.url} target="_blank" rel="noreferrer">Abrir ↗</a> : null}
                {isAdmin ? <form action={unlinkExtraordinarySourceAction}><input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="source_link_id" value={link.id}/><button className={`${editorStyles.tinyButton} ${editorStyles.dangerButton}`} type="submit">Desvincular</button></form> : null}
              </div>
            </div>
            <div className={editorStyles.itemBody}>
              <div className={editorStyles.sourceMeta}>
                {link.source?.publication_date ? <span>Publicada · {link.source.publication_date}</span> : null}
                {link.source?.accessed_at ? <span>Consultada · {link.source.accessed_at}</span> : null}
                {link.source?.url ? <span>URL documentada</span> : <span>Referencia interna</span>}
              </div>
              <form action={updateExtraordinarySourceLinkAction} className={styles.editorForm}>
                <input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="source_link_id" value={link.id}/>
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Qué documenta</span><input name="scope" defaultValue={link.scope || ''} placeholder="Recorrido, horarios y acompañamiento musical" disabled={!canEdit}/></label>
                  <label className={styles.fieldWide}><span>Notas del vínculo</span><textarea name="link_notes" rows="2" defaultValue={link.notes || ''} disabled={!canEdit}/></label>
                </div>
                <div className={styles.formActions}><small>Los metadatos de la Fuente se mantienen globales.</small><button className={styles.primaryButton} disabled={!canEdit}>Guardar alcance</button></div>
              </form>
            </div>
          </article>
        ))}</div> : <div className={editorStyles.empty}>Todavía no hay fuentes vinculadas.</div>}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nueva documentación</span><h2>Añadir fuente</h2></div><p>Si la URL ya existe en Hilo Cofrade, se reutiliza automáticamente en lugar de duplicarla.</p></div>
        <form action={addExtraordinarySourceAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="outing_id" value={data.outing.id}/>
          <datalist id={`source-types-${data.outing.id}`}>{data.sourceTypes.map((type) => <option value={type} key={type}/>)}</datalist>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre</span><input name="name" required placeholder="Hermandad · Comunicado oficial" disabled={!canEdit}/></label>
            <label className={styles.fieldWide}><span>URL</span><input name="url" type="url" placeholder="https://…" disabled={!canEdit}/></label>
            <label><span>Tipo</span><input name="source_type" list={`source-types-${data.outing.id}`} defaultValue="Fuente oficial" disabled={!canEdit}/></label>
            <label><span>Autor / editor</span><input name="author_or_publisher" disabled={!canEdit}/></label>
            <label><span>Fecha de publicación</span><input name="publication_date" type="date" disabled={!canEdit}/></label>
            <label><span>Fecha de consulta</span><input name="accessed_at" type="date" defaultValue={today} disabled={!canEdit}/></label>
            <label className={styles.fieldWide}><span>Qué documenta</span><input name="scope" placeholder="Fecha y motivo de la extraordinaria" disabled={!canEdit}/></label>
            <label className={styles.fieldWide}><span>Notas del vínculo</span><textarea name="link_notes" rows="2" disabled={!canEdit}/></label>
            <label className={styles.fieldWide}><span>Notas de la Fuente</span><textarea name="source_notes" rows="2" disabled={!canEdit}/></label>
          </div>
          <div className={styles.formActions}><small>La Fuente quedará disponible para reutilizarse en otras fichas.</small><button className={styles.primaryButton} disabled={!canEdit}>Añadir Fuente</button></div>
        </form>
      </section>
    </div>
  )
}
