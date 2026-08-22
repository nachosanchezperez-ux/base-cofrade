import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelExtraordinaryOuting } from '@/lib/panel/extraordinary-outings'
import { removeExtraordinaryImageAction, saveExtraordinaryImageAction } from './actions'
import styles from '@/app/panel/panel.module.css'
import extraStyles from '../extraordinarias.module.css'

const EVENT_STATUS_LABELS = {
  announced: 'Anunciada',
  held: 'Celebrada',
  cancelled: 'Cancelada',
}

const SAVED_MESSAGES = {
  image: 'Fotografía principal guardada correctamente.',
  removed: 'Fotografía principal retirada.',
}

function dateLabel(value) {
  if (!value) return 'Fecha por documentar'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

export const metadata = { title: 'Editar extraordinaria · Panel' }

export default async function PanelExtraordinaryEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getPanelExtraordinaryOuting(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const publicHref = data.slug ? `/extraordinarias/${data.slug}` : ''

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/extraordinarias">Extraordinarias</Link>
          <span>→</span>
          <strong>{data.title || 'Editar'}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>{data.municipality || 'Sevilla y provincia'}</span>
            <h1>{data.title || data.outing_type || 'Extraordinaria'}</h1>
            <p>{[dateLabel(data.outing_date), data.organizer_name].filter(Boolean).join(' · ')}</p>
          </div>
          <div className={styles.editorHeaderActions}>
            <span className={`${extraStyles.eventStatus} ${extraStyles[data.event_status] || ''}`}>{EVENT_STATUS_LABELS[data.event_status] || data.event_status}</span>
            {publicHref ? <Link className={styles.secondaryButton} href={publicHref} target="_blank" rel="noreferrer">Ver guía pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta extraordinaria como colaborador. Un editor debe modificar la fotografía.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la extraordinaria">
        <article className={styles.metricCard}><span>Fotografía</span><strong>{data.hero_image_path ? 'Sí' : 'No'}</strong><small>imagen principal</small></article>
        <article className={styles.metricCard}><span>Horarios</span><strong>{data.scheduleCount}</strong><small>hitos documentados</small></article>
        <article className={styles.metricCard}><span>Música</span><strong>{data.musicCount}</strong><small>momentos documentados</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{data.sourceCount}</strong><small>relaciones documentales</small></article>
      </section>

      <section className={styles.editorSection} id="fotografia">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Imagen editorial</span><h2>Fotografía principal</h2></div>
          <p>Una única imagen maestra alimenta la Home, el directorio de Extraordinarias y la guía individual.</p>
        </div>

        <div className={extraStyles.photoWorkspace}>
          <article className={`${styles.panelCard} ${extraStyles.previewCard}`}>
            <div className={extraStyles.previewHeading}>
              <div><span>Vista actual</span><strong>{data.hero_image_path ? 'Fotografía publicada' : 'Sin fotografía'}</strong></div>
              {data.hero_image_path ? <small>El recorte cambia automáticamente según el dispositivo.</small> : null}
            </div>

            <div className={extraStyles.masterPreview}>
              {data.hero_image_path ? (
                <>
                  <Image src={data.hero_image_path} alt={data.hero_image_alt || data.title || 'Fotografía de la extraordinaria'} fill sizes="(max-width: 800px) 100vw, 620px" />
                  <span className={extraStyles.safeArea} aria-hidden="true"><i>zona segura</i></span>
                </>
              ) : (
                <div className={extraStyles.emptyPreview}>
                  <strong>1800 × 1200</strong>
                  <span>Sube aquí la fotografía principal</span>
                </div>
              )}
            </div>

            {data.hero_image_path ? (
              <div className={extraStyles.currentCaption}>
                <span>{data.hero_image_credit || 'Sin crédito'}</span>
                <small>{data.hero_image_alt || 'Sin texto alternativo'}</small>
              </div>
            ) : null}
          </article>

          <aside className={`${styles.panelCard} ${extraStyles.uploadGuide}`}>
            <span className={styles.eyebrow}>Medidas recomendadas</span>
            <h3>Sube una sola foto maestra</h3>
            <div className={extraStyles.masterMeasure}>
              <strong>1800 × 1200 px</strong>
              <span>3:2 · mínimo 1200 × 800 px</span>
            </div>
            <div className={extraStyles.usageGrid}>
              <div><b>Home</b><strong>16:10</strong><span>Recorte horizontal</span></div>
              <div><b>Directorio</b><strong>≈ 5:4</strong><span>Recorte compacto</span></div>
              <div><b>Ficha</b><strong>Flexible</strong><span>Imagen protagonista</span></div>
              <div><b>Móvil</b><strong>≈ 4:3</strong><span>Recorte centrado</span></div>
            </div>
            <p><strong>Zona segura:</strong> coloca el rostro, la imagen o el paso dentro del 70% central. Evita textos, escudos o elementos imprescindibles pegados a los bordes.</p>
            <ul>
              <li>JPG, WEBP, PNG o AVIF.</li>
              <li>Recomendado: 2–5 MB.</li>
              <li>Máximo admitido: 10 MB.</li>
              <li>Preferible fotografía limpia, sin marcos ni textos.</li>
            </ul>
          </aside>
        </div>

        <form action={saveExtraordinaryImageAction} className={`${styles.panelCard} ${styles.editorForm} ${extraStyles.uploadForm}`}>
          <input type="hidden" name="outing_id" value={data.id} />
          <div className={styles.formGrid}>
            <label className={`${styles.fieldWide} ${extraStyles.fileField}`}>
              <span>{data.hero_image_path ? 'Reemplazar fotografía' : 'Subir fotografía'}</span>
              <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required={!data.hero_image_path} disabled={!canEdit} />
              <small>Si ya existe una foto, puedes guardar solo el crédito o el texto alternativo sin seleccionar un archivo nuevo.</small>
            </label>
            <label className={styles.fieldWide}>
              <span>Descripción accesible</span>
              <input name="hero_image_alt" defaultValue={data.hero_image_alt || ''} placeholder={`Ej. ${data.title || 'Titular'} durante su salida extraordinaria`} required={Boolean(data.hero_image_path)} disabled={!canEdit} />
            </label>
            <label className={styles.fieldWide}>
              <span>Crédito de la fotografía</span>
              <input name="hero_image_credit" defaultValue={data.hero_image_credit || ''} placeholder="Fotografía · Autor / Hermandad" disabled={!canEdit} />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>La nueva imagen se publica en los tres espacios automáticamente.</small>
            <button className={styles.primaryButton} type="submit" disabled={!canEdit}>{data.hero_image_path ? 'Guardar / reemplazar foto' : 'Subir fotografía'}</button>
          </div>
        </form>

        {data.hero_image_path && canEdit ? (
          <form action={removeExtraordinaryImageAction} className={extraStyles.removeForm}>
            <input type="hidden" name="outing_id" value={data.id} />
            <span>Retira la fotografía de Home, directorio y ficha sin alterar el resto de datos de la extraordinaria.</span>
            <button type="submit">Retirar fotografía</button>
          </form>
        ) : null}
      </section>
    </div>
  )
}
