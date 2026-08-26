import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelGlories } from '@/lib/panel/glories'
import styles from '@/app/panel/panel.module.css'
import gloryStyles from '@/components/panel/PanelGlories.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Glorias · Panel' }

function formatDate(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

function formatTime(value) {
  return value ? value.slice(0, 5) : ''
}

function GloryIdentity({ item }) {
  return (
    <div className={gloryStyles.identityRow}>
      <span className={gloryStyles.crest} aria-hidden="true">
        {item.crestPath ? <img src={item.crestPath} alt="" /> : 'G'}
      </span>
      <span className={gloryStyles.identityCopy}>
        <strong>{item.name}</strong>
        <span>{item.municipality}{item.province ? ` · ${item.province}` : ''}</span>
      </span>
      <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
    </div>
  )
}

function GloryActions({ item }) {
  return (
    <div className={gloryStyles.cardActions}>
      <Link href={`/panel/hermandades/${item.id}`}>Editar ficha</Link>
      <Link href={`/panel/hermandades/${item.id}/salidas`}>Gestionar salidas →</Link>
    </div>
  )
}

export default async function PanelGloriesPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''

  await requirePanelUser()
  const data = await getPanelGlories({ query: q, status })

  return (
    <div className={styles.pageWrap} data-panel-glories>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Glorias</span>
          <h1>Hermandades y procesiones</h1>
          <p>Un acceso editorial único a las Hermandades de Gloria y a sus próximas Procesiones de Gloria documentadas.</p>
        </div>
        <Link className={styles.secondaryButton} href="/glorias" target="_blank" rel="noreferrer">Ver Glorias públicas ↗</Link>
      </header>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar Gloria</span><input type="search" name="q" defaultValue={q} placeholder="Buscar Hermandad de Gloria…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicadas</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={gloryStyles.summaryGrid} aria-label="Resumen de Glorias">
        <article className={gloryStyles.summaryCard}><span>Hermandades de Gloria</span><strong>{data.counts.total}</strong></article>
        <article className={gloryStyles.summaryCard}><span>Próximas documentadas</span><strong>{data.counts.upcoming}</strong></article>
        <article className={gloryStyles.summaryCard}><span>Sin próxima fecha</span><strong>{data.counts.pending}</strong></article>
      </section>

      <section className={gloryStyles.workspaceSection}>
        <div className={gloryStyles.sectionHeader}>
          <div><span className={styles.eyebrow}>Agenda</span><h2>Próximas Procesiones de Gloria</h2></div>
          <p>{data.upcoming.length} con fecha futura documentada.</p>
        </div>

        {data.upcoming.length ? (
          <div className={gloryStyles.cardGrid}>
            {data.upcoming.map((item) => {
              const outing = item.nextOuting
              const time = formatTime(outing.departure_time)
              return (
                <article className={gloryStyles.gloryCard} key={item.id}>
                  <GloryIdentity item={item} />
                  <div className={gloryStyles.outingBlock}>
                    <span>Próxima Procesión de Gloria</span>
                    <strong>{formatDate(outing.outing_date)}{time ? ` · ${time} h` : ''}</strong>
                    <small>{outing.title || 'Procesión de Gloria'} · {STATUS_LABELS[outing.status] || outing.status}</small>
                  </div>
                  <GloryActions item={item} />
                </article>
              )
            })}
          </div>
        ) : <div className={gloryStyles.emptyState}>No hay próximas Procesiones de Gloria que coincidan con estos filtros.</div>}
      </section>

      <section className={gloryStyles.workspaceSection}>
        <div className={gloryStyles.sectionHeader}>
          <div><span className={styles.eyebrow}>Documentación</span><h2>Pendientes de próxima procesión</h2></div>
          <p>Siguen siendo Hermandades de Gloria aunque aún no tengan una salida futura fechada.</p>
        </div>

        {data.pending.length ? (
          <div className={gloryStyles.cardGrid}>
            {data.pending.map((item) => (
              <article className={`${gloryStyles.gloryCard} ${gloryStyles.gloryCardPending}`} key={item.id}>
                <GloryIdentity item={item} />
                <div className={gloryStyles.pendingBlock}>Próxima Procesión de Gloria por documentar. Añade o actualiza la salida desde la propia ficha de la Hermandad.</div>
                <GloryActions item={item} />
              </article>
            ))}
          </div>
        ) : <div className={gloryStyles.emptyState}>Todas las Hermandades visibles con este filtro tienen ya una próxima procesión documentada.</div>}
      </section>
    </div>
  )
}
