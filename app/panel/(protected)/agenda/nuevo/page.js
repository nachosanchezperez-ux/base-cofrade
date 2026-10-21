import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getQuickActContribution, getQuickActFormData } from '@/lib/panel/quick-act'
import QuickActForm from './QuickActForm'
import { createQuickActAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nuevo acto · Panel' }

export default async function QuickActPage({ searchParams }) {
  const query = (await searchParams) || {}
  const user = await requirePanelUser()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const [data, contribution] = canEdit
    ? await Promise.all([getQuickActFormData(), getQuickActContribution(query.aportacion)])
    : [null, null]
  const created = query.creado === 'salida' || query.creado === 'culto'

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Agenda</span>
          <h1>Nuevo acto</h1>
          <p>Alta rápida de una salida o un culto, con su cartel, en un minuto. Lo demás (recorrido, música, tramos) se completa después en su ficha.</p>
        </div>
      </header>

      {created ? (
        <div className={styles.savedNotice} role="status">
          {query.creado === 'salida' ? 'Salida creada' : 'Culto creado'} {query.estado === 'publicado' ? 'y publicado en la Agenda.' : 'en borrador.'}{' '}
          {query.hermandad ? <Link href={`/panel/hermandades/${query.hermandad}/${query.creado === 'salida' ? 'salidas' : 'cultos'}`}>Completar en su ficha →</Link> : null}
        </div>
      ) : null}
      {query.error ? <div className={styles.readOnlyNotice} role="alert">{String(query.error)}</div> : null}
      {contribution ? <div className={styles.savedNotice} role="status">Partiendo de la aportación «{contribution.title}». Revisa cada dato antes de crear el acto.</div> : null}

      {canEdit ? (
        <section className={styles.editorSection}>
          <QuickActForm action={createQuickActAction} {...data} defaults={contribution || {}} />
        </section>
      ) : <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div>}
    </div>
  )
}
