import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelExtraordinaryOutings } from '@/lib/panel/extraordinary-outings'
import styles from '@/app/panel/panel.module.css'
import extraStyles from './extraordinarias.module.css'

const EVENT_STATUS_LABELS = {
  announced: 'Anunciada',
  held: 'Celebrada',
  cancelled: 'Cancelada',
}

export const metadata = { title: 'Extraordinarias · Panel' }

export default async function PanelExtraordinaryOutingsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const eventStatus = ['announced', 'held', 'cancelled'].includes(query?.estado) ? query.estado : ''
  const [user, outings] = await Promise.all([
    requirePanelUser(),
    getPanelExtraordinaryOutings({ query: q, eventStatus }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Agenda especial</span>
          <h1>Extraordinarias</h1>
          <p>Gestiona las salidas extraordinarias y su imagen principal para Home, directorio y guía individual.</p>
        </div>
      </header>

      {!canEdit ? <div className={styles.readOnlyNotice}>Puedes consultar las Extraordinarias, pero un editor debe modificar las fotografías.</div> : null}

      <section className={`${styles.panelCard} ${extraStyles.measureGuide}`}>
        <div>
          <span>Foto maestra recomendada</span>
          <strong>1800 × 1200 px</strong>
          <small>Proporción 3:2 · mínimo 1200 × 800 px</small>
        </div>
        <div>
          <span>Zona segura</span>
          <strong>70% central</strong>
          <small>Deja aire alrededor del titular para los recortes responsive.</small>
        </div>
        <div>
          <span>Archivo</span>
          <strong>JPG · WEBP · PNG · AVIF</strong>
          <small>Objetivo 2–5 MB · máximo 10 MB.</small>
        </div>
      </section>

      <form className={styles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar extraordinaria</span>
          <input type="search" name="q" defaultValue={q} placeholder="Titular, localidad, hermandad o REF…" />
        </label>
        <label>
          <span className={styles.srOnly}>Filtrar por estado</span>
          <select name="estado" defaultValue={eventStatus}>
            <option value="">Todos los estados</option>
            <option value="announced">Anunciadas</option>
            <option value="held">Celebradas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{outings.length} extraordinarias</strong>
          <small>La foto principal se reutiliza automáticamente en Home, directorio y ficha.</small>
        </div>

        {outings.length ? (
          <div className={extraStyles.outingList}>
            {outings.map((item) => (
              <article key={item.id}>
                <div className={`${extraStyles.photoState} ${item.hasPhoto ? extraStyles.photoReady : extraStyles.photoMissing}`} aria-label={item.hasPhoto ? 'Con fotografía' : 'Sin fotografía'}>
                  {item.hasPhoto ? 'Foto' : '—'}
                </div>
                <div className={extraStyles.outingIdentity}>
                  <span>{[item.municipality, item.outing_date].filter(Boolean).join(' · ')}</span>
                  <strong>{item.title || item.outing_type || 'Extraordinaria'}</strong>
                  <small>{item.organizer_name || item.reference_code || 'Entidad por documentar'}</small>
                </div>
                <span className={`${extraStyles.eventStatus} ${extraStyles[item.event_status] || ''}`}>{EVENT_STATUS_LABELS[item.event_status] || item.event_status}</span>
                <span className={`${extraStyles.photoBadge} ${item.hasPhoto ? extraStyles.photoBadgeReady : ''}`}>{item.hasPhoto ? 'Imagen lista' : 'Falta imagen'}</span>
                <Link className={styles.rowLink} href={`/panel/extraordinarias/${item.id}`}>Editar <span>→</span></Link>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>No hay extraordinarias que coincidan con estos filtros.</p>
        )}
      </section>
    </div>
  )
}
