import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMarches } from '@/lib/panel/marches'
import { createMarchAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { archived: 'La Marcha se ha archivado sin borrar su histórico.' }
const MUSIC_TYPES = ['Banda de Música', 'Cornetas y Tambores', 'Agrupación Musical', 'Marcha procesional']

export const metadata = { title: 'Marchas · Panel' }

export default async function PanelMarchesPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const musicType = String(query?.tipo || '').trim()
  const [user, marches] = await Promise.all([
    requirePanelUser(),
    getPanelMarches({ query: q, status, musicType }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Patrimonio musical</span>
          <h1>Marchas</h1>
          <p>Composición, autoría, dedicatorias, estrenos y grabaciones desde una entidad musical única.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/hoy">Gestionar Marcha del día</Link>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}

      <form className={styles.filters} style={{ gridTemplateColumns: 'minmax(220px,1fr) 190px 220px auto' }}>
        <label><span className={styles.srOnly}>Buscar Marcha</span><input type="search" name="q" defaultValue={q} placeholder="Buscar Marcha…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicadas</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></label>
        <label><span className={styles.srOnly}>Filtrar por formación</span><select name="tipo" defaultValue={musicType}><option value="">Todas las formaciones</option>{MUSIC_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{marches.length} marchas</strong><small>El catálogo publicado alimenta patrimonio musical y selección diaria.</small></div>
        {marches.length ? (
          <div className={styles.brotherhoodList}>
            {marches.map((item) => (
              <article key={item.id}>
                <span className={styles.listMonogram}>♪</span>
                <div className={styles.listIdentity}>
                  <strong>{item.name}</strong>
                  <span>{item.composers.length ? item.composers.join(' · ') : 'Autoría por documentar'}</span>
                  <small>{[item.march.music_type, item.march.composition_year || item.march.composition_date_text, item.march.eligible_for_daily ? 'Elegible para la Home' : ''].filter(Boolean).join(' · ')}</small>
                </div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                <Link className={styles.rowLink} href={`/panel/marchas/${item.id}`}>Editar <span>→</span></Link>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay Marchas que coincidan con estos filtros.</p>}
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nueva obra</span><h2>Crear Marcha</h2></div><p>Después podrás vincular autores, dedicatorias, grabaciones y Fuentes.</p></div>
          <form action={createMarchAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <datalist id="music-types"><option value="Banda de Música" /><option value="Cornetas y Tambores" /><option value="Agrupación Musical" /><option value="Marcha procesional" /></datalist>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Título</span><input name="name" required /></label>
              <label><span>Slug</span><input name="slug" placeholder="Se genera desde el título" /></label>
              <label><span>Tipo / formación</span><input name="music_type" list="music-types" /></label>
              <label><span>Año de composición</span><input name="composition_year" type="number" min="1800" max="2200" /></label>
              <label><span>Datación textual</span><input name="composition_date_text" placeholder="Ej. 1971" /></label>
              <label><span>Estado editorial</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label>
              <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" /></label>
              <label className={styles.checkField}><input name="eligible_for_daily" type="checkbox" defaultChecked /><span>Puede aparecer como Marcha del día</span></label>
              <label><span>Prioridad diaria</span><input name="daily_priority" type="number" min="0" defaultValue="0" /></label>
            </div>
            <div className={styles.formActions}><small>Crear una Marcha no la dedica ni la asigna automáticamente a ninguna Hermandad.</small><button className={styles.primaryButton} type="submit">Crear Marcha</button></div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
