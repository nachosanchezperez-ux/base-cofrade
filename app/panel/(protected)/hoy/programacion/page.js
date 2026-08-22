import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getHomeEditorialPanelData } from '@/lib/panel/home-editorial'
import { archiveDailyOverrideAction, saveDailyOverrideAction } from '../actions'
import { saveEditorialDailyOverrideAction } from './actions'
import { EffectiveHomePreview, HomeDateFilter, STATUS_LABELS, StatusSelect } from '@/components/panel/home/HomeEditorialPrimitives'
import styles from '@/app/panel/panel.module.css'

const SAVED_MESSAGES = {
  override: 'La programación manual de la Home se ha guardado.',
  'override-archived': 'Ese bloque vuelve a selección automática para la fecha indicada.',
}

function OverrideShell({ title, eyebrow, hint, item, data, canEdit, children, contentType, order, saveAction = saveDailyOverrideAction }) {
  const isActive = item && item.status !== 'archived'
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{eyebrow}</span><h3>{title}</h3><p>{hint}</p></div>
        {item ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      {canEdit ? (
        <form action={saveAction} className={styles.editorForm}>
          <input type="hidden" name="override_id" value={item?.id || ''} />
          <input type="hidden" name="publish_date" value={data.selectedDate} />
          {contentType ? <input type="hidden" name="content_type" value={contentType} /> : null}
          <input type="hidden" name="sort_order" value={order} />
          {children}
          <div className={styles.formGrid}>
            <label><span>Estado</span><StatusSelect defaultValue={item?.status === 'archived' ? 'published' : item?.status || 'published'} /></label>
            <label className={styles.fieldWide}><span>Motivo interno de la selección</span><textarea name="reason" rows="2" defaultValue={item?.reason || ''} placeholder="Por qué se fuerza este contenido para esta fecha" /></label>
          </div>
          <div className={styles.formActions}><small>Solo un override publicado sustituye a la selección automática.</small><button className={styles.primaryButton} type="submit">{isActive ? 'Actualizar selección' : 'Forzar para esta fecha'}</button></div>
        </form>
      ) : null}
      {canEdit && isActive ? (
        <form action={archiveDailyOverrideAction} className={styles.archiveForm}>
          <input type="hidden" name="override_id" value={item.id} /><input type="hidden" name="publish_date" value={data.selectedDate} />
          <button type="submit">Volver a selección automática</button>
        </form>
      ) : null}
    </article>
  )
}

export const metadata = { title: 'Programación · Hoy · Panel' }

export default async function HomeProgrammingPage({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getHomeEditorialPanelData({ date: String(query?.fecha || '') }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const ephemeris = data.overrideByType.get('ephemeris') || null
  const march = data.overrideByType.get('march') || null
  const editorial = data.editorialOverride

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Calendario editorial</span><h1>Programación diaria</h1><p>Revisa qué saldrá realmente y fuerza únicamente las excepciones necesarias.</p></div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Link className={styles.secondaryButton} href={`/panel/hoy/banco?fecha=${data.selectedDate}`}>Banco editorial</Link><Link className={styles.secondaryButton} href="/" target="_blank" rel="noreferrer">Abrir Home ↗</Link></div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {data.editorialOverrideConflict ? <div className={styles.readOnlyNotice}>Hay más de un override editorial antiguo activo para esta fecha. Al guardar el bloque «Contenido editorial», el Panel conservará uno solo y archivará los demás.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}
      <HomeDateFilter selectedDate={data.selectedDate} />

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Resultado efectivo</span><h2>{data.selectedDate}</h2></div><p>Esta es la salida real prevista después de aplicar los overrides publicados.</p></div>
        <EffectiveHomePreview effective={data.effective} />
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Excepciones manuales</span><h2>Forzar contenido</h2></div><p>Efeméride, contenido editorial y Marcha admiten override. El Hilo para descubrir permanece automático.</p></div>
        <div className={styles.editorStack}>
          <OverrideShell title="Efeméride" eyebrow={ephemeris?.status === 'published' ? 'Programación manual' : 'Modo automático'} hint="Sin override, la Home elige una efeméride publicada por día y mes." item={ephemeris} data={data} canEdit={canEdit} contentType="ephemeris" order={0}>
            <div className={styles.formGrid}>
              <EntityPicker className={styles.fieldWide} name="event_entity_id" items={data.eventOptions} label="Acontecimiento" placeholder="Buscar efeméride…" emptyLabel="Selecciona un Acontecimiento" defaultValue={ephemeris?.event_entity_id || ''} />
              <label className={styles.fieldWide}><span>Título visible</span><input name="title" defaultValue={ephemeris?.title || ''} required /></label>
              <label className={styles.fieldWide}><span>Resumen visible</span><textarea name="summary" rows="3" defaultValue={ephemeris?.summary || ''} /></label>
            </div>
          </OverrideShell>

          <OverrideShell title="Contenido editorial" eyebrow={editorial?.status === 'published' ? 'Programación manual' : 'Modo automático'} hint="La Home tiene un único slot editorial: muestra un Dato Cofrade o una Curiosidad, nunca ambos a la vez." item={editorial} data={data} canEdit={canEdit} order={1} saveAction={saveEditorialDailyOverrideAction}>
            <div className={styles.formGrid}>
              <EntityPicker className={styles.fieldWide} name="editorial_content_id" items={data.editorialOptions} label="Contenido del Banco (recomendado)" emptyLabel="Sin contenido del Banco · usar modo manual" required={false} defaultValue={editorial?.editorial_content_id || ''} />
              <label><span>Tipo manual</span><select name="content_type" defaultValue={editorial?.content_type || 'curiosity'}><option value="fact">Dato Cofrade</option><option value="curiosity">Curiosidad</option></select></label>
              <EntityPicker className={styles.fieldWide} name="entity_id" items={data.entityOptions} label="Entidad relacionada (solo modo manual)" emptyLabel="Sin entidad concreta" required={false} defaultValue={editorial?.entity_id || ''} />
              <label className={styles.fieldWide}><span>Título manual</span><input name="title" defaultValue={editorial?.title || ''} placeholder="Solo si no seleccionas contenido del Banco" /></label>
              <label className={styles.fieldWide}><span>Resumen manual</span><textarea name="summary" rows="3" defaultValue={editorial?.summary || ''} placeholder="Solo si no seleccionas contenido del Banco" /></label>
            </div>
          </OverrideShell>

          <article className={styles.editorItem}>
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Siempre automático</span><h3>Hilo para descubrir</h3><p>Se selecciona a partir de relaciones reales del grafo evitando repetir las entidades principales de Efeméride y Contenido editorial.</p></div><span className={`${styles.statusBadge} ${styles.published}`}>Automático</span></div>
            <p className={styles.emptyText}>Resultado actual: <strong>{data.effective.discovery.title}</strong></p>
          </article>

          <OverrideShell title="Marcha del día" eyebrow={march?.status === 'published' ? 'Programación manual' : 'Modo automático'} hint="Sin override, rota entre Marchas publicadas, elegibles y con escucha disponible." item={march} data={data} canEdit={canEdit} contentType="march" order={3}>
            <div className={styles.formGrid}>
              <EntityPicker className={styles.fieldWide} name="march_entity_id" items={data.marchOptions} label="Marcha" placeholder="Buscar Marcha…" emptyLabel="Selecciona una Marcha" defaultValue={march?.march_entity_id || ''} />
            </div>
          </OverrideShell>
        </div>
      </section>
    </div>
  )
}
