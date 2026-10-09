import Image from 'next/image'
import Link from 'next/link'
import { hiloDayLabel } from '@/lib/hilo-movements'
import styles from './HiloMovements.module.css'

export default function HiloMovementCards({ items, compact = false, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`
  return <ol className={compact ? styles.compactList : styles.list}>
    {items.map((item) => <li key={item.id}>
      <article className={styles.chapter} id={compact ? undefined : item.id} data-hilo-movement={item.id}>
        <header className={styles.identity}>
          {item.crestPath ? <Image className={styles.crest} src={item.crestPath} alt="" width={56} height={64} unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)} /> : <span className={styles.threadMark} aria-hidden="true">H</span>}
          <div><span className={styles.locality}>{item.municipality}</span><span className={styles.kind}>{item.kind === 'Cambio' ? 'Relevo de sones' : item.kind === 'Renovación' ? 'Sones que siguen' : item.kind}</span><Link href={item.brotherhood.href} className={styles.brotherhood} prefetch={false}>{item.brotherhood.label}</Link></div>
        </header>
        <div className={styles.story}>
          <p className={styles.date}>{item.announcedOn ? <>Anunciado el <time dateTime={item.announcedOn}>{hiloDayLabel(item.announcedOn)}</time></> : <>Documentado el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time></>}</p>
          <Heading>{compact ? <Link href={item.href} prefetch={false}>{item.title}</Link> : item.title}</Heading>
          <p className={styles.summary}>{item.summary}</p>
          {compact ? <>
            {item.effectiveLabel ? <p className={styles.effective}>{item.effectiveLabel}</p> : null}
            <p className={styles.compactConnections}>En este hilo: {item.relations.map((relation) => relation.label).join(' · ')}</p>
            <Link className={styles.more} href={item.href} prefetch={false}>Seguir este hilo <span aria-hidden="true">→</span></Link>
          </> : <>
            <p className={styles.context}>{item.context}</p>
            {item.effectiveLabel ? <p className={styles.effective}>Para {item.effectiveLabel}</p> : null}
            {item.relations.length ? <><h3 className={styles.connectionTitle}>En este hilo</h3><ul className={styles.connections} aria-label={`Protagonistas relacionados con ${item.brotherhood.label}`}>
              {item.relations.map((relation) => <li key={relation.id}><Link href={relation.href} prefetch={false}><span>{relation.role}</span><strong>{relation.label}</strong><b aria-hidden="true">↗</b></Link></li>)}
            </ul></> : null}
            {item.discover ? <div className={styles.discover}><span>Tira del hilo</span><Link href={item.discover.href} prefetch={false}>{item.discover.label} <b aria-hidden="true">→</b></Link></div> : null}
            <details className={styles.sources}><summary>Fuentes y documentación</summary><ul>{item.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noopener noreferrer">{source.label} <span className={styles.srOnly}>(se abre en otra pestaña)</span></a></li>)}</ul><p>Incorporado a Hilo Cofrade el <time dateTime={item.documentedOn}>{hiloDayLabel(item.documentedOn)}</time>. Esta fecha no sustituye a la del anuncio.</p></details>
          </>}
        </div>
      </article>
    </li>)}
  </ol>
}
