import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodProcession.module.css'

// «El cortejo, paso a paso» (Tarea 09): la cofradía en el orden de la calle,
// de la cruz de guía al último paso. Es el único bloque de la ficha que reúne
// pasos, imágenes y música, para no repetirlos en otros sitios.

function NoteIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <circle cx="15" cy="15" r="15" fill="rgba(255,255,255,.14)" />
      <path d="M12 20.5a2.5 2.5 0 1 1-2-2.45V9l9-2v9.5a2.5 2.5 0 1 1-2-2.45V10.3l-5 1.1z" fill="currentColor" />
    </svg>
  )
}

function MusicLine({ items = [] }) {
  if (!items.length) return null
  return (
    <ul className={styles.music}>
      {items.map((item) => (
        <li key={item.id || `${item.band}-${item.position}`}>
          <NoteIcon />
          <span>
            {item.href ? <Link href={item.href}>{item.band}</Link> : <strong>{item.band}</strong>}
            {item.since ? <small>{item.since}</small> : null}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function BrotherhoodProcession({ steps = [], head = [], id = 'cortejo' }) {
  if (!steps.length) return null

  return (
    <section className={styles.section} id={id}>
      <div className="shell">
        <header className={styles.head}>
          <span className={styles.kicker}>Así lo verás en la calle</span>
          <h2>El cortejo, paso a paso</h2>
        </header>

        <ol className={styles.procession}>
          <li className={styles.cross}>
            <span className={styles.marker} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M11 2h2v6h5v2h-5v12h-2V10H6V8h5z" fill="currentColor" /></svg>
            </span>
            <div className={styles.crossCopy}>
              <span className={styles.type}>Abre el cortejo</span>
              <h3>Cruz de guía</h3>
              <MusicLine items={head} />
            </div>
          </li>

          {steps.map((step, index) => (
            <li key={step.id} className={`${styles.stop} ${step.photo?.src ? '' : styles.noPhoto}`}>
              {step.photo?.src ? (
                <Image
                  className={styles.photo}
                  src={step.photo.src}
                  alt={step.photo.alt || `Fotografía de ${step.name}`}
                  fill
                  sizes="(max-width: 759px) calc(100vw - 32px), 560px"
                  style={step.photo.position ? { objectPosition: step.photo.position } : undefined}
                />
              ) : null}
              <span className={styles.marker} aria-hidden="true">{index + 1}</span>
              {step.photo?.credit ? <small className={styles.credit}>{step.photo.credit}</small> : null}
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
