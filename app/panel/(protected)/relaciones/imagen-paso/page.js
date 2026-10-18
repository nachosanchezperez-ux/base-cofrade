import Link from 'next/link'
import ImageStepRelationsEditor from '@/components/panel/ImageStepRelationsEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageStepRelations } from '@/lib/panel/image-steps'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Imagen y Paso · Panel' }

const PAGE_SIZE = 25

function normalizeSearch(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const SAVED_MESSAGES = {
  linked: 'La Imagen y el Paso se han relacionado correctamente.',
  restored: 'La relación histórica se ha restaurado correctamente.',
  updated: 'La relación se ha actualizado correctamente.',
  closed: 'El periodo se ha cerrado sin borrar ninguna entidad.',
  archived: 'La relación se ha retirado. La Imagen y el Paso continúan existiendo.',
}

export default async function ImageStepRelationsPage({ searchParams }) {
  const [query, user, data] = await Promise.all([
    searchParams,
    requirePanelUser(),
    getImageStepRelations(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  // Con cientos de relaciones, pintarlas todas (cada una con su buscador de miles de Fuentes)
  // agotaba la memoria del servidor. Se filtra y se muestra por páginas.
  const term = normalizeSearch(query?.q)
  const filtered = term
    ? data.relations.filter((relation) => normalizeSearch(`${relation.image?.name || ''} ${relation.step?.name || ''}`).includes(term))
    : data.relations
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(pageCount, Math.max(1, Number.parseInt(query?.pagina, 10) || 1))
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageHref = (target) => {
    const params = new URLSearchParams()
    if (query?.q) params.set('q', query.q)
    if (target > 1) params.set('pagina', String(target))
    const suffix = params.toString()
    return `/panel/relaciones/imagen-paso${suffix ? `?${suffix}` : ''}`
  }

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/relaciones">Relaciones</Link>
          <span>→</span>
          <strong>Imagen ↔ Paso</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Núcleo procesional</span>
            <h1>Imagen ↔ Paso</h1>
            <p>Busca ambos nodos antes de crear una relación nueva.</p>
          </div>
          <Link className={styles.secondaryButton} href="/panel/relaciones">Volver a relaciones</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando las relaciones como colaborador.</div> : null}

      <form method="get" className={styles.editorForm} role="search">
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}>
            <span>Buscar por Imagen o Paso</span>
            <input type="search" name="q" defaultValue={query?.q || ''} placeholder="Nombre de la Imagen o del Paso…" />
          </label>
        </div>
        <div className={styles.formActions}>
          <small>{filtered.length} {filtered.length === 1 ? `relación${term ? ' encontrada' : ''}` : `relaciones${term ? ' encontradas' : ''}`} · página {page} de {pageCount}</small>
          <button className={styles.secondaryButton} type="submit">Buscar</button>
        </div>
      </form>

      <ImageStepRelationsEditor data={{ ...data, relations: visible }} canEdit={canEdit} />

      {pageCount > 1 ? (
        <nav aria-label="Páginas de relaciones" style={{ display: 'flex', gap: 12, justifyContent: 'space-between', margin: '16px 0' }}>
          {page > 1 ? <Link className={styles.secondaryButton} href={pageHref(page - 1)}>← Anteriores</Link> : <span />}
          {page < pageCount ? <Link className={styles.secondaryButton} href={pageHref(page + 1)}>Siguientes →</Link> : <span />}
        </nav>
      ) : null}
    </div>
  )
}
