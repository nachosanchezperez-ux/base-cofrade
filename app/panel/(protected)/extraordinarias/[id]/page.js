import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelExtraordinaryOuting } from '@/lib/panel/extraordinary-outings'
import {
  removeExtraordinaryImageAction,
  removeOutingMediaAction,
  saveExtraordinaryImageAction,
  saveOutingMediaAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'
import extraStyles from '../extraordinarias.module.css'
import mediaStyles from './media.module.css'

const EVENT_STATUS_LABELS = {
  announced: 'Anunciada',
  held: 'Celebrada',
  cancelled: 'Cancelada',
}

const SAVED_MESSAGES = {
  image: 'Fotografía principal guardada correctamente.',
  removed: 'Fotografía principal retirada.',
  poster: 'Cartel oficial guardado correctamente.',
  gallery: 'Imagen añadida a la galería.',
  'media-removed': 'Recurso multimedia retirado.',
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

function RightsSelect({ name = 'rights_status', disabled = false }) {
  return (
    <select name={name} defaultValue="authorized" disabled={disabled}>
      <option value="authorized">Autorizada para publicación</option>
      <option value="owned">Propiedad de Hilo Cofrade</option>
      <option value="licensed">Con licencia</option>
      <option value="public_domain">Dominio público</option>
    </select>
  )
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
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta extraordinaria como colaborador. Un editor debe modificar la multimedia.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la extraordinaria">
        <article className={styles.metricCard}><span>Foto principal</span><strong>{data.hero_image_path ? 'Sí' : 'No'}</strong><small>Home + directorio + ficha</small></article>
        <article className={styles.metricCard}><span>Cartel</span><strong>{data.poster ? 'Sí' : 'No'}</strong><small>cartel oficial</small></article>
        <article className={styles.metricCard}><span>Galería</span><strong>{data.gallery.length}</strong><small>imágenes publicadas</small></article>
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
              <input name="hero_image_alt" defaultValue={data.hero_image_alt || ''} placeholder={`Ej. ${data.title || 'Titular'} durante su salida extraordinaria`} required disabled={!canEdit} />
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

      <section className={styles.editorSection} id="cartel">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Pieza oficial</span><h2>Cartel</h2></div>
          <p>Espacio vertical para el cartel oficial o pieza anunciadora de la extraordinaria.</p>
        </div>

        <div className={mediaStyles.mediaWorkspace}>
          <article className={`${styles.panelCard} ${mediaStyles.mediaPreview}`}>
            <span className={mediaStyles.slotKicker}>Vista actual</span>
            <div className={mediaStyles.posterFrame}>
              {data.poster?.path ? (
                <Image src={data.poster.path} alt={data.poster.alt || 'Cartel de la extraordinaria'} fill sizes="(max-width: 620px) calc(100vw - 48px), 420px" />
              ) : (
                <div className={mediaStyles.emptyPreview}><strong>1080 × 1350</strong><span>Cartel oficial</span></div>
              )}
            </div>
            {data.poster ? (
              <div className={mediaStyles.currentMeta}>
                <strong>{data.poster.credit || 'Sin crédito'}</strong>
                <small>{data.poster.alt}</small>
              </div>
            ) : null}
          </article>

          <aside className={`${styles.panelCard} ${mediaStyles.guideCard}`}>
            <span className={styles.eyebrow}>Medida recomendada</span>
            <h3>Cartel vertical</h3>
            <div className={mediaStyles.measure}>
              <strong>1080 × 1350 px</strong>
              <span>4:5 · mínimo 800 × 1000 px</span>
            </div>
            <div className={mediaStyles.usageNote}>
              <div><b>Ficha pública</b><span>Se muestra completo, sin recortar.</span></div>
              <div><b>Móvil</b><span>Conserva la proporción vertical.</span></div>
            </div>
            <p>Evita subir capturas con márgenes del móvil. Si el cartel original tiene otra proporción vertical, se respetará completo dentro del marco.</p>
            <ul className={mediaStyles.guideList}>
              <li>JPG, WEBP, PNG o AVIF.</li>
              <li>Recomendado: 1–4 MB.</li>
              <li>Texto del cartel legible a 1080 px de ancho.</li>
            </ul>
          </aside>
        </div>

        <form action={saveOutingMediaAction} className={`${styles.panelCard} ${styles.editorForm} ${mediaStyles.slotForm}`}>
          <input type="hidden" name="outing_id" value={data.id} />
          <input type="hidden" name="role" value="poster" />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>{data.poster ? 'Reemplazar cartel' : 'Subir cartel'}</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Descripción accesible</span><input name="alt_text" required placeholder={`Cartel de la extraordinaria de ${data.title || 'la salida'}`} disabled={!canEdit} /></label>
            <label><span>Crédito / autor</span><input name="credit" placeholder="Autor / Hermandad" disabled={!canEdit} /></label>
            <label><span>Derechos</span><RightsSelect disabled={!canEdit} /></label>
          </div>
          <div className={styles.formActions}><small>El cartel aparecerá en su propia sección de la guía.</small><button className={styles.primaryButton} type="submit" disabled={!canEdit}>{data.poster ? 'Reemplazar cartel' : 'Subir cartel'}</button></div>
        </form>

        {data.poster && canEdit ? (
          <form action={removeOutingMediaAction} className={mediaStyles.removeInline}>
            <input type="hidden" name="outing_id" value={data.id} />
            <input type="hidden" name="outing_media_id" value={data.poster.id} />
            <span>Retira el cartel de la ficha pública.</span>
            <button type="submit">Retirar cartel</button>
          </form>
        ) : null}
      </section>

      <section className={styles.editorSection} id="galeria">
        <div className={mediaStyles.galleryHead}>
          <div><span className={styles.eyebrow}>Archivo visual</span><h2>Galería</h2></div>
          <p>Fotografías complementarias de la extraordinaria: salida, recorrido, paso, detalles o momentos destacados.</p>
        </div>

        {data.gallery.length ? (
          <div className={mediaStyles.galleryGrid}>
            {data.gallery.map((item) => (
              <article className={mediaStyles.galleryItem} key={item.id}>
                <div className={mediaStyles.galleryImage}><Image src={item.path} alt={item.alt} fill sizes="(max-width: 620px) calc(100vw - 48px), 30vw" /></div>
                <div className={mediaStyles.galleryCopy}>
                  <strong>{item.credit || 'Sin crédito'}</strong>
                  <small>{item.alt}</small>
                  {canEdit ? (
                    <form action={removeOutingMediaAction}>
                      <input type="hidden" name="outing_id" value={data.id} />
                      <input type="hidden" name="outing_media_id" value={item.id} />
                      <button type="submit">Retirar de galería</button>
                    </form>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : <div className={mediaStyles.galleryEmpty}>Todavía no hay imágenes complementarias publicadas.</div>}

        <div className={mediaStyles.mediaWorkspace} style={{ marginTop: 18 }}>
          <form action={saveOutingMediaAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="outing_id" value={data.id} />
            <input type="hidden" name="role" value="gallery" />
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Añadir fotografía</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required disabled={!canEdit} /></label>
              <label className={styles.fieldWide}><span>Descripción accesible</span><input name="alt_text" required placeholder="Describe qué aparece en la fotografía" disabled={!canEdit} /></label>
              <label><span>Crédito / autor</span><input name="credit" placeholder="Fotografía · Autor / Hermandad" disabled={!canEdit} /></label>
              <label><span>Derechos</span><RightsSelect disabled={!canEdit} /></label>
            </div>
            <div className={styles.formActions}><small>Máximo 12 imágenes por extraordinaria.</small><button className={styles.primaryButton} type="submit" disabled={!canEdit}>Añadir a galería</button></div>
          </form>

          <aside className={`${styles.panelCard} ${mediaStyles.guideCard}`}>
            <span className={styles.eyebrow}>Medida recomendada</span>
            <h3>Fotografía de galería</h3>
            <div className={mediaStyles.measure}>
              <strong>1600 × 1200 px</strong>
              <span>4:3 · mínimo 1200 × 900 px</span>
            </div>
            <p>Es la proporción que mejor funciona en la cuadrícula. Las fotos verticales también se admiten, pero el listado usa un recorte 4:3 y la ficha podrá abrirlas completas.</p>
            <ul className={mediaStyles.guideList}>
              <li>Prioriza nitidez sobre tamaño extremo.</li>
              <li>Recomendado: 1–4 MB.</li>
              <li>No añadas marcos ni textos sobre la fotografía.</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  )
}
