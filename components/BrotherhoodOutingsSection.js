import Image from 'next/image'
import Link from 'next/link'
import styles from './BrotherhoodOutingsSection.module.css'

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

function characterLabel(outing) {
  const character = String(outing?.caracter || '').trim()
  if (!character) return ''
  return normalized(outing?.tipo).includes(normalized(character)) ? '' : character
}

function guideHref(outing) {
  const slug = String(outing?.slug || '').trim()
  if (!slug) return ''
  if (slug.startsWith('gloria/')) return `/procesiones-de-gloria/${slug.slice('gloria/'.length)}`
  return `/extraordinarias/${slug}`
}

function outingScore(outing) {
  const type = normalized(outing?.tipo)
  const character = normalized(outing?.caracter)
  if (type.includes('estacion de penitencia')) return 100
  if (type.includes('procesion de gloria')) return 90
  if (character === 'ordinaria' || character === 'anual') return 60
  if (outing?.imagen?.src) return 20
  return 0
}

function orderedOutings(outings) {
  return outings
    .map((outing, index) => ({ outing, index }))
    .sort((left, right) => outingScore(right.outing) - outingScore(left.outing) || left.index - right.index)
    .map(({ outing }) => outing)
}

function sectionCopy(outings) {
  const types = outings.map((outing) => normalized(outing.tipo))
  const hasPenitence = types.some((type) => type.includes('estacion de penitencia'))
  const hasGlory = types.some((type) => type.includes('procesion de gloria'))

  if (hasPenitence) {
    return {
      eyebrow: 'La cofradía en la calle',
      title: 'Estación de penitencia',
      description: hasGlory
        ? 'La jornada principal y las demás salidas documentadas, leídas como acontecimientos vivos de la Hermandad.'
        : 'La jornada principal de la Hermandad: sus tiempos, sus titulares y el recorrido documentado de cada edición.',
    }
  }

  if (hasGlory) {
    return {
      eyebrow: 'La devoción en la calle',
      title: outings.length === 1 ? 'Procesión de gloria' : 'Procesiones de gloria',
      description: 'Cada salida como una jornada completa: fecha, recorrido, lugares y memoria visual.',
    }
  }

  return {
    eyebrow: 'En la calle',
    title: 'Salidas',
    description: 'Procesiones, rosarios, vía crucis y traslados documentados en la historia de la Hermandad.',
  }
}

function OutingImage({ outing, primary = false }) {
  if (!outing.imagen?.src) {
    return (
      <div className={`${styles.imageFallback} ${primary ? styles.primaryFallback : ''}`} aria-hidden="true">
        <span>{String(outing.tipo || 'Salida').slice(0, 1)}</span>
        <i />
        <b>{outing.caracter || 'Memoria procesional'}</b>
      </div>
    )
  }

  return (
    <figure className={styles.image}>
      <Image
        src={outing.imagen.src}
        alt={outing.imagen.alt || `Fotografía de ${outing.nombre}`}
        fill
        sizes={primary
          ? '(max-width: 820px) calc(100vw - 32px), (max-width: 1280px) 52vw, 690px'
          : '(max-width: 720px) calc(100vw - 32px), 420px'}
      />
      {outing.imagen.credito ? <figcaption>Fotografía · {outing.imagen.credito}</figcaption> : null}
    </figure>
  )
}

function Movements({ outing }) {
  if (!outing.movimientos?.length) return null

  return (
    <div className={styles.movements} aria-label="Momentos de la salida">
      {outing.movimientos.map((movement, index) => (
        <div className={styles.movement} key={`${outing.id}-${movement.sentido}-${index}`}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>{movement.sentido}</strong>
            <p>{movement.momento}</p>
            {movement.destino ? <small>{movement.destino}</small> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function RouteEditions({ outing }) {
  if (!outing.ediciones?.length) return null

  return outing.ediciones.map((edition) => (
    <div className={styles.edition} key={`${outing.id}-${edition.ano}`}>
      <div className={styles.editionHead}>
        <div>
          <span>Itinerario documentado</span>
          <strong>{edition.ano}</strong>
        </div>
        <div className={styles.times}>
          <div><small>Salida</small><strong>{edition.salida}</strong></div>
          <i aria-hidden="true" />
          <div><small>Entrada</small><strong>{edition.entrada}</strong></div>
        </div>
      </div>
      {edition.recorrido?.length ? (
        <details className={styles.route}>
          <summary>Recorrer la jornada <span aria-hidden="true">＋</span></summary>
          <ol>
            {edition.recorrido.map((place, index) => (
              <li className={normalized(place) === 'carrera oficial' ? styles.officialRoute : ''} key={`${edition.ano}-${place}-${index}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{place}</strong>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </div>
  ))
}

function Video({ outing }) {
  if (!outing.video) return null

  return (
    <aside className={styles.video} aria-label={`Vídeo oficial de ${outing.nombre}`}>
      <div className={styles.videoHeading}>
        <div><span>Archivo audiovisual</span><strong>{outing.video.titulo}</strong></div>
        {outing.video.autor ? <small>Canal oficial · {outing.video.autor}</small> : null}
      </div>
      <div className={styles.videoFrame}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(outing.video.id)}?rel=0`}
          title={outing.video.titulo}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <a href={outing.video.url} target="_blank" rel="noreferrer">Ver en el canal de la Hermandad ↗</a>
    </aside>
  )
}

function OutingText({ outing, primary = false }) {
  const href = guideHref(outing)
  const label = characterLabel(outing)

  return (
    <div className={styles.copy}>
      <div className={styles.meta}>
        <span>{outing.tipo}</span>
        {label ? <small>{label}</small> : null}
      </div>
      <h3>{outing.nombre}</h3>
      {outing.titulares ? <p className={styles.subject}>{outing.titulares}</p> : null}
      {(outing.momento || outing.destino) ? (
        <dl className={styles.facts}>
          {outing.momento ? <div><dt>Cuándo</dt><dd>{outing.momento}</dd></div> : null}
          {outing.destino ? <div><dt>{primary ? 'Horizonte' : 'Recorrido'}</dt><dd>{outing.destino}</dd></div> : null}
        </dl>
      ) : null}
      <Movements outing={outing} />
      <Video outing={outing} />
      <RouteEditions outing={outing} />
      {href ? <Link className={styles.guide} href={href}>Abrir guía de la salida <span aria-hidden="true">↗</span></Link> : null}
    </div>
  )
}

export default function BrotherhoodOutingsSection({ outings = [] }) {
  const availableOutings = Array.isArray(outings) ? outings : []
  if (!availableOutings.length) return null

  const ordered = orderedOutings(availableOutings)
  const [primary, ...secondary] = ordered
  const copy = sectionCopy(ordered)

  return (
    <section className={styles.section} id="salidas">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.heading}>
          <span>{copy.eyebrow}</span>
          <div>
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
        </header>

        <article className={styles.primary}>
          <div className={styles.primaryNumber} aria-hidden="true">01</div>
          <OutingImage outing={primary} primary />
          <OutingText outing={primary} primary />
        </article>

        {secondary.length ? (
          <div className={styles.archive}>
            <div className={styles.archiveHeading}>
              <span>Otras salidas documentadas</span>
              <strong>{String(secondary.length).padStart(2, '0')}</strong>
            </div>
            <div className={styles.grid}>
              {secondary.map((outing, index) => (
                <article className={styles.card} key={outing.id}>
                  <span className={styles.cardNumber} aria-hidden="true">{String(index + 2).padStart(2, '0')}</span>
                  <OutingImage outing={outing} />
                  <OutingText outing={outing} />
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
