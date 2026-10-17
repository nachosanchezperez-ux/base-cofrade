import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { NEWS_TOPICS, getNewsReferenceOptions, getPanelNewsList } from '@/lib/panel/editorial-news'
import { createNewsAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicada', review: 'En revisión', draft: 'Borrador', archived: 'Archivada' }
const TOPIC_LABELS = Object.fromEntries(NEWS_TOPICS)

export const metadata = { title: 'Noticias · Panel' }

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

export default async function PanelNewsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim().slice(0, 120)
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, items, options] = await Promise.all([
    requirePanelUser(),
    getPanelNewsList({ query: q, status }),
    getNewsReferenceOptions(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const today = madridToday()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}><div><span className={styles.eyebrow}>El Hilo se mueve</span><h1>Noticias</h1><p>Actualidad de hermandades y bandas, con sus protagonistas, fichas relacionadas y fuentes. Al publicarlas aparecen en El Hilo se mueve y en la ficha protagonista.</p></div></header>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar noticia</span><input type="search" name="q" defaultValue={q} placeholder="Buscar por titular, Hermandad o banda…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicadas</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{items.length} noticias</strong><small>Una noticia publicada con fecha futura queda programada: se muestra ese día.</small></div>
        {items.length ? <div className={styles.brotherhoodList}>{items.map((item) => (
          <article key={item.id}>
            <span className={styles.listMonogram}>N</span>
            <div className={styles.listIdentity}><strong>{item.title}</strong><span>{item.protagonist || 'Sin protagonista'}{item.news_topic ? ` · ${TOPIC_LABELS[item.news_topic]}` : ''}</span><small>{item.publish_date || 'Sin fecha'}{item.status === 'published' && item.publish_date > today ? ' · programada' : ''}{item.slug ? '' : ' · sin identificador'}</small></div>
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
            <Link className={styles.rowLink} href={`/panel/noticias/${item.id}`}>Editar <span>→</span></Link>
          </article>
        ))}</div> : <p className={styles.emptyText}>No hay noticias que coincidan con este filtro.</p>}
      </section>

      {canEdit ? <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nueva noticia</span><h2>Crear noticia</h2></div><p>Se crea como borrador. Después podrás añadir las fichas relacionadas y las fuentes, y publicarla.</p></div>
        <form action={createNewsAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Titular</span><input name="title" required maxLength={160} placeholder="Una nueva etapa musical para…" /></label>
            <EntityPicker className={styles.fieldWide} name="protagonist_entity_id" items={options.protagonistOptions} label="Hermandad o banda protagonista" placeholder="Buscar Hermandad o banda…" emptyLabel="Selecciona una Hermandad o banda" required={false} />
            <label><span>Tema</span><select name="news_topic" defaultValue=""><option value="">Elige un tema</option>{NEWS_TOPICS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Localidad</span><select name="municipality_id" defaultValue=""><option value="">Elige una localidad</option>{options.municipalities.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label><span>Fecha del anuncio</span><input name="announced_on" type="date" max={today} /></label>
            <label><span>Fecha de publicación</span><input name="publish_date" type="date" defaultValue={today} /></label>
            <label className={styles.fieldWide}><span>Entradilla</span><textarea name="summary" rows="2" maxLength={400} placeholder="Qué ha pasado, en una o dos frases." /></label>
          </div>
          <div className={styles.formActions}><small>Para publicar hacen falta: titular, entradilla, contexto, tema, localidad, ficha protagonista publicada y una fuente.</small><button className={styles.primaryButton} type="submit">Crear borrador</button></div>
        </form>
      </section> : null}
    </div>
  )
}
