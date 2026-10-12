import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getHomeFeaturedPanelData } from '@/lib/panel/home-featured'
import { HOME_FEATURED_MAX_DAYS, HOME_FEATURED_MAX_PRIORITY } from '@/lib/home-featured-form'
import { clearHomeFeaturedAction, saveHomeFeaturedAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Destacados · Portada editorial · Panel' }

const SAVED_MESSAGES = {
  featured: 'Destacado guardado. La portada lo mostrará en las fechas indicadas mientras la salida no haya terminado.',
  'featured-cleared': 'Destacado retirado de la portada.',
}

const STATUS = {
  active: { label: 'En portada', badge: 'published' },
  scheduled: { label: 'Programado', badge: 'review' },
  ended: { label: 'Finalizado', badge: 'archived' },
  unknown: { label: 'Sin ventana', badge: 'draft' },
}

function FeaturedRow({ item, canEdit }) {
  const status = STATUS[item.featuredStatus] || STATUS.unknown
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div>
          <span className={styles.eyebrow}>{[item.dateLabel, item.municipality].filter(Boolean).join(' · ')}</span>
          <h3>{item.title}</h3>
          <p>
            {item.organizer ? `${item.organizer} · ` : ''}
            En portada del <strong>{item.startsOn}</strong> al <strong>{item.endsOn}</strong> · prioridad {item.priority}
            {item.status !== 'published' ? ' · la salida no está publicada y no se mostrará' : ''}
          </p>
        </div>
        <span className={`${styles.statusBadge} ${styles[status.badge]}`}>{status.label}</span>
      </div>
      {canEdit ? (
        <form action={saveHomeFeaturedAction} className={styles.editorForm}>
          <input type="hidden" name="outing_id" value={item.id} />
          <div className={styles.formGrid}>
            <label><span>Desde</span><input type="date" name="starts_on" defaultValue={item.startsOn} required /></label>
            <label><span>Hasta</span><input type="date" name="ends_on" defaultValue={item.endsOn} required /></label>
            <label><span>Prioridad</span><input type="number" name="priority" min="0" max={HOME_FEATURED_MAX_PRIORITY} step="1" defaultValue={item.priority} /></label>
          </div>
          <div className={styles.formActions}><small>Cambia las fechas o la prioridad y guarda.</small><button className={styles.primaryButton} type="submit">Actualizar</button></div>
        </form>
      ) : null}
      {canEdit && item.featuredStatus !== 'ended' ? (
        <form action={clearHomeFeaturedAction} className={styles.archiveForm}>
          <input type="hidden" name="outing_id" value={item.id} />
          <button type="submit">Retirar de la portada</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function HomeFeaturedPage({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([requirePanelUser(), getHomeFeaturedPanelData()])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const current = data.featured.filter((item) => item.featuredStatus !== 'ended')
  const ended = data.featured.filter((item) => item.featuredStatus === 'ended')

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Portada editorial</span>
          <h1>Destacados</h1>
          <p>Elige qué salidas ocupan el bloque destacado de la portada y durante qué días. Se retiran solas al terminar la salida o al acabar la ventana.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link className={styles.secondaryButton} href="/" target="_blank" rel="noreferrer">Abrir Home ↗</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Nuevo destacado</span><h2>Destacar una salida</h2></div>
            <p>Solo salidas publicadas desde ayer en adelante. Máximo {HOME_FEATURED_MAX_DAYS} días. Con varios destacados a la vez, la mayor prioridad aparece primero.</p>
          </div>
          <article className={styles.editorItem}>
            <form action={saveHomeFeaturedAction} className={styles.editorForm}>
              <div className={styles.formGrid}>
                <EntityPicker className={styles.fieldWide} name="outing_id" items={data.outingOptions} label="Salida" placeholder="Buscar por título, Hermandad o municipio…" emptyLabel="Selecciona una salida" />
                <label><span>Desde</span><input type="date" name="starts_on" defaultValue={data.today} required /></label>
                <label><span>Hasta</span><input type="date" name="ends_on" required /></label>
                <label><span>Prioridad</span><input type="number" name="priority" min="0" max={HOME_FEATURED_MAX_PRIORITY} step="1" defaultValue="50" /></label>
              </div>
              <div className={styles.formActions}><small>Si la salida ya estaba destacada, se sustituyen sus fechas.</small><button className={styles.primaryButton} type="submit">Destacar en portada</button></div>
            </form>
          </article>
        </section>
      ) : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Hoy es {data.today}</span><h2>En portada y programados</h2></div>
          <p>{current.length ? `${current.length} destacado${current.length === 1 ? '' : 's'} vigente${current.length === 1 ? '' : 's'} o programado${current.length === 1 ? '' : 's'}.` : 'No hay destacados vigentes ni programados.'}</p>
        </div>
        <div className={styles.editorStack}>
          {current.map((item) => <FeaturedRow key={item.id} item={item} canEdit={canEdit} />)}
        </div>
      </section>

      {ended.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Últimos 14 días</span><h2>Finalizados</h2></div><p>Se conservan como referencia; no aparecen en la portada.</p></div>
          <div className={styles.editorStack}>
            {ended.map((item) => <FeaturedRow key={item.id} item={item} canEdit={canEdit} />)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
