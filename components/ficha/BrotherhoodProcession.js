import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodProcession.module.css'

// «Así es su cortejo» (Tarea 09): la cofradía en el orden en que se ve en la
// calle, de la cruz de guía al último paso, con las imágenes que van en cada
// paso y la música que los acompaña. Solo usa pasos, titulares y
// acompañamientos vigentes ya documentados en la ficha.

function bypassOptimizer(src = '') {
  return String(src).startsWith('/')
}

function MusicLine({ items = [] }) {
  if (!items.length) return null
  return (
    <ul className={styles.music}>
      {items.map((item) => (
        <li key={item.id || `${item.band}-${item.position}`}>
          <span className={styles.musicIcon} aria-hidden="true">♪</span>
          <span>
            {item.position ? <small>{item.position}</small> : null}
            {item.href ? <Link href={item.href}>{item.band}</Link> : <strong>{item.band}</strong>}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function BrotherhoodProcession({ day = '', steps = [], head = [], id = 'cortejo' }) {
  if (!steps.length) return null

  return (
    <section className={`section ${styles.section}`} id={id}>
      <div className="shell">
        <div className="section-heading">
          <span className="eyebrow">{day ? `${day} · en la calle` : 'En la calle'}</span>
          <h2>Así es su cortejo</h2>
          <p>De la cruz de guía al último paso: qué imágenes procesionan y qué música suena tras cada uno.</p>
        </div>

        <ol className={styles.procession}>
          <li className={styles.head}>
            <span className={styles.marker} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M11 2h2v6h5v2h-5v12h-2V10H6V8h5z" /></svg>
            </span>
            <div className={styles.headCopy}>
              <strong>Cruz de guía</strong>
              <MusicLine items={head} />
            </div>
          </li>

          {steps.map((step, index) => (
            <li key={step.id} className={styles.step}>
              <span className={styles.marker} aria-hidden="true">{index + 1}</span>
              <article className={styles.card}>
                {step.photo?.src ? (
                  <figure className={styles.photo}>
                    <Image
                      src={step.photo.src}
                      alt={step.photo.alt || `Fotografía de ${step.name}`}
                      fill
                      unoptimized={bypassOptimizer(step.photo.src)}
                      sizes="(max-width: 719px) calc(100vw - 72px), 420px"
                      style={step.photo.position ? { objectPosition: step.photo.position } : undefined}
                    />
                    {step.photo.credit ? <figcaption>{step.photo.credit}</figcaption> : null}
                  </figure>
                ) : null}
                <div className={styles.copy}>
                  {step.type ? <span className={styles.type}>{step.type}</span> : null}
                  <h3>{step.href ? <Link href={step.href}>{step.name}</Link> : step.name}</h3>
                  {step.titulars?.length ? (
                    <p className={styles.titulars}>
                      {step.titulars.map((titular, titularIndex) => (
                        <span key={titular.id || titular.name}>
                          {titularIndex > 0 ? ' · ' : null}
                          {titular.href ? <Link href={titular.href}>{titular.name}</Link> : titular.name}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  <MusicLine items={step.music} />
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
