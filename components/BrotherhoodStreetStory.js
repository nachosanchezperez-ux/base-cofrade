import Image from 'next/image'
import { streetBadge } from '@/lib/brotherhood-street'
import styles from './BrotherhoodStreetStory.module.css'

// «En la calle» (24/11/2026): novedades que la Hermandad estrena o restaura y
// curiosidades, arriba del capítulo y en tarjetas, con el color de la
// Hermandad. Solo se pinta lo que existe.
const CURIOSITIES_VISIBLE = 3

function UpdateCard({ item }) {
  const image = String(item.imagen?.src || '').trim()
  const authorship = item.agentes?.length
    ? item.agentes.map((agent) => agent.nombre).filter(Boolean).join(', ')
    : ''
  return (
    <li className={styles.update} data-kind={item.tipo === 'Restauración' ? 'restauracion' : 'estreno'}>
      {image ? (
        <span className={styles.updateImage}>
          <Image src={image} alt={item.imagen.alt || item.titulo} fill sizes="(max-width: 700px) 100vw, 320px" />
        </span>
      ) : null}
      <span className={styles.badge}>{streetBadge(item)}</span>
      <strong className={styles.updateTitle}>{item.titulo}</strong>
      {authorship ? <span className={styles.updateBy}>{authorship}</span> : null}
      {item.descripcion ? <p className={styles.updateText}>{item.descripcion}</p> : null}
    </li>
  )
}

function CuriosityCard({ item }) {
  return (
    <li className={styles.curiosity}>
      <span className={styles.mark} aria-hidden="true">?</span>
      <span className={styles.curiosityCopy}>
        {item.categoria ? <span className={styles.curiosityKind}>{item.categoria}</span> : null}
        <strong>{item.titulo}</strong>
        <p>{item.texto}</p>
      </span>
    </li>
  )
}

export default function BrotherhoodStreetStory({ updates = [], curiosities = [] }) {
  const visibleCuriosities = curiosities.slice(0, CURIOSITIES_VISIBLE)
  const moreCuriosities = curiosities.slice(CURIOSITIES_VISIBLE)
  if (!updates.length && !curiosities.length) return null

  return (
    <div className={`shell ${styles.street}`}>
      {updates.length ? (
        <section className={styles.block} aria-labelledby="en-la-calle-novedades" id="estrenos-recientes">
          <h3 id="en-la-calle-novedades" className={styles.title}>Novedades en la calle</h3>
          <ul className={styles.updates}>
            {updates.map((item) => <UpdateCard key={item.id} item={item} />)}
          </ul>
        </section>
      ) : null}

      {curiosities.length ? (
        <section className={styles.block} aria-labelledby="en-la-calle-curiosidades" id="sabias-que">
          <h3 id="en-la-calle-curiosidades" className={styles.title}>¿Sabías que…?</h3>
          <ul className={styles.curiosities}>
            {visibleCuriosities.map((item) => <CuriosityCard key={item.id} item={item} />)}
          </ul>
          {moreCuriosities.length ? (
            <details className={styles.more}>
              <summary>Ver {moreCuriosities.length === 1 ? 'otra curiosidad' : `${moreCuriosities.length} curiosidades más`}</summary>
              <ul className={styles.curiosities}>
                {moreCuriosities.map((item) => <CuriosityCard key={item.id} item={item} />)}
              </ul>
            </details>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
