import Image from 'next/image'
import Link from 'next/link'
import OpenUpdatesButton from './OpenUpdatesButton'
import { latestThreadsByDay } from '@/lib/home-latest-threads'
import styles from './HomeKnowledgeThreads.module.css'

// «Últimos hilos incorporados» (dentro de «Descubre Hilo Cofrade»): lo que ha
// entrado en la enciclopedia, por días, una línea por novedad. Cada línea dice
// qué ha pasado, sobre qué ficha y el dato concreto; el escudo o la foto ayudan
// a reconocerla de un vistazo. Si el mismo día se actualizan varias fichas del
// mismo tipo, van juntas en una línea con un enlace a cada una.
// Jerarquía: solo las fichas nuevas llevan rojo y negrita fuerte; el resto se
// lee como apuntes del día.

function Visual({ visual }) {
  // Solo con escudo o foto real: un círculo vacío no ayuda a reconocer nada.
  if (!visual?.path) return null
  const identity = visual.kind !== 'photo'
  return (
    <span className={styles.avatar} data-kind={identity ? 'identity' : 'photo'} aria-hidden="true">
      <Image
        src={visual.path}
        alt=""
        fill
        sizes="44px"
        unoptimized={/\.svg(?:$|\?)/i.test(visual.path)}
        style={{ objectFit: identity ? 'contain' : 'cover' }}
      />
    </span>
  )
}

function Row({ item }) {
  if (item.grouped) {
    return (
      <div className={styles.row} data-new={item.isNew || undefined} data-plain={item.visuals.length ? undefined : 'true'}>
        {item.visuals.length ? (
          <span className={styles.stack} aria-hidden="true">
            {item.visuals.map((visual, index) => <Visual key={index} visual={visual} />)}
          </span>
        ) : null}
        <div className={styles.copy}>
          <span className={styles.tag}>{item.tag}</span>
          {/* Nombres largos, uno por línea: en una sola, dos bandas parecían una. */}
          {item.links.some((link) => link.label.length > 18) ? (
            <ul className={`${styles.names} ${styles.stackedNames}`}>
              {item.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} prefetch={false} title={link.title !== link.label ? link.title : undefined}>{link.label}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <span className={styles.names}>
              {item.links.map((link, index) => (
                <span key={link.id} data-short="true">
                  {index ? <span className={styles.sep} aria-hidden="true">{'\u00a0· '}</span> : null}
                  <Link href={link.href} prefetch={false} title={link.title !== link.label ? link.title : undefined}>{link.label}</Link>
                </span>
              ))}
            </span>
          )}
          <span className={styles.detail}>{item.detail}</span>
        </div>
      </div>
    )
  }

  return (
    <Link className={styles.row} href={item.href} prefetch={false} data-new={item.isNew || undefined} data-plain={item.visual?.path ? undefined : 'true'} data-analytics-destination-name={item.title}>
      <Visual visual={item.visual} />
      <span className={styles.copy}>
        <span className={styles.tag}>{item.tag}</span>
        <strong className={styles.name}>{item.title}</strong>
        {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
      </span>
      <span className={styles.chevron} aria-hidden="true">›</span>
    </Link>
  )
}

export default function HomeKnowledgeThreads({ threads = [], embedded = true }) {
  if (!threads.length) return null
  const days = latestThreadsByDay(threads)

  return (
    <div className={styles.embedded} id="ultimos-hilos" data-analytics-related-section="ultimos_hilos" data-embedded={embedded || undefined}>
      <header className={styles.embeddedHeader}>
        <h3>Últimos hilos incorporados</h3>
        <OpenUpdatesButton className={styles.allUpdates} />
      </header>
      <div className={styles.days}>
        {days.map((day) => (
          <section key={day.dayKey} className={styles.day} aria-label={day.label}>
            <p className={styles.dayName}>{day.label}</p>
            <ul className={styles.list}>
              {day.items.map((item) => <li key={item.id}><Row item={item} /></li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
