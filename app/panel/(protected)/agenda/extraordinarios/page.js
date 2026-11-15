import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getExtraordinaryActsPanelData } from '@/lib/panel/extraordinary-acts'
import { EXTRAORDINARY_KINDS } from '@/lib/agenda-extraordinary'
import { setExtraordinaryKindAction } from './actions'
import styles from '@/app/panel/panel.module.css'
import localStyles from './page.module.css'

export const metadata = { title: 'Actos extraordinarios · Panel' }

function formatDate(value = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Fecha por confirmar'
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${value}T12:00:00Z`))
}

export default async function ExtraordinaryActsPage({ searchParams }) {
  const query = (await searchParams) || {}
  const q = String(query.q || '').slice(0, 80)
  const onlyMarked = query.marcados === '1'
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getExtraordinaryActsPanelData({ q, onlyMarked }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role) && data.available

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Agenda</span>
          <h1>Actos extraordinarios</h1>
          <p>Coronaciones, salidas extraordinarias y aniversarios. Un acto marcado va el primero de su día en la Agenda, la portada y la ficha de la Hermandad. Para el resto, se mantiene el orden habitual: besamanos, certámenes y salidas, y después los demás cultos.</p>
        </div>
        <Link className={styles.secondaryButton} href="/agenda-cofrade/hoy" target="_blank" rel="noreferrer">Abrir Agenda de hoy ↗</Link>
      </header>

      {query.guardado ? <div className={styles.savedNotice} role="status">Marca guardada. La Agenda y la portada se actualizan en unos segundos.</div> : null}
      {query.error ? <div className={styles.readOnlyNotice} role="alert">{String(query.error)}</div> : null}
      {!data.available ? <div className={styles.readOnlyNotice}>La marca estará disponible en cuanto se aplique la actualización de la base de datos.</div> : null}
      {data.available && !['admin', 'editor'].includes(user.role) ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar acto</span><input type="search" name="q" defaultValue={q} placeholder="Buscar por acto o Hermandad…" /></label>
        <label className={styles.inlineCheck}><input type="checkbox" name="marcados" value="1" defaultChecked={onlyMarked} /> Solo marcados</label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{data.total} {data.total === 1 ? 'acto' : 'actos'}</strong>
          <small>{data.markedCount} {data.markedCount === 1 ? 'marcado' : 'marcados'} · de hace dos días en adelante{data.total > data.acts.length ? ` · se muestran los ${data.acts.length} primeros` : ''}</small>
        </div>
        {data.acts.length ? <div className={styles.brotherhoodList}>{data.acts.map((act) => (
          <article className={localStyles.row} key={`${act.table}:${act.id}`}>
            <span className={styles.listMonogram}>{act.kind ? '★' : act.table === 'outing' ? 'S' : 'C'}</span>
            <div className={styles.listIdentity}>
              <strong>{act.title}</strong>
              <span>{act.brotherhood || 'Hermandad por documentar'} · {act.type}</span>
              <small>{formatDate(act.date)}{act.time ? ` · ${act.time}` : ''}{act.isDraft ? ' · borrador' : ''}{act.isCancelled ? ' · suspendido' : ''}</small>
            </div>
            <form action={setExtraordinaryKindAction} className={localStyles.markForm}>
              <input type="hidden" name="table" value={act.table} />
              <input type="hidden" name="id" value={act.id} />
              {q ? <input type="hidden" name="q" value={q} /> : null}
              <label>
                <span className={styles.srOnly}>Tipo de acto extraordinario</span>
                <select name="kind" defaultValue={act.kind} disabled={!canEdit}>
                  <option value="">Ordinario</option>
                  {Object.entries(EXTRAORDINARY_KINDS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              {canEdit ? <button className={styles.smallButton} type="submit">Guardar</button> : null}
            </form>
          </article>
        ))}</div> : <p className={styles.emptyText}>No hay actos que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
