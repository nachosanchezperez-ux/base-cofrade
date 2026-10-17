import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { NEWS_KIND_SUGGESTIONS, NEWS_TOPICS, getNewsEditorData } from '@/lib/panel/editorial-news'
import { newsNeedsTenseReview } from '@/lib/hilo-movements-editorial'
import {
  addNewsRelationAction,
  addNewsSourceAction,
  removeNewsRelationAction,
  removeNewsSourceAction,
  updateNewsAction,
  updateNewsRelationAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicada', review: 'En revisión', draft: 'Borrador', archived: 'Archivada' }
const SAVED_MESSAGES = {
  created: 'La noticia se ha creado como borrador.',
  updated: 'La noticia se ha guardado.',
  published: 'La noticia se ha publicado. Aparecerá en El Hilo se mueve en un minuto como máximo.',
  relation: 'La ficha relacionada se ha guardado.',
  'relation-removed': 'La ficha se ha retirado de la noticia.',
  source: 'La fuente se ha enlazado.',
  'source-removed': 'La fuente se ha retirado de la noticia. El registro de la fuente se conserva en el archivo.',
}
const SOURCE_TYPES = ['Prensa digital', 'Comunicado de la Hermandad', 'Red social oficial', 'Web oficial de la Hermandad', 'Web oficial de banda', 'Fuente diocesana', 'Aportación directa']

export const metadata = { title: 'Editar noticia · Panel' }

export default async function PanelNewsEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) notFound()
  const data = await getNewsEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const isAdmin = user.role === 'admin'
  const { content } = data
  const scheduled = content.status === 'published' && content.publish_date > data.today
  const publicHref = content.slug ? `/el-hilo-se-mueve#${content.slug}` : ''

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/noticias">Noticias</Link><span>→</span><strong>{content.title}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar noticia</span><h1>{content.title}</h1><p>{data.protagonist?.name || content.subject_label || 'Sin protagonista'}{scheduled ? ` · programada para el ${content.publish_date}` : ''}</p></div>
          <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[content.status]}`}>{STATUS_LABELS[content.status]}</span>{content.status === 'published' && !scheduled && publicHref ? <Link className={styles.secondaryButton} href={publicHref} target="_blank" rel="noreferrer">Ver en El Hilo se mueve ↗</Link> : null}</div>
        </div>
      </header>

      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}
      {newsNeedsTenseReview(content, data.today) ? <div className={styles.readOnlyNotice} role="note"><strong>Revisa el texto:</strong> la fecha del acto ({content.event_date}) ya pasó. En la web la noticia ya muestra «Ya celebrado»; conviene pasar a pasado lo que esté en futuro («se presentará», «estrenará»…).</div> : null}
      {content.status !== 'published' && data.issues.length ? <div className={styles.readOnlyNotice} role="note"><strong>Antes de publicar:</strong> {data.issues.join(' ')}</div> : null}

      <section className={styles.metricGrid} aria-label="Estado de la noticia">
        <article className={styles.metricCard}><span>Protagonista</span><strong>{data.protagonist ? 1 : 0}</strong><small>{data.protagonist ? `${data.protagonist.entity_type === 'band' ? 'Banda' : 'Hermandad'}${data.protagonist.status === 'published' ? ' publicada' : ' sin publicar'}` : 'Sin seleccionar'}</small></article>
        <article className={styles.metricCard}><span>Fichas</span><strong>{data.relations.length}</strong><small>relacionadas</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{data.sources.length}</strong><small>enlazadas</small></article>
        <article className={styles.metricCard}><span>Para publicar</span><strong>{data.issues.length}</strong><small>{data.issues.length === 1 ? 'dato pendiente' : 'datos pendientes'}</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Noticia</span><h2>Contenido y publicación</h2></div><p>La fecha de publicación decide cuándo se muestra; si es futura, la noticia queda programada.</p></div>
        <form action={updateNewsAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="content_id" value={content.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Titular</span><input name="title" required maxLength={160} defaultValue={content.title} /></label>
            <label><span>Identificador (enlace)</span><input name="slug" required defaultValue={content.slug || ''} pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Minúsculas, números y guiones" /></label>
            <label><span>Etiqueta</span><input name="news_kind" list="news-kind-suggestions" defaultValue={content.news_kind || ''} placeholder="Cambio, Nombramiento…" /><datalist id="news-kind-suggestions">{NEWS_KIND_SUGGESTIONS.map((item) => <option key={item} value={item} />)}</datalist></label>
            <EntityPicker className={styles.fieldWide} name="protagonist_entity_id" items={data.protagonistOptions} label="Hermandad o banda protagonista" placeholder="Buscar Hermandad o banda…" emptyLabel="Selecciona una Hermandad o banda" required={false} defaultValue={data.protagonist?.id || ''} />
            <label><span>Protagonista sin ficha <small>(si no hay Hermandad o banda)</small></span><input name="subject_label" defaultValue={content.subject_label || ''} placeholder="Consejo de Hermandades de Sevilla" /></label>
            <label><span>Tipo del protagonista sin ficha</span><input name="subject_kind" defaultValue={content.subject_kind || ''} placeholder="Sección de Gloria" /></label>
            <label><span>Tema</span><select name="news_topic" defaultValue={content.news_topic || ''}><option value="">Elige un tema</option>{NEWS_TOPICS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Localidad</span><select name="municipality_id" defaultValue={content.municipality_id || ''}><option value="">Elige una localidad</option>{data.municipalities.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label><span>Fecha del anuncio</span><input name="announced_on" type="date" max={data.today} defaultValue={content.announced_on || ''} /></label>
            <label><span>Fecha de publicación</span><input name="publish_date" type="date" defaultValue={content.publish_date || ''} /></label>
            <label><span>Fecha del acto <small>(opcional)</small></span><input name="event_date" type="date" defaultValue={content.event_date || ''} aria-describedby="event-date-help" /><small id="event-date-help">El día en que ocurre lo que anuncia la noticia (estreno, concierto, cierre de una exposición). Cuando pase, la web mostrará «Ya celebrado» y aquí verás un aviso para revisar el texto.</small></label>
            <label className={styles.fieldWide}><span>Entradilla</span><textarea name="summary" rows="2" maxLength={400} defaultValue={content.summary || ''} /></label>
            <label className={styles.fieldWide}><span>Contexto</span><textarea name="body" rows="6" defaultValue={content.body || ''} placeholder="Antecedentes, qué cambia y lo que todavía no se sabe." /></label>
            <label className={styles.fieldWide}><span>Con efecto desde</span><input name="effective_label" defaultValue={content.effective_label || ''} placeholder="Martes Santo de 2027" /></label>
            <label><span>Enlace «Descubre» · texto</span><input name="discover_label" defaultValue={content.discover_label || ''} placeholder="Descubre la historia musical de…" /></label>
            <label><span>Enlace «Descubre» · ruta interna</span><input name="discover_href" defaultValue={content.discover_href || ''} placeholder="/hermandades/san-benito#musica" /></label>
            <label><span>Firma</span><input name="author_name" defaultValue={content.author_name || ''} /></label>
            <label><span>Estado editorial</span><select name="status" defaultValue={content.status}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicada</option><option value="archived">Archivada</option></select></label>
          </div>
          <div className={styles.formActions}><small>{content.status === 'published' ? 'El identificador no puede cambiar mientras esté publicada: rompería los enlaces compartidos.' : 'Al elegir «Publicada» se comprueba que no falte nada.'}</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar noticia</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Tira del hilo</span><h2>Fichas relacionadas</h2></div><p>Hermandades, Bandas, Imágenes, Pasos, Personas o Marchas que forman parte de la noticia. Solo se enlazan las que están publicadas.</p></div>
        <div className={styles.editorStack}>
          {data.relations.map((item) => <article className={styles.editorItem} key={item.id}>
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.typeLabel}{item.entity?.status && item.entity.status !== 'published' ? ' · sin publicar' : ''}</span><h3>{item.entity?.name || 'Ficha no disponible'}</h3></div></div>
            {canEdit && item.isEditable ? <form action={updateNewsRelationAction} className={styles.editorForm}><input type="hidden" name="content_id" value={content.id} /><input type="hidden" name="link_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Papel en la noticia</span><input name="role" required defaultValue={item.notes || ''} /></label></div><div className={styles.formActions}><button className={styles.secondaryButton} type="submit">Guardar papel</button></div></form> : <p className={styles.emptyText}>{item.notes || item.relation_type}</p>}
            {isAdmin && item.isEditable ? <form action={removeNewsRelationAction} className={styles.archiveForm}><input type="hidden" name="content_id" value={content.id} /><input type="hidden" name="link_id" value={item.id} /><button type="submit">Retirar ficha</button></form> : null}
          </article>)}
          {canEdit ? <form action={addNewsRelationAction} className={`${styles.editorItem} ${styles.editorForm}`}>
            <input type="hidden" name="content_id" value={content.id} />
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir ficha</h3></div></div>
            <div className={styles.formGrid}>
              <EntityPicker className={styles.fieldWide} name="entity_id" items={data.relationOptions} label="Ficha" placeholder="Buscar Hermandad, Banda, Imagen, Paso, Persona o Marcha…" emptyLabel="Selecciona una ficha" />
              <label className={styles.fieldWide}><span>Papel en la noticia</span><input name="role" required placeholder="Desde 2027 · Paso de palio · Nuevo capataz…" /></label>
            </div>
            <div className={styles.formActions}><button className={styles.primaryButton} type="submit">Relacionar ficha</button></div>
          </form> : null}
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación</span><h2>Fuentes</h2></div><p>Al menos una fuente con enlace https. Si la URL ya existe en el archivo, se reutiliza.</p></div>
        <div className={styles.editorStack}>
          {data.sources.map((item) => <article className={styles.editorItem} key={item.id}>
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.source?.source_type || 'Fuente'}</span><h3>{item.source?.url ? <a href={item.source.url} target="_blank" rel="noopener noreferrer">{item.source?.name || item.source.url} ↗</a> : item.source?.name || 'Fuente no disponible'}</h3></div></div>
            {isAdmin ? <form action={removeNewsSourceAction} className={styles.archiveForm}><input type="hidden" name="content_id" value={content.id} /><input type="hidden" name="link_id" value={item.id} /><button type="submit">Retirar fuente</button></form> : null}
          </article>)}
          {canEdit ? <form action={addNewsSourceAction} className={`${styles.editorItem} ${styles.editorForm}`}>
            <input type="hidden" name="content_id" value={content.id} />
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva fuente</span><h3>Añadir fuente</h3></div></div>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Título</span><input name="name" required placeholder="El Pespunte · 6 de octubre de 2026" /></label>
              <label className={styles.fieldWide}><span>Enlace</span><input name="url" type="url" required placeholder="https://…" /></label>
              <label><span>Tipo</span><select name="source_type" defaultValue="Prensa digital">{SOURCE_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label><span>Medio o autor</span><input name="author_or_publisher" /></label>
            </div>
            <div className={styles.formActions}><button className={styles.primaryButton} type="submit">Enlazar fuente</button></div>
          </form> : null}
        </div>
      </section>
    </div>
  )
}
