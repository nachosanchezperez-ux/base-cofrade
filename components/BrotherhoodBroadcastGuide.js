import Link from 'next/link'
import styles from './BrotherhoodBroadcastGuide.module.css'

function fact(label, value) {
  if (!value) return null
  return { label, value }
}

export default function BrotherhoodBroadcastGuide({ guide }) {
  if (!guide?.outing?.date) return null

  const { brotherhood, outing, crew = [], music = [], cues = [], theme = {} } = guide
  const operationalFacts = [
    fact('Salida', outing.departure),
    fact('Entrada', outing.return),
    fact('Origen', outing.origin),
    fact('Destino', outing.destination),
  ].filter(Boolean)
  const shortcuts = [
    { href: '#salidas', label: 'Salida y recorrido', visible: true },
    { href: '#pasos', label: 'Paso y capataces', visible: crew.length > 0 },
    { href: '#acompanamiento-musical', label: 'Acompañamiento', visible: music.length > 0 },
    { href: '#historia', label: 'Historia', visible: cues.length > 0 },
  ].filter((item) => item.visible)

  return (
    <section
      className={styles.section}
      id="guia-retransmision"
      data-broadcast-guide="true"
      aria-labelledby="broadcast-guide-title"
      style={{
        '--broadcast-primary': theme.primary || '#153B69',
        '--broadcast-secondary': theme.secondary || '#C7A24A',
        '--broadcast-light': theme.light || '#FFFFFF',
        '--broadcast-dark': theme.dark || '#0D2949',
        '--broadcast-on-secondary': theme.onSecondary || '#153B50',
      }}
    >
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <div className={styles.dateBlock} aria-label={outing.date.long}>
            <span>{outing.date.month}</span>
            <strong>{outing.date.day}</strong>
            <small>{outing.date.year}</small>
          </div>

          <div className={styles.heading}>
            <div className={styles.eyebrowRow}>
              <span className={styles.liveMarker}><i /> Guía rápida</span>
              {outing.type ? <span>{outing.type}</span> : null}
              {brotherhood.locality ? <span>{brotherhood.locality}</span> : null}
            </div>
            <p className={styles.kicker}>Apoyo para la retransmisión</p>
            <h2 id="broadcast-guide-title">{outing.title}</h2>
            <time dateTime={outing.date.iso}>{outing.date.long}</time>
          </div>

          <nav className={styles.shortcuts} aria-label="Accesos rápidos de la guía">
            {shortcuts.map((item) => (
              <a href={item.href} key={item.href}>{item.label}<span aria-hidden="true">↓</span></a>
            ))}
          </nav>
        </header>

        <div className={styles.primaryGrid}>
          <article className={styles.eventCard}>
            <div className={styles.cardTopline}>
              <span>En la calle</span>
              {outing.character ? <small>{outing.character}</small> : null}
            </div>

            <h3>{brotherhood.name}</h3>
            {outing.subjects?.length > 0 ? (
              <div className={styles.subjects}>
                <small>Titular</small>
                {outing.subjects.map((subject) => (
                  subject.slug
                    ? <Link href={`/imagenes/${subject.slug}`} key={subject.slug}>{subject.name}</Link>
                    : <strong key={subject.name}>{subject.name}</strong>
                ))}
              </div>
            ) : null}

            {operationalFacts.length > 0 ? (
              <dl className={styles.operations}>
                {operationalFacts.map((item) => (
                  <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>
                ))}
              </dl>
            ) : null}

            {outing.routeSummary ? (
              <div className={styles.routeSummary}>
                <small>Recorrido documentado</small>
                <p>{outing.routeSummary}</p>
              </div>
            ) : null}

            {outing.route?.length > 0 ? (
              <details className={styles.routeDetails}>
                <summary>Consultar itinerario completo <span>＋</span></summary>
                <div>{outing.route.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div>
              </details>
            ) : null}

            {outing.description ? <p className={styles.description}>{outing.description}</p> : null}
            {(brotherhood.seat || brotherhood.locality) ? (
              <p className={styles.seat}>
                <span aria-hidden="true">⌖</span>
                {[brotherhood.seat, brotherhood.locality].filter(Boolean).join(' · ')}
              </p>
            ) : null}
          </article>

          <div className={styles.peopleAndMusic}>
            {crew.length > 0 ? (
              <article className={styles.infoCard}>
                <div className={styles.cardTopline}><span>Mandos del paso</span></div>
                <div className={styles.infoList}>
                  {crew.map((item) => (
                    <div className={styles.infoRow} key={`${item.step}-${item.people.join('-')}`}>
                      <small>{item.step}</small>
                      <strong>{item.people.join(' · ')}</strong>
                      {item.period ? <span>{item.period}</span> : null}
                    </div>
                  ))}
                </div>
              </article>
            ) : null}

            {music.length > 0 ? (
              <article className={styles.infoCard}>
                <div className={styles.cardTopline}><span>Música procesional</span></div>
                <div className={styles.infoList}>
                  {music.map((item) => (
                    <Link className={styles.musicRow} href={`/bandas/${item.slug}`} key={item.id}>
                      <small>{item.position || item.outing || 'Acompañamiento musical'}</small>
                      <strong>{item.name}</strong>
                      <span>{[item.type, item.period].filter(Boolean).join(' · ')}</span>
                      <b aria-hidden="true">→</b>
                    </Link>
                  ))}
                </div>
              </article>
            ) : null}
          </div>
        </div>

        {cues.length > 0 ? (
          <section className={styles.commentary} aria-labelledby="broadcast-commentary-title">
            <header>
              <span>Claves para el comentario</span>
              <h3 id="broadcast-commentary-title">Datos que ayudan a contar la procesión</h3>
            </header>
            <div className={styles.cueGrid}>
              {cues.map((cue) => (
                <article key={`${cue.year}-${cue.title}`}>
                  <span>{cue.year}</span>
                  <h4>{cue.title}</h4>
                  {cue.text ? <p>{cue.text}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
