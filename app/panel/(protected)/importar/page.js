import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImportTargets } from '@/lib/panel/document-import'
import { createClient } from '@/lib/supabase/server'
import { analyzeDocumentAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Importar documentación · Panel' }
export const maxDuration = 60

const STATUS = {
  review: ['En revisión', 'review'],
  applied: ['Aplicada', 'published'],
  discarded: ['Descartada', 'archived'],
  failed: ['Fallida', 'archived'],
}

function formatDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date(value))
}

export default async function DocumentImportPage({ searchParams }) {
  const query = await searchParams
  const [user, supabase] = await Promise.all([
    requirePanelUser(),
    createClient(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const configured = Boolean(process.env.OPENAI_API_KEY)
  const targets = await getImportTargets(supabase)

  const importsResult = await supabase
    .from('document_imports')
    .select('id, target_entity_id, source_url, source_title, status, model_name, created_at')
    .order('created_at', { ascending: false })
    .limit(20)

  const migrationPending = ['PGRST205', '42P01'].includes(importsResult.error?.code)
  if (importsResult.error && !migrationPending) {
    throw new Error(`No se pudieron cargar las importaciones: ${importsResult.error.message}`)
  }

  const imports = migrationPending ? [] : (importsResult.data || [])
  const targetIds = [...new Set(imports.map((item) => item.target_entity_id).filter(Boolean))]
  const targetRows = targetIds.length
    ? await supabase.from('entities').select('id, name, entity_type').in('id', targetIds)
    : { data: [], error: null }
  const targetById = new Map((targetRows.data || []).map((item) => [item.id, item]))

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Ingesta asistida</span>
          <h1>Importar documentación</h1>
          <p>Convierte una fuente pública en entidades y relaciones propuestas, detecta coincidencias y crea únicamente borradores revisados.</p>
        </div>
      </header>

      {query?.error ? <div className={styles.readOnlyNotice} role="alert">{String(query.error)}</div> : null}
      {migrationPending ? (
        <div className={styles.readOnlyNotice} role="status">
          El módulo está desplegado pero necesita aplicar la migración 049 antes de guardar análisis.
        </div>
      ) : null}
      {!configured ? (
        <div className={styles.readOnlyNotice} role="status">
          Falta configurar <strong>OPENAI_API_KEY</strong> en el entorno. El Panel seguirá funcionando, pero el análisis automático permanecerá desactivado.
        </div>
      ) : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar importaciones, pero no iniciar ni aplicar propuestas.</div> : null}

      <section className={`${styles.panelCard} ${styles.editorForm}`}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Paso 1</span>
            <h2>Analizar una fuente</h2>
          </div>
          <p>La página se procesa en memoria. Hilo guarda la propuesta estructurada y evidencias breves, no una copia completa del HTML.</p>
        </div>

        {canEdit ? (
          <form action={analyzeDocumentAction}>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}>
                <span>URL pública</span>
                <input
                  name="source_url"
                  type="text"
                  inputMode="url"
                  placeholder="https://hermandad…/titulares/"
                  required
                />
              </label>
              <EntityPicker
                className={styles.fieldWide}
                name="target_entity_id"
                items={targets}
                label="Entidad principal (opcional, pero recomendable)"
                placeholder="Buscar San Benito, una Banda, una Imagen…"
                emptyLabel="Sin entidad objetivo"
                required={false}
              />
            </div>
            <div className={styles.formActions}>
              <small>Analizar no modifica el grafo. Primero verás coincidencias, nuevas entidades y alertas.</small>
              <button className={styles.primaryButton} type="submit" disabled={!configured || migrationPending}>
                Analizar fuente
              </button>
            </div>
          </form>
        ) : null}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Bandeja de revisión</span>
            <h2>Importaciones recientes</h2>
          </div>
          <p>{imports.length} análisis reciente{imports.length === 1 ? '' : 's'}.</p>
        </div>

        {imports.length ? (
          <div className={styles.editorStack}>
            {imports.map((item) => {
              const status = STATUS[item.status] || [item.status, 'review']
              const target = targetById.get(item.target_entity_id)
              return (
                <article className={styles.editorItem} key={item.id}>
                  <div className={styles.itemHeading}>
                    <div>
                      <span className={styles.eyebrow}>{target ? `Objetivo · ${target.name}` : 'Fuente sin objetivo'}</span>
                      <h3>{item.source_title || item.source_url}</h3>
                      <p>{item.source_url}</p>
                      <small>{formatDate(item.created_at)}{item.model_name ? ` · ${item.model_name}` : ''}</small>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[status[1]]}`}>{status[0]}</span>
                  </div>
                  <div className={styles.formActions}>
                    <small>La propuesta permanece separada del conocimiento publicado.</small>
                    <Link className={styles.secondaryButton} href={`/panel/importar/${item.id}`}>Revisar →</Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : <div className={styles.emptyPanel}>Todavía no hay análisis documentales guardados.</div>}
      </section>
    </div>
  )
}
