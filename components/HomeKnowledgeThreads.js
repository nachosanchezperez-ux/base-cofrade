import Image from 'next/image'
import Link from 'next/link'
import styles from './HomeKnowledgeThreads.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

function ThreadVisual({ visual, compact = false }) {
  if (!visual?.path) return null
  const identity = visual.kind !== 'photo'
  const unoptimized = /\.svg(?:$|\?)/i.test(visual.path)

  return (
    <span
      className={`${styles.visual} ${compact ? styles.visualCompact : ''}`}
      data-kind={visual.kind || 'photo'}
      aria-hidden="true"
    >
      <Image
        src={visual.path}
        alt=""
        fill
        sizes={compact ? '52px' : '78px'}
        unoptimized={unoptimized}
        style={{ objectFit: identity ? 'contain' : 'cover' }}
      />
    </span>
  )
}

function ThreadStatus({ thread }) {
  if (!thread.activityStatus && !thread.dateLabel) return null

  return (
    <span className={styles.activity}>
      {thread.activityStatus ? (
        <strong className={styles.status} data-status={thread.activityStatus}>
          {thread.activityStatus}
        </strong>
      ) : null}
      {thread.dateLabel ? <time dateTime={thread.dateTime}>{thread.dateLabel}</time> : null}
    </span>
  )
}

function ThreadPath({ thread, compact = false }) {
  if (!thread.path?.length) return null

  return (
    <span
      className={`${styles.path} ${compact ? styles.pathCompact : ''} ${polishStyles.threadsPath} ${compact ? polishStyles.threadsCompactPath : ''}`}
      aria-label={`Ruta de descubrimiento: ${thread.path.join(', ')}`}
    >
      {thread.path.map((step, index) => (
        <span key={`${thread.id}-${step}`}>
          {index ? <i aria-hidden="true">→</i> : null}
          {step}
        </span>
      ))}
    </span>
  )
}

function LeadThread({ thread }) {
  const visualContext = thread.visual?.contextName && thread.visual.contextName !== thread.title
    ? thread.visual.contextName
    : ''

  return (
    <Link className={`${styles.leadCard} ${polishStyles.threadsLead}`} href={thread.href}>
      <div className={styles.leadTopline}>
        <span className={styles.latest}><i aria-hidden="true" /> Más reciente</span>
        <ThreadStatus thread={thread} />
      </div>

      <div className={`${styles.leadIdentity} ${thread.visual?.path ? styles.leadIdentityVisual : ''}`}>
        <ThreadVisual visual={thread.visual} />
        <div className={styles.leadCopy}>
          <span className={styles.relation}>{thread.label}</span>
          {visualContext ? <span className={styles.context}>En {visualContext}</span> : null}
          <h3>{thread.title}</h3>
          <strong className={styles.metric}>{thread.metric}</strong>
        </div>
      </div>

      <p className={`${styles.summary} ${polishStyles.threadsSummary}`}>{thread.summary}</p>
      <ThreadPath thread={thread} />

      <span className={`${styles.leadCta} ${polishStyles.threadsLeadCta}`}>
        <span>{thread.cta}</span>
        <b aria-hidden="true">→</b>
      </span>
    </Link>
  )
}

function CompactThread({ thread }) {
  const visualContext = thread.visual?.contextName && thread.visual.contextName !== thread.title
    ? thread.visual.contextName
    : ''

  return (
    <Link className={`${styles.compactCard} ${polishStyles.threadsCompact}`} href={thread.href}>
      <div className={styles.compactTopline}>
        <span className={styles.relation}>{thread.label}</span>
        <ThreadStatus thread={thread} />
      </div>

      <div className={`${styles.compactIdentity} ${thread.visual?.path ? styles.compactIdentityVisual : ''}`}>
        <ThreadVisual visual={thread.visual} compact />
        <div className={styles.compactCopy}>
          {visualContext ? <span className={styles.context}>En {visualContext}</span> : null}
          <h3>{thread.title}</h3>
          <strong className={styles.compactMetric}>{thread.metric}</strong>
        </div>
      </div>

      <ThreadPath thread={thread} compact />
      <span className={styles.compactCta} aria-hidden="true">→</span>
    </Link>
  )
}

export default function HomeKnowledgeThreads({ threads = [] }) {
  if (!threads.length) return null

  const [lead, ...secondary] = threads

  return (
    <section className={`${styles.section} ${polishStyles.threadsSection}`} id="ultimos-hilos">
      <div className="shell">
        <header className={`${styles.header} ${polishStyles.threadsHeader}`}>
          <div>
            <span className={styles.eyebrow}>Conocimiento en movimiento</span>
            <h2>Últimos hilos incorporados</h2>
          </div>
          <p>Lo último que ha crecido dentro de la enciclopedia, priorizando incorporaciones y relaciones distintas para que cada visita abra un camino nuevo.</p>
        </header>

        <div className={`${styles.layout} ${polishStyles.threadsLayout}`}>
          <LeadThread thread={lead} />

          {secondary.length ? (
            <aside className={`${styles.more} ${polishStyles.threadsMore}`} aria-label="Más incorporaciones recientes">
              <span className={styles.moreLabel}>También incorporado</span>
              <div className={styles.moreList}>
                {secondary.map((thread) => <CompactThread thread={thread} key={thread.id} />)}
              </div>
            </aside>
          ) : null}
        </div>
      </div>
    </section>
  )
}
