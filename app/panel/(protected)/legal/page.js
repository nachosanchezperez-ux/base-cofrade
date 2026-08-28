import { requirePanelUser } from '@/lib/panel/auth'
import { getLegalDrafts } from '@/lib/panel/legal'
import { saveLegalDraftAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  draft: 'Borrador',
  review: 'En revisión',
  ready: 'Listo internamente',
}

export const metadata = { title: 'Legal · Panel' }

function formatUpdatedAt(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date(value))
}

export default async function LegalPanelPage({ searchParams }) {
  const query = await searchParams
  const [user, documents] = await Promise.all([requirePanelUser(), getLegalDrafts()])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const focusedDocument = String(query?.document || '')

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Documentación interna</span>
          <h1>Legal</h1>
          <p>Completa y revisa los textos. Los tres documentos públicos se actualizan al marcarlos como «Listo internamente».</p>
        </div>
      </header>

      {query?.saved === 'document-updated' ? <div className={styles.savedNotice} role="status">El borrador legal se ha guardado.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}
      <div className={styles.legalWarning} role="note">
        <strong>Control de publicación</strong>
        <span>La ficha de Dirección siempre es privada. Mantén los demás documentos en Borrador o En revisión mientras queden marcas [COMPLETAR] o [CONFIRMAR].</span>
      </div>

      <section className={styles.editorStack} aria-label="Borradores legales">
        {documents.map((document) => (
          <article
            className={`${styles.editorItem} ${styles.legalDocument}`}
            key={document.id}
            style={focusedDocument === document.document_key ? { outline: '2px solid #123a67', outlineOffset: 3 } : undefined}
          >
            <div className={styles.itemHeading}>
              <div>
                <span className={styles.eyebrow}>Documento privado</span>
                <h2>{document.title}</h2>
                <p>Última actualización: {formatUpdatedAt(document.updated_at)}</p>
              </div>
              <span className={`${styles.statusBadge} ${styles[document.status] || ''}`}>{STATUS_LABELS[document.status]}</span>
            </div>

            {canEdit ? (
              <form action={saveLegalDraftAction} className={styles.editorForm}>
                <input type="hidden" name="document_id" value={document.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}>
                    <span>Título interno</span>
                    <input name="title" defaultValue={document.title} required />
                  </label>
                  <label>
                    <span>Estado interno</span>
                    <select name="status" defaultValue={document.status}>
                      <option value="draft">Borrador</option>
                      <option value="review">En revisión</option>
                      <option value="ready">Listo internamente</option>
                    </select>
                  </label>
                  <label className={styles.fieldWide}>
                    <span>Contenido (Markdown)</span>
                    <textarea className={styles.legalTextarea} name="body" rows="24" defaultValue={document.body} required />
                  </label>
                  <label className={styles.fieldWide}>
                    <span>Notas internas</span>
                    <textarea name="internal_notes" rows="3" defaultValue={document.internal_notes || ''} />
                  </label>
                </div>
                <div className={styles.formActions}>
                  <small>«Listo internamente» publica los tres textos legales; la ficha de Dirección nunca se muestra.</small>
                  <button className={styles.secondaryButton} type="submit">Guardar borrador</button>
                </div>
              </form>
            ) : (
              <pre className={styles.legalPreview}>{document.body}</pre>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
