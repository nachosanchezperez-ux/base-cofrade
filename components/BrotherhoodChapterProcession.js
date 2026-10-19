import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TitularDetails } from './BrotherhoodChapterTitulars'
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

// Tramo de nazarenos: la figura sobre el hilo del cortejo y el acceso a su
// túnica. Las prendas están completas en el cromo (#tunica); aquí no se repiten.
function Nazarenes({ habit }) {
  return <li className={`${styles.stop} ${styles.nazarenes}`}>
    {habit.imagenPath
      ? <figure className={styles.habitFigure}><Image src={habit.imagenPath} alt="" width={1024} height={1536} sizes="110px" /></figure>
      : <span className={styles.marker} aria-hidden="true">N</span>}
    <a href={habit.anchor || '#tunica'} className={styles.habitCard}>
      <small className={styles.kind}>Nazarenos</small>
      {habit.label ? <span className={styles.habitLine}>{habit.label}</span> : null}
      <span className={styles.habitLink}>Ver la túnica <span aria-hidden="true">›</span></span>
    </a>
  </li>
}

function normalized(value = '') {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
}

// Imágenes del paso: nombre, autoría y «Sobre la imagen» (antes en Titulares).
function StepImages({ images }) {
  return <ul className={styles.images}>
    {images.map((image) => {
      const authorship = [image.autor, image.fecha].filter(Boolean).join(' · ')
      return <li key={image.id}>
        <h3 className={styles.imageName}>{image.fichaDisponible && image.slug ? <Link href={`/imagenes/${image.slug}`} prefetch={false}>{image.nombre}</Link> : image.nombre}</h3>
        {authorship ? <p className={styles.authorship}>{authorship}</p> : null}
        <TitularDetails item={image} />
      </li>
    })}
  </ul>
}

export default function BrotherhoodChapterProcession({ title = 'Pasos', crossGuide = [], steps = [], showCrossGuide = true, habitsBefore = {} }) {
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
          return <Fragment key={step.id}>
          {(habitsBefore[step.id] || []).map((habit) => <Nazarenes key={habit.id} habit={habit} />)}
          <li className={styles.stop}>
            {step.media?.path ? <figure className={styles.photo}>
              <Image src={step.media.path} alt={step.media.alt || `Fotografía de ${step.nombre}`} fill sizes="(max-width: 899px) 96px, 160px" style={{ objectPosition: step.framing || 'center' }} />
            </figure> : <span className={styles.marker} aria-hidden="true">{index + 1}</span>}
            <div className={styles.body}>
              {/* Si el nombre del paso solo repite el de sus imágenes, manda la imagen:
                  el tipo enlaza a la ficha del paso y su nombre completo queda en el título. */}
              {(() => {
                const kind = [steps.length > 1 ? `${index + 1}` : '', step.tipo].filter(Boolean).join(' · ')
                const repeats = step.images.length > 0 && step.images.every((image) => normalized(step.nombre).includes(normalized(image.nombre)))
                if (!repeats) return <>
                  <small className={styles.kind}>{kind}</small>
                  <h3>{step.fichaDisponible ? <Link href={`/pasos/${step.slug}`} prefetch={false}>{step.nombre}</Link> : step.nombre}</h3>
                </>
                return <small className={styles.kind} title={step.nombre}>
                  {step.fichaDisponible ? <Link href={`/pasos/${step.slug}`} prefetch={false} aria-label={`${kind}: ${step.nombre}`}>{kind} <span aria-hidden="true">›</span></Link> : kind}
                </small>
              })()}
              {step.images.length ? <StepImages images={step.images} /> : null}
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
          </Fragment>
        })}
      </ol>
    </div>
  </section>
}
