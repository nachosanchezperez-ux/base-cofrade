import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { CONCERT_EVENT_TYPES } from '@/lib/concert-events'
import { requirePanelUser } from '@/lib/panel/auth'
import { getConcertEventReferenceOptions, getPanelConcertEvents } from '@/lib/panel/concert-events'
import { createConcertEventAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { archived: 'El concierto se ha archivado sin borrar sus relaciones.' }

export const metadata = { title: 'Conciertos · Panel' }

export default async function PanelConcertEventsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, events, options] = await Promise.all([
    requirePanelUser(),
    getPanelConcertEvents({ query: q, status }),
    getConcertEventReferenceOptions(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Agenda musical</span><h1>Conciertos</h1><p>Conciertos, certámenes, presentaciones, estrenos y encuentros de bandas de Sevilla y su provincia.</p></div>
      </header>
      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar concierto</span><input type="search" name="q" defaultValue={q} placeholder="Buscar concierto, certamen o presentación…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicados</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivados</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{events.length} conciertos</strong><small>Los publicados alimentan automáticamente la Agenda Cofrade.</small></div>
        {events.length ? <div className={styles.brotherhoodList}>{events.map((item) => (
          <article key={item.id}>
            <span className={styles.listMonogram}>♫</span>
            <div className={styles.listIdentity}>
              <strong>{item.name}</strong>
              <span>{item.event.eventTypeLabel} · {item.event.bands.map((band) => band.name).join(' · ') || 'Banda por vincular'}</span>
              <small>{item.event.event_date || 'Fecha por documentar'}{item.event.municipalityName ? ` · ${item.event.municipalityName}` : ''}</small>
            </div>
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
            <Link className={styles.rowLink} href={`/panel/conciertos/${item.id}`}>Editar <span>→</span></Link>
          </article>
        ))}</div> : <p className={styles.emptyText}>No hay conciertos que coincidan con este filtro.</p>}
      </section>

      {canEdit ? <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo acto musical</span><h2>Crear concierto</h2></div><p>Puedes seleccionar varias Bandas desde el primer momento. Después podrás ordenar y describir su participación.</p></div>
        <form action={createConcertEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" required placeholder="Concierto de marchas procesionales…" /></label>
            <label><span>Tipo de acto</span><select name="event_type" defaultValue="concierto">{CONCERT_EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Fecha</span><input name="event_date" type="date" required /></label>
            <label><span>Hora</span><input name="start_time" type="time" /></label>
            <label><span>Localidad</span><select name="municipality_id" defaultValue="" required><option value="" disabled>Selecciona una localidad</option>{options.municipalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Lugar vinculado</span><select name="place_id" defaultValue=""><option value="">Sin lugar vinculado</option>{options.places.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Bandas participantes</span><select name="band_entity_ids" multiple required size={Math.min(Math.max(options.bandOptions.length, 5), 9)}>{options.bandOptions.map((item) => <option key={item.id} value={item.id}>{item.name}{item.meta ? ` · ${item.meta}` : ''}</option>)}</select><small>Mantén pulsado Ctrl/Cmd para seleccionar varias formaciones.</small></label>
            <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={options.brotherhoodOptions} label="Hermandad relacionada (opcional)" placeholder="Buscar Hermandad…" emptyLabel="Sin Hermandad vinculada" />
            <label><span>Estado del acto</span><select name="event_status" defaultValue="announced"><option value="announced">Anunciado</option><option value="postponed">Aplazado</option><option value="cancelled">Cancelado</option><option value="held">Celebrado</option></select></label>
            <label><span>Estado editorial</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" placeholder="Motivo, organización o contexto del concierto" /></label>
          </div>
          <div className={styles.formActions}><small>Para publicar, todas las Bandas seleccionadas deben tener su ficha publicada.</small><button className={styles.primaryButton} type="submit">Crear concierto</button></div>
        </form>
      </section> : null}
    </div>
  )
}
