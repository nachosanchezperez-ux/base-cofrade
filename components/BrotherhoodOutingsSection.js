import Link from 'next/link'
import BrotherhoodOutingImage from './BrotherhoodOutingImage'
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

function outingCategory(outing) {
  const type = normalized(outing?.tipo)
  const title = normalized(outing?.nombre)
  const character = normalized(outing?.caracter)

  if (type.includes('estacion de penitencia')) return 'penitence'
  if (type.includes('procesion de gloria')) return 'glory'
  if (character === 'extraordinaria' || type.includes('traslado') || type.includes('extraordinaria')) return 'historical'
  if (type.includes('via crucis') || type.includes('rosario') || title.includes('via crucis') || title.includes('rosario')) return 'external'
  return 'other'
}

function categoryCopy(key, outings) {
  const first = outings[0]

  if (key === 'penitence') {
    const day = String(first?.momento || '').split('·')[0].trim()
    return {
      eyebrow: 'Salida ordinaria',
      title: [day, first?.tipo].filter(Boolean).join(' · '),
      description: 'La estación de penitencia anual de la Hermandad, con sus tiempos y recorrido documentados por edición.',
    }
  }

  if (key === 'glory') {
    const subject = String(first?.nombre || '')
      .replace(/^procesión de gloria de\s+/i, '')
      .replace(/^nuestra señora del\s+/i, 'Virgen del ')
    return {
      eyebrow: 'Salida ordinaria',
      title: ['Salida de Gloria', subject].filter(Boolean).join(' · '),
      description: 'La salida anual de la titular gloriosa, diferenciada de la estación de penitencia.',
    }
  }

  if (key === 'external') {
    return {
      eyebrow: 'Devoción en la calle',
      title: 'Cultos externos',
      description: 'Vía Crucis, rosarios vespertinos y otros cultos celebrados fuera de la sede.',
    }
  }

  if (key === 'historical') {
    return {
      eyebrow: 'Archivo de la Hermandad',
      title: 'Histórico',
      description: 'Traslados y salidas extraordinarias conservados como acontecimientos de años anteriores.',
    }
  }

  return {
    eyebrow: 'Otros registros',
    title: 'Otras salidas',
    description: 'Salidas documentadas pendientes de una clasificación editorial más específica.',
  }
}

function groupedOutings(outings) {
  const order = ['penitence', 'glory', 'external', 'historical', 'other']
  const groups = new Map(order.map((key) => [key, []]))

  outings.forEach((outing) => groups.get(outingCategory(outing)).push(outing))

  return order
    .map((key) => ({ key, outings: groups.get(key) }))
    .filter((group) => group.outings.length)
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

  const groups = groupedOutings(availableOutings)
  let runningIndex = 0

  return (
    <section className={styles.section} id="salidas">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.heading}>
          <span>La Hermandad en la calle</span>
          <div>
            <h2>Salidas</h2>
            <p>Las salidas ordinarias, los cultos externos y la memoria extraordinaria se presentan como ámbitos distintos.</p>
          </div>
        </header>

        <div className={styles.groups}>
          {groups.map((group) => {
            const copy = categoryCopy(group.key, group.outings)
            const featured = group.key === 'penitence' || group.key === 'glory'

            return (
              <section className={styles.group} key={group.key} aria-labelledby={`salidas-${group.key}`}>
                <div className={styles.groupHeading}>
                  <div>
                    <span>{copy.eyebrow}</span>
                    <h3 id={`salidas-${group.key}`}>{copy.title}</h3>
                    <p>{copy.description}</p>
                  </div>
                  <strong>{String(group.outings.length).padStart(2, '0')}</strong>
                </div>

                <div className={styles.grid}>
                  {group.outings.map((outing) => {
                    runningIndex += 1
                    return (
                      <article className={`${styles.card} ${featured ? styles.featured : ''}`} key={outing.id}>
                        <span className={styles.cardNumber} aria-hidden="true">{String(runningIndex).padStart(2, '0')}</span>
                        <BrotherhoodOutingImage outing={outing} primary={featured} />
                        <OutingText outing={outing} primary={featured} />
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}
