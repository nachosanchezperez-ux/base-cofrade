import Image from 'next/image'
import Link from 'next/link'
import { hiloDayLabel, hiloPassedLabel, HILO_TOPIC_LABELS } from '@/lib/hilo-movements'
import { newsShare } from '@/lib/share'
import { hiloMovementPhoto } from '@/lib/hilo-movement-photo'
import ShareActions from '@/components/ShareActions'
import styles from './HiloMovements.module.css'

// La elección de foto vive en un módulo puro, compartido con la portada.
export { hiloMovementPhoto }

function MovementVisual({ item, featured, sizes }) {
  const photo = hiloMovementPhoto(item)
  return <div className={`${styles.visual} ${photo ? styles.photographic : ''}`}>
    {photo ? <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className={styles.photo} style={{ objectPosition: photo.focusPosition }} /> : <>
      <svg className={styles.threadArt} viewBox="0 0 400 260" aria-hidden="true"><path d="M-20 190H90c100 0 20-140 125-140s15 160 100 160h105" /><circle cx="90" cy="190" r="6" /><circle cx="315" cy="210" r="6" /></svg>
      {item.crestPath ? <Image className={styles.visualCrest} src={item.crestPath} alt="" width={150} height={180} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : <span className={styles.visualWord} aria-hidden="true">Hilo</span>}
    </>}
    <span className={styles.visualLabel}>{featured ? 'Abre el hilo' : HILO_TOPIC_LABELS[item.topic]}</span>
    {photo?.archive ? <span className={styles.archiveLabel}>Imagen de archivo</span> : null}
  </div>
}

export function hiloKindLabel(kind = '') {
  return kind === 'Cambio' ? 'Relevo de sones' : kind === 'Renovación' ? 'Sones que siguen' : kind
}

// Tarjetas del índice y de las fichas. El texto completo, las relaciones y las
// fuentes viven en la página de cada noticia (item.href); aquí, lo esencial.
// `secondary` (índice, #1253): segundo nivel, más discreto que la principal y
// más rico que el archivo: miniatura lateral, titular menor y entradilla breve.
// Sin botones de compartir: siguen en la página de cada noticia.
export default function HiloMovementCards({ items, compact = false, headingLevel = 3, featured = false, secondary = false, anchors = !compact }) {
  const Heading = `h${headingLevel}`
  const listClass = compact ? styles.compactList : featured ? styles.leadList : secondary ? `${styles.list} ${styles.secondaryList}` : styles.list
  const sizes = featured ? '(max-width: 760px) 100vw, 45vw' : secondary ? '(max-width: 760px) 104px, 180px' : '(max-width: 760px) 100vw, 40vw'
  return <ol className={listClass}>
    {items.map((item) => {
      // En el segundo nivel la miniatura solo aparece si hay foto real; si no,
      // el escudo va pequeño junto al protagonista (sin ilustración repetida).
      const thumbless = secondary && !hiloMovementPhoto(item)
      return <li key={item.id}>
      <article className={`${styles.chapter} ${featured ? styles.featured : ''} ${secondary ? styles.secondaryCard : ''} ${thumbless ? styles.secondaryNoPhoto : ''}`} id={anchors ? item.id : undefined} data-hilo-movement={item.id}>
        {!compact && !thumbless ? <MovementVisual item={item} featured={featured} sizes={sizes} /> : null}
        <div className={styles.cardBody}>
          <header className={styles.identity}>
            {(compact || thumbless) && item.crestPath ? <Image className={styles.crest} src={item.crestPath} alt="" width={56} height={64} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : null}
            <div><>{item.protagonist.href ? <Link href={item.protagonist.href} className={styles.brotherhood} prefetch={false}>{item.protagonist.label}</Link> : <strong className={styles.brotherhood}>{item.protagonist.label}</strong>}{item.protagonist.kind ? <span className={styles.locality}>{item.protagonist.kind}</span> : null}</><span className={styles.locality}>{item.municipality}</span></div>
            <span className={styles.kind}>{hiloKindLabel(item.kind)}</span>
          </header>
          <div className={styles.story}>
            <p className={styles.date}>{item.announcedOn ? <time dateTime={item.announcedOn}>{hiloDayLabel(item.announcedOn)}</time> : <>Documentado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time></>}{item.eventPassed ? <span className={styles.passed}>{hiloPassedLabel(item)}</span> : null}</p>
            <Heading><Link href={item.href} prefetch={false} className={styles.titleLink}>{item.title}</Link></Heading>
            <p className={styles.summary}>{item.summary}</p>
            {item.effectiveLabel && !compact && !secondary ? <p className={styles.effective}><span aria-hidden="true">↳</span> {item.effectiveLabel}</p> : null}
            {/* En el segundo nivel el titular ya es el enlace: sin «Leer la noticia» repetido. */}
            {!secondary ? <Link className={styles.more} href={item.href} prefetch={false}>{compact ? 'Seguir este hilo' : 'Leer la noticia'} <span className={styles.srOnly}>: {item.title}</span><span aria-hidden="true">→</span></Link> : null}
            {!compact && !secondary ? <ShareActions compact share={newsShare(item)} contentType="noticia" analytics={{ topic: item.topic, municipality: item.municipality }} /> : null}
          </div>
        </div>
      </article>
    </li>
    })}
  </ol>
}
