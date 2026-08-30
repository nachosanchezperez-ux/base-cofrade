import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { CREW_EVENT_TYPES } from '@/lib/crew-events'
import { requirePanelUser } from '@/lib/panel/auth'
import { getCrewEventReferenceOptions, getPanelCrewEvents } from '@/lib/panel/crew-events'
import { createCrewEventAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { archived: 'La convocatoria se ha archivado sin borrar su histórico.' }

export const metadata = { title: 'Igualás y ensayos · Panel' }

export default async function PanelCrewEventsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, events, options] = await Promise.all([
    requirePanelUser(),
    getPanelCrewEvents({ query: q, status }),
    getCrewEventReferenceOptions(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Agenda de costaleros</span><h1>Igualás y ensayos</h1><p>Convocatorias relacionadas con su Hermandad, sus Pasos y el equipo de capataces.</p></div></header>
      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar convocatoria</span><input type="search" name="q" defaultValue={q} placeholder="Buscar igualá, ensayo o Hermandad…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicadas</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{events.length} convocatorias</strong><small>Las publicadas alimentan el calendario y conservan su ficha en el histórico.</small></div>
        {events.length ? <div className={styles.brotherhoodList}>{events.map((item) => (
          <article key={item.id}>
            <span className={styles.listMonogram}>I/E</span>
            <div className={styles.listIdentity}><strong>{item.name}</strong><span>{item.event.eventTypeLabel} · {item.event.brotherhoodName}</span><small>{item.event.event_date || 'Fecha por documentar'}{item.event.municipalityName ? ` · ${item.event.municipalityName}` : ''}</small></div>
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
            <Link className={styles.rowLink} href={`/panel/igualas-y-ensayos/${item.id}`}>Editar <span>→</span></Link>
          </article>
        ))}</div> : <p className={styles.emptyText}>No hay convocatorias que coincidan con este filtro.</p>}
      </section>

      {canEdit ? <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nueva convocatoria</span><h2>Crear igualá o ensayo</h2></div><p>Primero crea la cita; después podrás vincular todos sus Pasos, responsables y Fuentes.</p></div>
        <form action={createCrewEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" required placeholder="Igualá del paso de palio de…" /></label>
            <label><span>Tipo de cita</span><select name="event_type" defaultValue="iguala">{CREW_EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Fecha</span><input name="event_date" type="date" required /></label>
            <label><span>Hora</span><input name="start_time" type="time" /></label>
            <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={options.brotherhoodOptions} label="Hermandad" placeholder="Buscar Hermandad…" emptyLabel="Selecciona una Hermandad" />
            <label><span>Localidad</span><select name="municipality_id" defaultValue=""><option value="">La de la Hermandad</option>{options.municipalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Lugar vinculado</span><select name="place_id" defaultValue=""><option value="">Sin lugar vinculado</option>{options.places.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label><span>Estado de la cita</span><select name="event_status" defaultValue="announced"><option value="announced">Convocada</option><option value="postponed">Aplazada</option><option value="cancelled">Cancelada</option><option value="held">Celebrada</option></select></label>
            <label><span>Estado editorial</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicada</option></select></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" /></label>
          </div>
          <div className={styles.formActions}><small>La publicación exige una Hermandad publicada y una fecha exacta.</small><button className={styles.primaryButton} type="submit">Crear convocatoria</button></div>
        </form>
      </section> : null}
    </div>
  )
}
