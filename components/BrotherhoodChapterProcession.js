import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodChapterProcession.module.css'

// Cortejo (o procesión) como en un programa de mano: de la Cruz de Guía al
// último paso, en orden, cada uno con su foto, sus imágenes, su capataz y la
// banda que lo acompaña. Los datos técnicos van plegados. Conserva el ancla
// #pasos de la ficha. Solo se muestran datos documentados.

function BandLink({ item }) {
  return item.bandaSlug
    ? <Link href={`/bandas/${item.bandaSlug}`} prefetch={false}>{item.banda}</Link>
    : <span>{item.banda}</span>
}

function Music({ items = [], fallback = '' }) {
  if (!items.length && !fallback) return null
  return <p className={styles.music}>
    <span className={styles.musicIcon} aria-hidden="true">♪</span>
    <span>
      <small>Lo acompaña{items.length === 1 && /^desde\s+\d{4}$/i.test(String(items[0].periodo || '').trim()) ? ` ${String(items[0].periodo).trim().toLowerCase()}` : ''}</small>
      {items.length
        ? items.map((item, index) => <span key={item.id || item.banda}>{index ? ' · ' : ''}<BandLink item={item} /></span>)
        : <span>{fallback}</span>}
    </span>
  </p>
}

export default function BrotherhoodChapterProcession({ title = 'Pasos', crossGuide = [], steps = [], showCrossGuide = true }) {
  if (!steps.length && !crossGuide.length) return null
  return <section className={`section ${styles.section}`} id="pasos" aria-labelledby="pasos-titulo">
    <div className="shell">
      <h2 className={styles.title} id="pasos-titulo">{title}</h2>
      <ol className={styles.order}>
        {showCrossGuide && crossGuide.length ? <li className={`${styles.stop} ${styles.cross}`}>
          <span className={styles.marker} aria-hidden="true">✝</span>
          <div className={styles.body}>
            <small className={styles.kind}>Abre el cortejo</small>
            <h3>Cruz de Guía</h3>
            <Music items={crossGuide} />
          </div>
        </li> : null}

        {steps.map((step, index) => {
          const technical = [step.ejecucion, step.sistemaPortadores, step.materiales].filter(Boolean)
          const hasDetails = step.descripcion || technical.length || step.estadoActual
          return <li key={step.id} className={styles.stop}>
            {step.media?.path ? <figure className={styles.photo}>
              <Image src={step.media.path} alt={step.media.alt || `Fotografía de ${step.nombre}`} fill sizes="(max-width: 899px) 96px, 160px" style={{ objectPosition: step.framing || 'center' }} />
            </figure> : <span className={styles.marker} aria-hidden="true">{index + 1}</span>}
            <div className={styles.body}>
              <small className={styles.kind}>{[steps.length > 1 ? `${index + 1}` : '', step.tipo].filter(Boolean).join(' · ')}</small>
              <h3>{step.fichaDisponible ? <Link href={`/pasos/${step.slug}`} prefetch={false}>{step.nombre}</Link> : step.nombre}</h3>
              {step.images.length ? <p className={styles.images}>
                {step.images.map((image, imageIndex) => <span key={image.id}>
                  {imageIndex ? ' · ' : ''}
                  {image.fichaDisponible && image.slug ? <Link href={`/imagenes/${image.slug}`} prefetch={false}>{image.nombre}</Link> : image.nombre}
                  {image.autor ? <em>, de {image.autor}{image.fecha ? ` (${image.fecha})` : ''}</em> : null}
                </span>)}
              </p> : null}
              {step.figures.length ? <p className={styles.figures}>Figuras: {step.figures.map((image, i) => <span key={image.id}>{i ? ', ' : ''}{image.fichaDisponible && image.slug ? <Link href={`/imagenes/${image.slug}`} prefetch={false}>{image.nombre}</Link> : image.nombre}</span>)}</p> : null}
              {step.capataz ? <p className={styles.people}>Capataz: <strong>{step.capataz}</strong></p> : null}
              <Music items={step.music} fallback={step.musicFallback} />
              {step.media?.credit ? <small className={styles.credit}>Foto: {step.media.credit.replace(/^Fotograf[ií]a\s*·\s*/i, '')}</small> : null}
              {hasDetails ? <details className={styles.more}>
                <summary>Diseño y datos técnicos <b aria-hidden="true">+</b></summary>
                {step.descripcion ? <p>{step.descripcion}</p> : null}
                {technical.length ? <p className={styles.technical}>{technical.join(' · ')}</p> : null}
                {step.estadoActual ? <p>{step.estadoActual}</p> : null}
              </details> : null}
            </div>
          </li>
        })}
      </ol>
    </div>
  </section>
}
