import Image from 'next/image'
import Link from 'next/link'
import { hiloDayLabel, HILO_TOPIC_LABELS } from '@/lib/hilo-movements'
import styles from './HiloMovements.module.css'

const archivePhotos = {
  'cigarreras-soberana-entrega-panaderos-2026': { src: '/bandas/las-cigarreras/cigarreras-corneta.jpg', alt: 'Corneta y paño bordado de Las Cigarreras' },
  'san-esteban-santa-ana-2027': { src: '/hermandades/san-esteban/cabecera-cortejo.jpg', alt: 'Cruz de guía y nazarenos de San Esteban' },
  'baratillo-continuidad-musical-2027': { src: '/bandas/banda-del-sol/formacion-baratillo-2026.jpg', alt: 'La Banda del Sol tras el paso de la Piedad del Baratillo' },
}

export default function HiloMovementCards({ items, compact = false, headingLevel = 3, featured = false }) {
  const Heading = `h${headingLevel}`
  const DetailHeading = `h${Math.min(headingLevel + 1, 6)}`
  return <ol className={compact ? styles.compactList : featured ? styles.leadList : styles.list}>
    {items.map((item) => <li key={item.id}>
      <article className={`${styles.chapter} ${featured ? styles.featured : ''}`} id={compact ? undefined : item.id} data-hilo-movement={item.id}>
        {!compact ? <div className={`${styles.visual} ${archivePhotos[item.id] ? styles.photographic : ''}`}>
          {archivePhotos[item.id] ? <Image src={archivePhotos[item.id].src} alt={archivePhotos[item.id].alt} fill sizes="(max-width: 760px) 100vw, 50vw" className={styles.photo} /> : <>
            <svg className={styles.threadArt} viewBox="0 0 400 260" aria-hidden="true"><path d="M-20 190H90c100 0 20-140 125-140s15 160 100 160h105" /><circle cx="90" cy="190" r="6" /><circle cx="315" cy="210" r="6" /></svg>
            {item.crestPath ? <Image className={styles.visualCrest} src={item.crestPath} alt="" width={150} height={180} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : <span className={styles.visualWord} aria-hidden="true">Hilo</span>}
          </>}
          <span className={styles.visualLabel}>{featured ? 'Abre el hilo' : HILO_TOPIC_LABELS[item.topic]}</span>
          {archivePhotos[item.id] ? <span className={styles.archiveLabel}>Imagen de archivo</span> : null}
        </div> : null}
        <div className={styles.cardBody}>
          <header className={styles.identity}>
            {compact && item.crestPath ? <Image className={styles.crest} src={item.crestPath} alt="" width={56} height={64} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : null}
            <div><>{item.protagonist.href ? <Link href={item.protagonist.href} className={styles.brotherhood} prefetch={false}>{item.protagonist.label}</Link> : <strong className={styles.brotherhood}>{item.protagonist.label}</strong>}{item.protagonist.kind ? <span className={styles.locality}>{item.protagonist.kind}</span> : null}</><span className={styles.locality}>{item.municipality}</span></div>
            <span className={styles.kind}>{item.kind === 'Cambio' ? 'Relevo de sones' : item.kind === 'Renovación' ? 'Sones que siguen' : item.kind}</span>
          </header>
          <div className={styles.story}>
            <p className={styles.date}>{item.announcedOn ? <time dateTime={item.announcedOn}>{hiloDayLabel(item.announcedOn)}</time> : <>Documentado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time></>}</p>
            <Heading>{compact ? <Link href={item.href} prefetch={false}>{item.title}</Link> : item.title}</Heading>
            <p className={styles.summary}>{item.summary}</p>
            {item.effectiveLabel ? <p className={styles.effective}><span aria-hidden="true">↳</span> {item.effectiveLabel}</p> : null}
            {compact ? <Link className={styles.more} href={item.href} prefetch={false}>Seguir este hilo <span aria-hidden="true">→</span></Link> : <>
              {item.discover ? <Link className={styles.discover} href={item.discover.href} prefetch={false}>{item.discover.label} <span aria-hidden="true">↗</span></Link> : null}
              <details className={styles.storyDetails}><summary>El contexto y sus protagonistas <span aria-hidden="true">+</span></summary>
                <p className={styles.context}>{item.context}</p>
                {item.relations.length ? <><DetailHeading className={styles.connectionTitle}>Tira del hilo</DetailHeading><ul className={styles.connections} aria-label={`Protagonistas relacionados con ${item.protagonist.label}`}>
                  {item.relations.map((relation) => <li key={relation.id}><Link href={relation.href} prefetch={false}><span>{relation.role}</span><strong>{relation.label}</strong><b aria-hidden="true">↗</b></Link></li>)}
                </ul></> : null}
              </details>
              <details className={styles.sources}><summary>Fuentes y documentación <span aria-hidden="true">+</span></summary><ul>{item.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <span className={styles.srOnly}>(se abre en otra pestaña)</span></a></li>)}</ul><p>Incorporado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time>. Esta fecha no sustituye a la del anuncio.</p></details>
            </>}
          </div>
        </div>
      </article>
    </li>)}
  </ol>
}
