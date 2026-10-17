import Image from 'next/image'
import Link from 'next/link'
import { hiloDayLabel, HILO_TOPIC_LABELS } from '@/lib/hilo-movements'
import { newsShare } from '@/lib/share'
import ShareActions from '@/components/ShareActions'
import styles from './HiloMovements.module.css'

const archivePhotos = {
  'cigarreras-soberana-entrega-panaderos-2026': { src: '/bandas/las-cigarreras/cigarreras-corneta.jpg', alt: 'Corneta y paño bordado de Las Cigarreras' },
  'san-esteban-santa-ana-2027': { src: '/hermandades/san-esteban/cabecera-cortejo.jpg', alt: 'Cruz de guía y nazarenos de San Esteban' },
  'baratillo-continuidad-musical-2027': { src: '/bandas/banda-del-sol/formacion-baratillo-2026.jpg', alt: 'La Banda del Sol tras el paso de la Piedad del Baratillo' },
}

// Foto de la noticia: la de archivo seleccionada a mano, si existe; si no, la de
// cabecera de la ficha del protagonista (Hermandad o banda), con su crédito.
export function hiloMovementPhoto(item = {}) {
  if (archivePhotos[item.id]) return { ...archivePhotos[item.id], credit: '', focusPosition: '50% 50%', archive: true, caption: 'Imagen de archivo' }
  if (item.cover?.path) {
    const name = item.protagonist?.label || 'la noticia'
    return { src: item.cover.path, alt: item.cover.alt || `Fotografía de ${name}`, credit: item.cover.credit || '', focusPosition: item.cover.focusPosition || '50% 50%', archive: true, caption: `Imagen de la ficha de ${name}` }
  }
  return null
}

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
export default function HiloMovementCards({ items, compact = false, headingLevel = 3, featured = false }) {
  const Heading = `h${headingLevel}`
  return <ol className={compact ? styles.compactList : featured ? styles.leadList : styles.list}>
    {items.map((item) => <li key={item.id}>
      <article className={`${styles.chapter} ${featured ? styles.featured : ''}`} id={compact ? undefined : item.id} data-hilo-movement={item.id}>
        {!compact ? <MovementVisual item={item} featured={featured} sizes={featured ? '(max-width: 760px) 100vw, 45vw' : '(max-width: 760px) 100vw, 40vw'} /> : null}
        <div className={styles.cardBody}>
          <header className={styles.identity}>
            {compact && item.crestPath ? <Image className={styles.crest} src={item.crestPath} alt="" width={56} height={64} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : null}
            <div><>{item.protagonist.href ? <Link href={item.protagonist.href} className={styles.brotherhood} prefetch={false}>{item.protagonist.label}</Link> : <strong className={styles.brotherhood}>{item.protagonist.label}</strong>}{item.protagonist.kind ? <span className={styles.locality}>{item.protagonist.kind}</span> : null}</><span className={styles.locality}>{item.municipality}</span></div>
            <span className={styles.kind}>{hiloKindLabel(item.kind)}</span>
          </header>
          <div className={styles.story}>
            <p className={styles.date}>{item.announcedOn ? <time dateTime={item.announcedOn}>{hiloDayLabel(item.announcedOn)}</time> : <>Documentado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time></>}</p>
            <Heading><Link href={item.href} prefetch={false} className={styles.titleLink}>{item.title}</Link></Heading>
            <p className={styles.summary}>{item.summary}</p>
            {item.effectiveLabel && !compact ? <p className={styles.effective}><span aria-hidden="true">↳</span> {item.effectiveLabel}</p> : null}
            <Link className={styles.more} href={item.href} prefetch={false}>{compact ? 'Seguir este hilo' : 'Leer la noticia'} <span className={styles.srOnly}>: {item.title}</span><span aria-hidden="true">→</span></Link>
            {!compact ? <ShareActions compact share={newsShare(item)} contentType="noticia" analytics={{ topic: item.topic, municipality: item.municipality }} /> : null}
          </div>
        </div>
      </article>
    </li>)}
  </ol>
}
