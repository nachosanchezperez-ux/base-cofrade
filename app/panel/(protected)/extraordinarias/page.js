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

function visualCoverage(item) {
  return Number(item.hasPhoto) + Number(item.hasPoster) + Number(item.galleryCount > 0)
}

function visualSummary(item) {
  return [
    `Foto ${item.hasPhoto ? '✓' : '—'}`,
    `Cartel ${item.hasPoster ? '✓' : '—'}`,
    `Galería ${item.galleryCount || '—'}`,
  ].join(' · ')
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
          <p>Gestiona cada salida, su fotografía principal, cartel oficial y galería desde un único lugar.</p>
        </div>
      </header>

      {!canEdit ? <div className={styles.readOnlyNotice}>Puedes consultar las Extraordinarias, pero un editor debe modificar la multimedia.</div> : null}

      <section className={`${styles.panelCard} ${extraStyles.measureGuide}`}>
        <div>
          <span>Foto principal</span>
          <strong>1800 × 1200</strong>
          <small>3:2 · mínimo 1200 × 800 · zona segura 70% central.</small>
        </div>
        <div>
          <span>Cartel</span>
          <strong>1080 × 1350</strong>
          <small>4:5 · mínimo 800 × 1000 · se muestra completo.</small>
        </div>
        <div>
          <span>Galería</span>
          <strong>1600 × 1200</strong>
          <small>4:3 · mínimo 1200 × 900 · hasta 12 fotografías.</small>
        </div>
        <div>
          <span>Archivo</span>
          <strong>JPG · WEBP · PNG · AVIF</strong>
          <small>Recomendado 1–5 MB según uso · máximo 10 MB.</small>
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
          <small>Cobertura 3/3 = fotografía principal + cartel + al menos una imagen de galería.</small>
        </div>

        {outings.length ? (
          <div className={extraStyles.outingList}>
            {outings.map((item) => {
              const coverage = visualCoverage(item)
              return (
                <article key={item.id}>
                  <div
                    className={`${extraStyles.photoState} ${coverage === 3 ? extraStyles.photoReady : extraStyles.photoMissing}`}
                    aria-label={`Cobertura visual ${coverage} de 3`}
                  >
                    {coverage}/3
                  </div>
                  <div className={extraStyles.outingIdentity}>
                    <span>{[item.municipality, item.outing_date].filter(Boolean).join(' · ')}</span>
                    <strong>{item.title || item.outing_type || 'Extraordinaria'}</strong>
                    <small>{item.organizer_name || item.reference_code || 'Entidad por documentar'}</small>
                  </div>
                  <span className={`${extraStyles.eventStatus} ${extraStyles[item.event_status] || ''}`}>{EVENT_STATUS_LABELS[item.event_status] || item.event_status}</span>
                  <span className={`${extraStyles.photoBadge} ${coverage === 3 ? extraStyles.photoBadgeReady : ''}`}>{visualSummary(item)}</span>
                  <Link className={styles.rowLink} href={`/panel/extraordinarias/${item.id}`}>Editar <span>→</span></Link>
                </article>
              )
            })}
          </div>
        ) : (
          <p className={styles.emptyText}>No hay extraordinarias que coincidan con estos filtros.</p>
        )}
      </section>
    </div>
  )
}
